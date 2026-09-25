#!/usr/bin/env python3
"""
scrape_site.py - crawl a JavaScript-rendered website and save a local copy of it.

Output (inside --out, default ./mirror):
  raw/<host>/...          every file the site serves: HTML shell, JS, CSS, fonts, images, PDFs.
                          Preview it with:  npx serve -s mirror/raw/<host>
  rendered/<route>.html   DOM snapshot of each page AFTER JavaScript has run
  content/<route>.md      readable Markdown of each page (plus text revealed by clicking accordions)
  site.json               manifest: routes, titles, meta tags, headings, links, images, files
  SITE_STRUCTURE.md       route tree generated from the crawl

Setup:
  pip install -r requirements.txt
  playwright install chromium

Run:
  python scrape_site.py https://genlab.cc/ --out mirror

It honours robots.txt, pauses between pages and never leaves the starting host.
Only copy sites you own or have permission to copy.
"""
import argparse
import hashlib
import json
import mimetypes
import re
import time
import urllib.request
from collections import deque
from datetime import datetime, timezone
from pathlib import Path
from urllib import robotparser
from urllib.parse import unquote, urldefrag, urljoin, urlparse

from bs4 import BeautifulSoup
from markdownify import markdownify as to_md
from playwright.sync_api import Error as PWError
from playwright.sync_api import TimeoutError as PWTimeout
from playwright.sync_api import sync_playwright

UA = "Mozilla/5.0 (compatible; site-mirror/1.0; personal archive)"
PAGE_EXT = {"", ".html", ".htm", ".php", ".aspx"}
SECTION_TAGS = ["section", "header", "footer", "main", "article", "nav"]
NOISE_IDS = {"root", "app", "__next", "__nuxt"}

# Scroll the whole page so lazy / scroll-triggered sections get rendered.
SCROLL_JS = """
async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const step = Math.max(300, Math.floor(window.innerHeight * 0.8));
  for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await sleep(120);
  }
  window.scrollTo(0, 0);
  await sleep(300);
}
"""
OPEN_DETAILS_JS = "() => document.querySelectorAll('details:not([open])').forEach(d => d.open = true)"

# Things that usually hide text until clicked: aria accordions and bare "+" icons (typical FAQ blocks).
TOGGLES = ['[aria-expanded="false"]', "xpath=//*[not(*) and normalize-space(.)='+']"]
LABEL_JS = """
el => {
  const c = el.closest('summary, li, [class*="item" i], [class*="faq" i], [class*="accordion" i], div') || el;
  return (c.innerText || '').split('\\n').map(s => s.trim()).filter(Boolean)[0] || '';
}
"""


# ----------------------------------------------------------------------------- url helpers
def clean_url(url):
    """Drop the #fragment and any trailing slash so the same page is never queued twice."""
    url, _ = urldefrag(url)
    p = urlparse(url)
    path = p.path or "/"
    if len(path) > 1 and path.endswith("/"):
        path = path[:-1]
    return p._replace(path=path).geturl()


def ext_of(url):
    return Path(unquote(urlparse(url).path)).suffix.lower()


def route_of(url):
    p = urlparse(url)
    return (p.path or "/") + (f"?{p.query}" if p.query else "")


def safe_parts(path):
    return [re.sub(r'[<>:"|?*\\]', "_", unquote(x)) for x in path.split("/") if x not in ("", ".", "..")]


def stem_of(url):
    """File name (without extension) used for rendered/ and content/ copies of a route."""
    p = urlparse(url)
    stem = "/".join(safe_parts(p.path)) or "index"
    if p.query:
        stem += "__" + hashlib.md5(p.query.encode()).hexdigest()[:8]
    return stem


def raw_path(out, url, ctype=""):
    """Where a downloaded file lives: raw/<host>/<same path the site uses>."""
    p = urlparse(url)
    parts = safe_parts(p.path)
    base = out / "raw" / p.netloc.replace(":", "_")
    if parts and Path(parts[-1]).suffix:
        return base.joinpath(*parts)  # query string dropped: static servers ignore it
    if "html" in ctype or not parts:
        return base.joinpath(*parts, "index.html")
    ext = mimetypes.guess_extension(ctype.split(";")[0].strip()) or ".bin"
    tag = "__" + hashlib.md5(p.query.encode()).hexdigest()[:8] if p.query else ""
    return base.joinpath(*parts[:-1], parts[-1] + tag + ext)


def write_text(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def http_get_text(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=15) as r:
        return r.headers.get("content-type", ""), r.read().decode("utf-8", "replace")


# ----------------------------------------------------------------------------- robots / sitemap
def load_robots(origin):
    """Return (parser or None, sitemap urls). SPAs often answer /robots.txt with their HTML shell - ignore that."""
    try:
        ctype, body = http_get_text(origin + "/robots.txt")
        if "html" in ctype or "<html" in body[:500].lower():
            return None, []
        rp = robotparser.RobotFileParser()
        rp.parse(body.splitlines())
        return rp, re.findall(r"(?im)^\s*sitemap:\s*(\S+)", body)
    except Exception:
        return None, []


def sitemap_urls(origin, hinted):
    found = []
    for sm in hinted or [origin + "/sitemap.xml"]:
        try:
            ctype, body = http_get_text(sm)
            if "xml" in ctype or body.lstrip().startswith("<?xml"):
                found += re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", body)
        except Exception:
            pass
    return found


# ----------------------------------------------------------------------------- file downloads
class Mirror:
    """Downloads files (assets, PDFs, ...) into raw/<host>/ keeping the site's own paths."""

    def __init__(self, ctx, out, host, third_party, max_bytes):
        self.ctx, self.out, self.host = ctx, out, host
        self.third_party, self.max_bytes = third_party, max_bytes
        self.files, self.failed = {}, {}

    def wanted(self, url):
        u = urlparse(url)
        return u.scheme in ("http", "https") and (self.third_party or u.netloc == self.host)

    def save(self, url, body, ctype):
        dest = raw_path(self.out, url, ctype)
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(body)
        self.files[url] = {"saved_as": dest.relative_to(self.out).as_posix(), "content_type": ctype, "bytes": len(body)}
        return dest

    def fetch(self, url):
        url, _ = urldefrag(url)
        if url in self.files or url in self.failed or not self.wanted(url):
            return
        try:
            r = self.ctx.request.get(url, timeout=30_000)
        except PWError as e:
            self.failed[url] = str(e).splitlines()[0]
            return
        ctype = r.headers.get("content-type", "")
        if not r.ok:
            self.failed[url] = f"HTTP {r.status}"
        elif "html" in ctype and ext_of(url) not in PAGE_EXT:
            self.failed[url] = "server answered with its HTML page instead of the file (soft 404)"
        else:
            body = r.body()
            if len(body) > self.max_bytes:
                self.failed[url] = "bigger than --max-mb"
                return
            dest = self.save(url, body, ctype)
            if dest.suffix == ".css":
                self.follow_css(url, body)

    def follow_css(self, base, body):
        """Fonts / images referenced only from CSS (may not load at this viewport size)."""
        for ref in re.findall(r"url\(\s*['\"]?([^'\")\s]+)['\"]?\s*\)", body.decode("utf-8", "replace")):
            if not ref.startswith(("data:", "#")):
                self.fetch(urljoin(base, ref))


# ----------------------------------------------------------------------------- page analysis
def analyse(html, base_url, host):
    soup = BeautifulSoup(html, "lxml")
    meta = {}
    for m in soup.find_all("meta"):
        key = m.get("name") or m.get("property")
        if key and m.get("content") is not None:
            meta[key] = m["content"]
    headings = [
        {"level": int(h.name[1]), "text": h.get_text(" ", strip=True)}
        for h in soup.find_all(re.compile(r"^h[1-6]$"))
        if h.get_text(strip=True)
    ]

    links = {"internal": [], "external": [], "contact": [], "files": []}
    seen, anchors = set(), set()
    for a in soup.find_all("a", href=True):
        href, text = a["href"].strip(), a.get_text(" ", strip=True)
        if not href or href.lower().startswith("javascript:"):
            continue
        if href.lower().startswith(("mailto:", "tel:")):
            if href not in seen:
                seen.add(href)
                links["contact"].append({"url": href, "text": text})
            continue
        absolute = urljoin(base_url, href)
        u = urlparse(absolute)
        if u.scheme not in ("http", "https"):
            continue
        target, frag = urldefrag(absolute)
        same_host = u.netloc == host
        if same_host and frag and clean_url(target) == clean_url(base_url):
            anchors.add(frag)
        key = clean_url(target) if same_host else absolute
        if key in seen:
            continue
        seen.add(key)
        if not same_host:
            links["external"].append({"url": absolute, "text": text})
        elif ext_of(target) in PAGE_EXT:
            links["internal"].append({"url": clean_url(target), "text": text})
        else:
            links["files"].append({"url": target, "text": text})

    sections, seen_ids = [], set()
    for el in soup.find_all(id=True):
        i = el["id"]
        if i in NOISE_IDS or i in seen_ids:
            continue
        if el.name in SECTION_TAGS or i in anchors:
            seen_ids.add(i)
            sections.append(i)

    images = []
    for img in soup.find_all("img"):
        src = (img.get("src") or "").strip()
        if src and not src.startswith("data:"):
            images.append({"src": urljoin(base_url, src), "alt": img.get("alt", "")})

    head_assets = [
        urljoin(base_url, l["href"])
        for l in soup.find_all("link", href=True)
        if set(l.get("rel") or []) & {"icon", "shortcut", "apple-touch-icon", "manifest", "stylesheet"}
    ]
    head_assets += [urljoin(base_url, meta[k]) for k in ("og:image", "twitter:image") if meta.get(k)]

    return {
        "title": soup.title.get_text(strip=True) if soup.title else "",
        "meta": meta,
        "headings": headings,
        "sections": sections,
        "links": links,
        "images": images,
        "head_assets": head_assets,
    }


def to_markdown(html, base_url):
    soup = BeautifulSoup(html, "lxml")
    for t in soup(["script", "style", "noscript", "template", "svg", "canvas", "iframe"]):
        t.decompose()
    for img in soup.find_all("img"):
        src = img.get("src") or ""
        if not src or src.startswith("data:"):
            img.replace_with(f"[image: {img.get('alt')}]" if img.get("alt") else "")
        else:
            img["src"] = urljoin(base_url, src)
    for a in soup.find_all("a", href=True):
        if not a["href"].lower().startswith(("mailto:", "tel:", "javascript:")):
            a["href"] = urljoin(base_url, a["href"])
    md = to_md(str(soup.body or soup), heading_style="ATX", bullets="-")
    md = re.sub(r"[ \t]+\n", "\n", md)
    return re.sub(r"\n{3,}", "\n\n", md).strip()


# ----------------------------------------------------------------------------- interaction
ICON_TAIL = re.compile(r"\s*[+\-\u2212\u2013\u00d7\u2715\u25be\u25b4\u25b2\u25bc]+$")


def norm_line(line):
    """Ignore the +/- icon that flips when an accordion item opens or closes."""
    return ICON_TAIL.sub("", line).strip()


def visible_lines(page):
    text = page.evaluate("() => document.body.innerText")
    return [l.strip() for l in text.splitlines() if l.strip()]


def reveal_toggles(page, extra_selectors):
    """Click accordion-style toggles one at a time and record the text each one reveals."""
    handles = []
    for sel in TOGGLES + list(extra_selectors):
        try:
            handles += page.query_selector_all(sel)
        except PWError:
            pass
    revealed, start_url = [], page.url
    for el in handles[:80]:
        try:
            if not el.is_visible():
                continue
            before = {norm_line(l) for l in visible_lines(page)}
            label = norm_line(el.evaluate(LABEL_JS))
            try:
                el.click(timeout=2500)
            except PWError:
                el.evaluate("e => e.click()")  # icon covered by another element: click via script
            page.wait_for_timeout(400)
            if page.url != start_url:  # the click navigated somewhere: undo it
                page.go_back(wait_until="networkidle")
                continue
            new = [l for l in visible_lines(page) if norm_line(l) not in before and len(l) > 1]
            if new:
                revealed.append({"toggle": label, "text": new})
        except PWError:
            continue
    return revealed


# ----------------------------------------------------------------------------- reports
def write_structure(out, host, pages, mirror, started):
    lines = [
        f"# Site structure - {host}",
        "",
        f"Crawled {started} | {len(pages)} pages | {len(mirror.files)} files saved",
        "",
        "## Routes",
        "",
    ]
    routes, shown = {p["route"] for p in pages}, set()
    for p in sorted(pages, key=lambda p: p["route"]):
        segs = [s for s in p["route"].split("?")[0].split("/") if s]
        for i in range(1, len(segs)):  # parent folders that have no page of their own
            parent = "/" + "/".join(segs[:i])
            if parent not in routes and parent not in shown:
                shown.add(parent)
                lines.append(f"{'  ' * i}- `{parent}/` (no page)")
        pad = "  " * len(segs)
        lines.append(f"{pad}- `{p['route']}` - {p['title'] or '(no title)'}")
        if p["sections"]:
            lines.append(f"{pad}  - anchors: " + ", ".join(f"`#{s}`" for s in p["sections"]))
        h1 = next((h["text"] for h in p["headings"] if h["level"] == 1), None)
        if h1:
            lines.append(f"{pad}  - h1: {h1}")
    external = sorted({l["url"] for p in pages for l in p["links"]["external"]})
    contact = sorted({l["url"] for p in pages for l in p["links"]["contact"]})
    for title, items in (("External links", external), ("Contact links", contact)):
        if items:
            lines += ["", f"## {title}", ""] + [f"- {i}" for i in items]
    write_text(out / "SITE_STRUCTURE.md", "\n".join(lines) + "\n")


# ----------------------------------------------------------------------------- crawler
def crawl(args):
    start = clean_url(args.url)
    parts = urlparse(start)
    host, origin = parts.netloc, f"{parts.scheme}://{parts.netloc}"
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    robots, hinted = load_robots(origin)
    queue = deque([start] + [clean_url(u) for u in sitemap_urls(origin, hinted) if urlparse(u).netloc == host])
    queued, done = set(queue), set()
    pages, skipped, errors = [], [], []
    started = datetime.now(timezone.utc).isoformat(timespec="seconds")

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=not args.headed, args=["--no-sandbox"] if args.no_sandbox else [])
        ctx = browser.new_context(user_agent=UA, viewport={"width": 1440, "height": 900})
        ctx.add_init_script("performance.setResourceTimingBufferSize(3000)")
        mirror = Mirror(ctx, out, host, args.third_party, int(args.max_mb * 1024 * 1024))
        page = ctx.new_page()

        while queue and len(pages) < args.max_pages:
            url = queue.popleft()
            if robots and not robots.can_fetch(UA, url):
                skipped.append({"url": url, "reason": "disallowed by robots.txt"})
                continue
            print(f"[{len(pages) + 1}] {url}")
            doc = None
            try:
                doc = page.goto(url, wait_until="networkidle", timeout=45_000)
            except PWTimeout:
                print("    network never went idle - using what has loaded")
            except PWError as e:
                errors.append({"url": url, "error": str(e).splitlines()[0]})
                continue
            page.wait_for_timeout(args.wait)

            final = clean_url(page.url)
            if urlparse(final).netloc != host:
                skipped.append({"url": url, "reason": f"redirected off-site to {final}"})
                continue
            if final in done:
                continue
            done.add(final)

            if doc is not None:  # the HTML exactly as the server sent it (the app shell for SPAs)
                try:
                    mirror.save(final, doc.body(), doc.headers.get("content-type", "text/html"))
                except PWError:
                    pass

            page.evaluate(SCROLL_JS)
            page.evaluate(OPEN_DETAILS_JS)
            revealed = reveal_toggles(page, args.click)
            html = page.content()

            info = analyse(html, final, host)
            md = to_markdown(html, final)
            if revealed:
                md += "\n\n---\n\n## Text revealed by clicking\n"
                for r in revealed:
                    md += f"\n### {r['toggle']}\n\n" + "\n\n".join(r["text"]) + "\n"
            stem = stem_of(final)
            header = f"---\nurl: {final}\ntitle: {json.dumps(info['title'], ensure_ascii=False)}\n---\n\n"
            write_text(out / "rendered" / f"{stem}.html", html)
            write_text(out / "content" / f"{stem}.md", header + md + "\n")

            # everything the browser loaded for this page, plus linked files (PDFs...) and head assets
            for res in page.evaluate("() => performance.getEntriesByType('resource').map(e => e.name)"):
                mirror.fetch(res)
            for url_ in [i["src"] for i in info["images"]] + info["head_assets"]:
                mirror.fetch(url_)
            for f in info["links"]["files"]:
                mirror.fetch(f["url"])
            for link in info["links"]["internal"]:
                if link["url"] not in queued:
                    queued.add(link["url"])
                    queue.append(link["url"])

            pages.append(
                {
                    "url": final,
                    "route": route_of(final),
                    **{k: v for k, v in info.items() if k != "head_assets"},
                    "rendered": f"rendered/{stem}.html",
                    "markdown": f"content/{stem}.md",
                    "revealed_on_click": revealed,
                }
            )
            time.sleep(args.delay)
        browser.close()

    manifest = {
        "start_url": start,
        "host": host,
        "crawled_at": started,
        "pages": pages,
        "files": [{"url": u, **v} for u, v in sorted(mirror.files.items())],
        "failed": [{"url": u, "reason": r} for u, r in mirror.failed.items()],
        "skipped": skipped,
        "errors": errors,
    }
    write_text(out / "site.json", json.dumps(manifest, indent=2, ensure_ascii=False))
    write_structure(out, host, pages, mirror, started)
    print(f"\nDone: {len(pages)} pages, {len(mirror.files)} files, {len(mirror.failed)} failed -> {out.resolve()}")
    if queue:
        print(f"Stopped at --max-pages; {len(queue)} URLs left in the queue.")


def main():
    ap = argparse.ArgumentParser(description="Crawl a JavaScript-rendered site and save a local copy.")
    ap.add_argument("url", help="start URL, e.g. https://genlab.cc/")
    ap.add_argument("--out", default="mirror", help="output folder (default: mirror)")
    ap.add_argument("--max-pages", type=int, default=100)
    ap.add_argument("--delay", type=float, default=1.0, help="seconds to pause between pages (default 1)")
    ap.add_argument("--wait", type=int, default=1500, help="extra milliseconds to wait after each page loads")
    ap.add_argument("--click", action="append", default=[], metavar="CSS",
                    help="extra selector to click before capturing (accordions, tabs, 'load more'); repeatable")
    ap.add_argument("--third-party", action="store_true", help="also save files served from other hosts (CDN fonts...)")
    ap.add_argument("--max-mb", type=float, default=50, help="skip files bigger than this many MB")
    ap.add_argument("--headed", action="store_true", help="show the browser window while crawling")
    ap.add_argument("--no-sandbox", action="store_true", help="pass --no-sandbox to Chromium (Docker / running as root)")
    crawl(ap.parse_args())


if __name__ == "__main__":
    main()
