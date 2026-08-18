#!/usr/bin/env python3
"""Fetch IIM Liguria shop folder and scan for chart numbers vs harvest."""
from __future__ import annotations

import json
import re
import ssl
import urllib.request
from pathlib import Path

OUT = Path("C:/tmp/goi-carto-discovery/iim")
CTX = ssl.create_default_context()
URL = "https://www.istitutoidrografico.it/it/catalogo/documentazione-nautica-ufficiale-carte-carte-nautiche-tradizionali/00601d018-1/index.html"
URL_GEN = "https://www.istitutoidrografico.it/it/catalogo/documentazione-nautica-ufficiale-carte-carte-nautiche-tradizionali/00601d002-1/index.html"


def grab(url: str, name: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "GOI-GIS-carto-discovery/1.0"})
    with urllib.request.urlopen(req, timeout=60, context=CTX) as r:
        raw = r.read()
    html = raw.decode("utf-8", "replace")
    (OUT / name).write_text(html, encoding="utf-8")
    titles = re.findall(r'class="boxtitolo"[^>]*>\s*([^<]+)', html)
    alts = re.findall(r'title="([^"]+)"', html)
    nums = re.findall(r"\b(?:Carta|INT)\s*[:\.]?\s*(\d+)\b", html, re.I)
    print(name, "bytes", len(raw), "boxtitolo", titles[:15], "int/carta", nums[:20])
    return html


def main() -> None:
    a = grab(URL, "shop_ligure.html")
    b = grab(URL_GEN, "shop_generali_med.html")
    # product links
    hrefs = re.findall(r'href="(/it/catalogo/[^"]+)"', a)
    print("ligure unique catalog hrefs", len(set(hrefs)))
    for h in sorted(set(hrefs))[:25]:
        print(" ", h)
    (OUT / "shop_ligure_scan.json").write_text(json.dumps({
        "ligure_titles": re.findall(r'class="boxtitolo"[^>]*>\s*([^<]+)', a),
        "gen_titles": re.findall(r'class="boxtitolo"[^>]*>\s*([^<]+)', b),
        "ligure_hrefs": sorted(set(hrefs))[:40],
    }, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
