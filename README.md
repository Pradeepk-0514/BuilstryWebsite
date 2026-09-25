# genlab.cc — project folder

Build an exact, working copy of the site with one command (Python 3.9+):

```bash
python build_mirror.py
```

It installs what is missing (Playwright + Chromium), crawls https://genlab.cc/ in a real browser, saves every file the site serves into `site/`, then previews it at http://localhost:8080. Re-run `python build_mirror.py --serve-only` to preview again without crawling.

**Why a script?** genlab.cc is a JavaScript app. The only way to get an *exact* copy is to save the files the site itself serves (HTML shell, JS, CSS, images, PDFs). My environment could read the site's text but not download those files, so this folder builds them on your machine.

| Path | What it is |
|---|---|
| `site/` | *(created by the script)* the exact copy. Deploy it to any static host that falls back to `index.html` |
| `mirror/` | *(created)* crawl extras: post-JavaScript HTML, Markdown per page, `site.json`, route tree |
| `serve.py` | preview server with client-side-route fallback (`python serve.py site 8080`) |
| `scraper/` | the crawler (`scrape_site.py --help` lists options) |
| `content/`, `SITE_STRUCTURE.md`, `site.json`, `assets.txt` | text and structure I captured beforehand |

## Notes

- The crawler was tested on a mock single-page app, not on genlab.cc itself. The 5 FAQ answers on the home page only appear on click; if they are missing from `mirror/content/index.md`, inspect a "+" icon in your browser and pass its selector: `python build_mirror.py --click "<css selector>"`.
- The contact form and certificate lookup need GenLab's servers, so they will not fully work from a local copy.
- Known quirk of the original, kept as-is: the footer `tel:` link is missing a digit (see `SITE_STRUCTURE.md`).
- The content and images belong to GenLab Pvt. Ltd. Use the copy for your project, not to republish as your own or as GenLab.
