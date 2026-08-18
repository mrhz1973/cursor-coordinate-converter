#!/usr/bin/env python3
"""Fetch IIM InteractiveSailingMap iframe HTML and linked assets."""
from __future__ import annotations

import json
import re
import ssl
import urllib.request
from pathlib import Path

OUT = Path("C:/tmp/goi-carto-discovery/iim")
OUT.mkdir(parents=True, exist_ok=True)
CTX = ssl.create_default_context()
UA = "GOI-GIS-carto-discovery/1.0"
BASE = "https://www.istitutoidrografico.it/InteractiveSailingMap/myPath.php"


def fetch(url: str) -> tuple[bytes, dict]:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Referer": "https://www.istitutoidrografico.it/it/pages-14/interactive-sailing-map"})
    with urllib.request.urlopen(req, timeout=45, context=CTX) as r:
        raw = r.read()
        meta = {
            "url": url,
            "final": r.geturl(),
            "status": getattr(r, "status", None),
            "content_type": r.headers.get("Content-Type"),
            "bytes": len(raw),
        }
        return raw, meta


def main() -> None:
    raw, meta = fetch(BASE)
    (OUT / "myPath.php.html").write_bytes(raw)
    html = raw.decode("utf-8", "replace")
    hrefs = re.findall(r"""(?:href|src|url)\s*[:=]\s*['\"]([^'\"]+)['\"]""", html, re.I)
    hrefs += re.findall(r"""(https?://[^'\"\s>]+)""", html)
    interesting = [
        h for h in hrefs
        if re.search(r"js|json|geo|kml|xml|php|map|leaflet|ol\.|arcgis|wms|wfs|tile|chart|catalog", h, re.I)
    ]
    meta["interesting"] = interesting[:80]
    meta["href_n"] = len(hrefs)
    print(json.dumps(meta, indent=2)[:8000])
    (OUT / "mypath_meta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
