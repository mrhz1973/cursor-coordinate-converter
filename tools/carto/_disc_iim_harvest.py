#!/usr/bin/env python3
"""Harvest IIM chart rectangles via the public Interactive Map POST (official page flow)."""
from __future__ import annotations

import json
import re
import ssl
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

OUT = Path("C:/tmp/goi-carto-discovery/iim")
OUT.mkdir(parents=True, exist_ok=True)
CTX = ssl.create_default_context()
URL = "https://www.istitutoidrografico.it/InteractiveSailingMap/myPathMaps.php"
UA = "GOI-GIS-carto-discovery/1.0"
REF = "https://www.istitutoidrografico.it/InteractiveSailingMap/myPath.php"


class TableParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.in_td = False
        self.in_tr = False
        self.cur: list[str] = []
        self.rows: list[dict] = []
        self.tr_id = None
        self.tr_name = None
        self.buf = ""

    def handle_starttag(self, tag, attrs):
        ad = dict(attrs)
        if tag == "tr" and ad.get("class") == "clickable-row":
            self.in_tr = True
            self.cur = []
            self.tr_id = ad.get("id")
            self.tr_name = ad.get("name")
        if tag == "td" and self.in_tr:
            self.in_td = True
            self.buf = ""
        if tag == "a" and self.in_tr and "href" in ad:
            self.cur.append("HREF:" + ad["href"])

    def handle_endtag(self, tag):
        if tag == "td" and self.in_td:
            self.cur.append(self.buf.strip())
            self.in_td = False
        if tag == "tr" and self.in_tr:
            self.rows.append({"mappa_id": self.tr_id, "kind": self.tr_name, "cells": self.cur})
            self.in_tr = False

    def handle_data(self, data):
        if self.in_td:
            self.buf += data


def post(payload: dict, name: str) -> dict:
    body = urllib.parse.urlencode(payload).encode("utf-8")
    req = urllib.request.Request(
        URL,
        data=body,
        method="POST",
        headers={"User-Agent": UA, "Referer": REF, "Content-Type": "application/x-www-form-urlencoded"},
    )
    with urllib.request.urlopen(req, timeout=90, context=CTX) as r:
        raw = r.read()
        html = raw.decode("utf-8", "replace")
    (OUT / f"{name}.html").write_text(html, encoding="utf-8")
    rect = re.search(r"var rectMaps\s*=\s*(\[[\s\S]*?\]);", html)
    pathm = re.search(r"var pathMaps\s*=\s*(\[[\s\S]*?\]);", html)
    p = TableParser()
    p.feed(html)
    found = re.search(r"Mappe trovate:\s*</h4></td>\s*<td[^>]*>\s*<h4>(\d+)</h4>", html)
    rec = {
        "name": name,
        "bytes": len(raw),
        "table_rows": len(p.rows),
        "found_footer": int(found.group(1)) if found else None,
        "rectMaps": json.loads(rect.group(1)) if rect else None,
        "pathMaps": json.loads(pathm.group(1).replace("south", '"south"')) if False else None,
        "rows": p.rows,
    }
    if rect:
        rec["rectMaps"] = json.loads(rect.group(1))
    if pathm:
        try:
            rec["pathMaps"] = json.loads(pathm.group(1))
        except json.JSONDecodeError:
            rec["pathMaps_raw"] = pathm.group(1)[:500]
    return rec


def main() -> None:
    # Mediterranean / Italian waters rectangle as LatLngBounds-like objects
    draw = json.dumps([{"south": 35.2, "west": 6.2, "north": 46.2, "east": 19.2}])
    med = post({
        "markers": "",
        "drawRecs": draw,
        "selScala": "tutte",
        "latIns": "",
        "longIns": "",
    }, "harvest_med_rect")
    print("MED rows", med["table_rows"], "footer", med["found_footer"], "rects", None if med.get("rectMaps") is None else len(med["rectMaps"]))
    (OUT / "harvest_med.json").write_text(json.dumps(med, indent=2), encoding="utf-8")

    # also a second point in Sicily / Ionian to see uniqueness
    sic = post({
        "markers": json.dumps([{"mrkLat": 37.5, "mrkLng": 15.1}]),
        "drawRecs": "",
        "selScala": "tutte",
        "latIns": "37.5",
        "longIns": "15.1",
    }, "harvest_catania")
    print("CT rows", sic["table_rows"], "footer", sic["found_footer"])
    (OUT / "harvest_catania.json").write_text(json.dumps(sic, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
