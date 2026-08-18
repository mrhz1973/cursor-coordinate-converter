#!/usr/bin/env python3
"""UKHO CAL/ADC page discovery — stdlib only."""
from __future__ import annotations

import json
import re
import ssl
import urllib.request
from pathlib import Path

OUT = Path("C:/tmp/goi-carto-discovery/ukho")
OUT.mkdir(parents=True, exist_ok=True)
CTX = ssl.create_default_context()
UA = "GOI-GIS-carto-discovery/1.0 (official catalog metadata only)"


def fetch(url: str, dest: Path | None = None, limit: int | None = None) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60, context=CTX) as r:
        raw = r.read() if limit is None else r.read(limit)
        info = {
            "url": url,
            "final": r.geturl(),
            "status": getattr(r, "status", None),
            "content_type": r.headers.get("Content-Type"),
            "content_length": r.headers.get("Content-Length"),
            "etag": r.headers.get("ETag"),
            "last_modified": r.headers.get("Last-Modified"),
            "bytes": len(raw),
            "magic": raw[:8].hex() if raw else "",
        }
        if dest is not None:
            dest.write_bytes(raw)
            info["saved"] = str(dest)
        info["_text"] = raw.decode("utf-8", "replace") if dest is None else ""
        info["_raw_head"] = raw[:200]
        return info


def hrefs(html: str) -> list[str]:
    found = re.findall(r"""href\s*=\s*['\"]([^'\"]+)['\"]""", html, re.I)
    found += re.findall(r"""src\s*=\s*['\"]([^'\"]+)['\"]""", html, re.I)
    found += re.findall(r"""(https?://[^'\"\s>]+\.(?:xls|xlsx|zip|csv|xml|json))""", html, re.I)
    return found


def main() -> None:
    report = {"pages": []}
    for name, url in [
        ("cal_page", "https://www.admiralty.co.uk/charts/chart-availability-list"),
        ("adc_page", "https://www.admiralty.co.uk/publications/admiralty-digital-catalogue"),
    ]:
        rec = fetch(url)
        html = rec.pop("_text", "")
        rec.pop("_raw_head", None)
        links = hrefs(html)
        rec["interesting"] = [
            h for h in links
            if re.search(r"xls|xlsx|zip|cal|adc|catalog|download|assets\.admiralty|VersionId", h, re.I)
        ]
        rec["all_href_count"] = len(links)
        (OUT / f"{name}.html").write_text(html, encoding="utf-8")
        rec["html_saved"] = str(OUT / f"{name}.html")
        report["pages"].append({"name": name, **rec})
        print(name, rec["status"], rec["content_type"], rec["bytes"])
        for h in rec["interesting"][:50]:
            print(" ", h)

    (OUT / "page_discovery.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    print("WROTE", OUT / "page_discovery.json")


if __name__ == "__main__":
    main()
