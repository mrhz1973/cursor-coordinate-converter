#!/usr/bin/env python3
"""POST a public IIM Interactive Map query (La Spezia point) to myPathMaps.php."""
from __future__ import annotations

import json
import ssl
import urllib.parse
import urllib.request
from pathlib import Path

OUT = Path("C:/tmp/goi-carto-discovery/iim")
OUT.mkdir(parents=True, exist_ok=True)
CTX = ssl.create_default_context()
URL = "https://www.istitutoidrografico.it/InteractiveSailingMap/myPathMaps.php"
UA = "GOI-GIS-carto-discovery/1.0"
REF = "https://www.istitutoidrografico.it/InteractiveSailingMap/myPath.php"

markers = json.dumps([{"mrkLat": 44.107, "mrkLng": 9.828}])
body = urllib.parse.urlencode({
    "markers": markers,
    "drawRecs": "",
    "selScala": "tutte",
    "latIns": "44.107",
    "longIns": "9.828",
}).encode("utf-8")

req = urllib.request.Request(
    URL,
    data=body,
    method="POST",
    headers={
        "User-Agent": UA,
        "Referer": REF,
        "Content-Type": "application/x-www-form-urlencoded",
    },
)
with urllib.request.urlopen(req, timeout=60, context=CTX) as r:
    raw = r.read()
    meta = {
        "status": getattr(r, "status", None),
        "final": r.geturl(),
        "content_type": r.headers.get("Content-Type"),
        "bytes": len(raw),
    }
(OUT / "myPathMaps_laspezia.html").write_bytes(raw)
(OUT / "myPathMaps_meta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
print(json.dumps(meta, indent=2))
text = raw.decode("utf-8", "replace")
print("title-ish", text[text.find("<title>"):text.find("</title>")+8] if "<title>" in text else "")
print("head", text[:1500])
