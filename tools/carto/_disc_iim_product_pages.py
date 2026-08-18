#!/usr/bin/env python3
"""Cross-check IIM shop product pages vs Interactive Map harvest (sample)."""
from __future__ import annotations

import json
import re
import ssl
import urllib.request
from pathlib import Path

OUT = Path("C:/tmp/goi-carto-discovery/iim")
CTX = ssl.create_default_context()
UA = "GOI-GIS-carto-discovery/1.0"

# Samples required by TASK: harbour, coastal, general, INT, multi-panel-if-any
# mappaID from La Spezia harvest + a few more after parse.
SAMPLES = [
    {"mappa_id": "94", "expect_chart": "59", "kind": "harbour"},       # Porto della Spezia 1:5000
    {"mappa_id": "114", "expect_chart": "115", "kind": "coastal"},     # Litorale della Spezia 1:30000
    {"mappa_id": "55", "expect_chart": "3", "kind": "coastal_100k"},   # Portofino–San Rossore
    {"mappa_id": "199", "expect_chart": "360", "kind": "general_int"}, # Med + Black Sea INT 300
    {"mappa_id": "197", "expect_chart": "340", "kind": "general"},     # Mar Mediterraneo
]


def fetch(url: str) -> tuple[int, str, bytes]:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=45, context=CTX) as r:
        raw = r.read()
        return getattr(r, "status", 200), r.headers.get("Content-Type") or "", raw


def extract_fields(html: str) -> dict:
    text = re.sub(r"<script[\s\S]*?</script>", " ", html, flags=re.I)
    text = re.sub(r"<style[\s\S]*?</style>", " ", text, flags=re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"&nbsp;", " ", text)
    text = re.sub(r"\s+", " ", text)
    out = {"text_head": text[:2500]}
    m_num = re.search(r"(?:N[°o]|Numero|Carta)\s*[:\.]?\s*(\d+[A-Z]?)", text, re.I)
    m_int = re.search(r"\bINT\s*[:\.]?\s*(\d+)", text, re.I)
    m_sc = re.search(r"1\s*:\s*([0-9.]+)", text)
    m_ed = re.search(r"Edizione\s*[:\.]?\s*([0-9]+|[0-9]{4})", text, re.I)
    if m_num:
        out["chart_guess"] = m_num.group(1)
    if m_int:
        out["int_guess"] = m_int.group(1)
    if m_sc:
        out["scale_guess"] = m_sc.group(1).replace(".", "")
    if m_ed:
        out["edition_guess"] = m_ed.group(1)
    title = re.search(r"<title>([^<]+)</title>", html, re.I)
    if title:
        out["html_title"] = title.group(1).strip()
    h1 = re.search(r"<h1[^>]*>([\s\S]*?)</h1>", html, re.I)
    if h1:
        out["h1"] = re.sub(r"<[^>]+>", "", h1.group(1)).strip()
    return out


def main() -> None:
    rows = []
    for s in SAMPLES:
        url = f"https://www.istitutoidrografico.it/easyStore/SchedeVedi.asp?mappaID={s['mappa_id']}"
        try:
            status, ctype, raw = fetch(url)
            html = raw.decode("latin-1", "replace")
            (OUT / f"scheda_{s['mappa_id']}.html").write_text(html, encoding="utf-8")
            fields = extract_fields(html)
            rows.append({
                "ok": True,
                "sample": s,
                "status": status,
                "content_type": ctype,
                "bytes": len(raw),
                "url": url,
                "fields": fields,
            })
        except Exception as e:
            rows.append({"ok": False, "sample": s, "url": url, "error": str(e)})
        print(s["mappa_id"], rows[-1].get("status") or rows[-1].get("error"),
              (rows[-1].get("fields") or {}).get("html_title"),
              (rows[-1].get("fields") or {}).get("h1"))
    (OUT / "product_crosscheck.json").write_text(json.dumps(rows, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
