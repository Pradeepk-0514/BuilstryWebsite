#!/usr/bin/env python3
"""One command: builds an exact, working copy of the site in ./site and previews it.
    python build_mirror.py                      # crawl https://genlab.cc/ and serve on :8080
    python build_mirror.py https://genlab.cc/ --delay 2 --click "<css>"   # extra flags go to the crawler
    python build_mirror.py --serve-only         # skip the crawl, just serve ./site"""
import shutil, subprocess, sys
from pathlib import Path
from urllib.parse import urlparse

HERE = Path(__file__).resolve().parent
args = sys.argv[1:]
serve_only = "--serve-only" in args
args = [a for a in args if a != "--serve-only"]
url = args.pop(0) if args and not args[0].startswith("--") else "https://genlab.cc/"
host = urlparse(url).netloc.replace(":", "_")


def run(*cmd):
    subprocess.run([str(c) for c in cmd], check=True)


if not serve_only:
    try:
        import bs4, lxml, markdownify, playwright  # noqa: F401
    except ImportError:
        run(sys.executable, "-m", "pip", "install", "-r", HERE / "scraper" / "requirements.txt")
    run(sys.executable, "-m", "playwright", "install", "chromium")
    run(sys.executable, HERE / "scraper" / "scrape_site.py", url, "--out", HERE / "mirror", *args)
    src = HERE / "mirror" / "raw" / host
    if not (src / "index.html").exists():
        sys.exit("The crawl saved no index.html - check the messages above.")
    shutil.copytree(src, HERE / "site", dirs_exist_ok=True)
    print(f"\nExact copy saved to {HERE / 'site'}")

run(sys.executable, HERE / "serve.py", HERE / "site", "8080")
