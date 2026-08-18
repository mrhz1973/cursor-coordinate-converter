#!/usr/bin/env python3
"""Fetch IIM shop category / product pages for field-level cross-check vs harvest."""
from __future__ import annotations

import json
import re
import ssl
import urllib.parse
import urllib.request
from pathlib import Path

OUT = Path("C:/tmp/goi-carto-discovery/iim")
CTX = ssl.create_default_context()
UA = "GOI-GIS-carto-discovery/1.0"

URLS = [
    "https://www.istitutoidrografico.it/it/catalogo/documentazione-nautica-ufficiale-carte-carte-nautiche-tradizionali/00601d-1/index.html",
    "https://www.istitutoidrografico.it/it/catalogo",
]


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60, context=CTX) as r:
        return r.read()


def main() -> None:
    cat = fetch(URLS[0])
    html = cat.decode("utf-8", "replace")
    (OUT / "shop_tradizionali.html").write_text(html, encoding="utf-8")
    # product-like anchors
    hrefs = re.findall(r'href="([^"]+)"', html)
    interesting = [h for h in hrefs if re.search(r"carta|nautic|spezia|00601", h, re.I)]
    titles = re.findall(r"<h[12][^>]*>([\s\S]*?)</h[12]>", html, re.I)
    titles_c = [re.sub(r"<[^>]+>", "", t).strip() for t in titles]
    # look for chart numbers near Spezia / INT
    hits = {}
    for needle in ("Spezia", "Portofino", "Mediterraneo", "INT 300", "Carta 59", "Carta 115", "Carta 3", "Carta 360"):
        hits[needle] = html.find(needle)
    print("bytes", len(cat), "interesting hrefs", len(interesting), "h1/h2", titles_c[:12])
    print("needles", hits)
    print("href sample", interesting[:20])
    (OUT / "shop_tradizionali_scan.json").write_text(json.dumps({
        "bytes": len(cat),
        "titles": titles_c[:30],
        "needles": hits,
        "href_sample": interesting[:40],
    }, indent=2), encoding="utf-8")

    # search form
    q = urllib.parse.urlencode({"q": "Porto della Spezia"}).encode()
    try:
        req = urllib.request.Request(
            "https://www.istitutoidrografico.it/it/catalogo",
            data=q,
            method="POST",
            headers={"User-Agent": UA, "Content-Type": "application/x-www-form-urlencoded"},
        )
        with urllib.request.urlopen(req, timeout=45, context=CTX) as r:
            raw = r.read()
        (OUT / "shop_search_spezia.html").write_bytes(raw)
        sh = raw.decode("utf-8", "replace")
        print("search bytes", len(raw), "spezia", sh.lower().find("spezia"), "59", "carta 59" in sh.lower())
    except Exception as e:
        print("search fail", e)


if __name__ == "__main__":
    main()
