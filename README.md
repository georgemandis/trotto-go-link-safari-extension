Trotto Go Link Redirector for Safari (Manifest V3 Compatible)
======================================================

A small browser extension that intercepts “go/keyword” links (and search queries) in Safari and redirects them to your internal link service at https://trot.to/<keyword>. Built with Manifest V3, a service worker background script, and a minimal declarative net‐request rule set.

I made this because Trotto doesn't seem to offer a Safari extension (boo).

Features
--------
- Automatic redirect of any “http://go/keyword” or “https://go/keyword” URL
- Intercepts Google or DuckDuckGo searches for “go/keyword” queries and redirects the tab
- Works in Safari (with Manifest V3 support), Chrome, Firefox (cross-browser API)
- Declarative net‐request rule for instant redirects on main‐frame loads
- Fallback to webNavigation listener for search‐engine intercepts

Quick Install in Safari (Add Temporary Extension)
------------------------------------------------
1. Clone or download this repo.
2. Make sure the Develop menu is visible:
   - Safari → Settings → Advanced → enable “Show Develop menu in menu bar” (or “Show features for web developers” on newer Safari versions).
3. In Safari, go to Develop → “Add Temporary Extension…”
4. Choose this project’s folder (the one containing `manifest.json`).
5. Approve the permission prompt, then open Safari → Settings → Extensions and enable “Go Link Redirector.”

**Note**: Temporary extensions are not persistent. After quitting Safari, repeat steps 3–5 to re‑add it. This is really annoying! But I don't want to make an Apple Developer account just to load this extension. I leave my browser open for many days at a time anyway.

Usage
-----
- Type or click any URL like `http://go/my-doc` → automatically redirected to
`https://trot.to/my-doc`.
- Perform a web search on Google or DuckDuckGo with query `go/my-doc` → page will push you to the same trot.to link.

How It Works
------------
1. Manifest V3 declares:
 - permissions: `webNavigation`, `tabs`, `declarativeNetRequest`
 - host_permissions for `go/*`, `go./*`, Google, DuckDuckGo, trot.to
 - background.service_worker: `background.js`
 - rule_resources pointing to `rules.json`
2. rules.json holds a single DNR rule:
 - regexFilter `^https?://go\.?/(.+)$`
 - redirects main_frame loads to `https://trot.to/$1`
3. background.js service worker listens on `webNavigation.onBeforeNavigate`
 - For non‐go host searches (Google/DuckDuckGo), inspects the `q` or `query` parameter
 - If it matches `go/<keyword>`, calls `tabs.update` to redirect

Cross-Browser Notes
-------------------
- Uses the `browser` namespace when available, otherwise falls back to `chrome`
- In Chrome/Edge: load as an unpacked extension (chrome://extensions → “Load unpacked”)
- In Firefox: `about:debugging` → “This Firefox” → “Load Temporary Add-on…”

File Overview
-------------
- manifest.json — MV3 config, permissions, host rules
- background.js — Service worker code (install, activate, webNavigation listener)
- rules.json— declarativeNetRequest redirect rule resource
- README.md — This file