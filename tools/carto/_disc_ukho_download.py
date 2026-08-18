#!/usr/bin/env python3
"""Download official UKHO CAL XLS + ADC Catalogs ZIP to C:/tmp (not the GIS repo)."""
from __future__ import annotations

import hashlib
import json
import ssl
import urllib.request
from pathlib import Path

OUT = Path("C:/tmp/goi-carto-discovery/ukho")
OUT.mkdir(parents=True, exist_ok=True)
CTX = ssl.create_default_context()
UA = "GOI-GIS-carto-discovery/1.0 (official catalog metadata only)"

FILES = [
    (
        "Chart_Availability_List_0.xls",
        "https://assets.admiralty.co.uk/public/2022-07/Chart_Availability_List_0.xls?VersionId=6F_JO0Z.m.FcevwL2nvkqfXHAJDPpvcp",
    ),
    (
        "ADC_Catalogs_WK33_26.zip",
        "https://assets.admiralty.co.uk/public/documents/2026-08/ADC_Catalogs_WK33_26.zip?VersionId=fb1ug2UeNsDRZC.4Q0ulp11wxc8vfYRf",
    ),
]


def main() -> None:
    report = []
    for name, url in FILES:
        dest = OUT / name
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        print("GET", url)
        with urllib.request.urlopen(req, timeout=180, context=CTX) as r:
            raw = r.read()
            meta = {
                "name": name,
                "url": url,
                "final": r.geturl(),
                "status": getattr(r, "status", None),
                "content_type": r.headers.get("Content-Type"),
                "bytes": len(raw),
                "sha256": hashlib.sha256(raw).hexdigest(),
                "magic": raw[:8].hex(),
            }
        dest.write_bytes(raw)
        meta["saved"] = str(dest)
        report.append(meta)
        print(json.dumps({k: v for k, v in meta.items() if k != "url"}, indent=2))
    (OUT / "download_meta.json").write_text(json.dumps(report, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
