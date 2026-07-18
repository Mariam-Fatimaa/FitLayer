# FitLayer Website

The original single-file website has been separated into individual HTML pages and organized assets.

## Start
Open `index.html` in a browser. For reliable local routing, use a simple local server such as VS Code Live Server.

## Structure
- Root HTML files: one file per page
- `assets/css`: CSS split into ordered modules; keep the existing link order
- `assets/js`: shared and page-specific behavior
- `assets/images`: reserved for future image assets
- `original/fitlayer-original.html`: untouched original source

No original visual sections were removed. Hash-based page routing was replaced with standard `.html` links.
