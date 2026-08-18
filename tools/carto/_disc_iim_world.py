#!/usr/bin/env python3
"""Second IIM harvest: world bbox completeness vs Mediterranean 172."""
from __future__ import annotations

import json
import ssl
import sys
import urllib.parse
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from iim_parse_mapinfo import parse_html, sha256_bytes  # noqa: E402

OUT = Path("C:/tmp/goi-carto-discovery/iim")
CTX = ssl.create_default_context()
URL = "https://www.istitutoidrografico.it/InteractiveSailingMap/myPathMaps.php"
UA = "GOI-GIS-carto-discovery/1.0"
REF = "https://www.istitutoidrografico.it/InteractiveSailingMap/myPath.php"


def post_draw(south, west, north, east, name: str) -> dict:
    draw = json.dumps([{"south": south, "west": west, "north": north, "east": east}])
    body = urllib.parse.urlencode({
        "markers": "",
        "drawRecs": draw,
        "selScala": "tutte",
        "latIns": "",
        "longIns": "",
    }).encode("utf-8")
    req = urllib.request.Request(
        URL, data=body, method="POST",
        headers={"User-Agent": UA, "Referer": REF, "Content-Type": "application/x-www-form-urlencoded"},
    )
    with urllib.request.urlopen(req, timeout=120, context=CTX) as r:
        raw = r.read()
    path = OUT / f"{name}.html"
    path.write_bytes(raw)
    parsed = parse_html(raw.decode("utf-8", "replace"), path.name, sha256_bytes(raw))
    ids = sorted(x["chart_id"] for x in parsed["records"] if x.get("chart_id"))
    print(name, "records", parsed["record_count"], "fp", parsed["footprint_count"], "q", parsed["quarantine_count"])
    return {"name": name, "ids": ids, "summary": {k: v for k, v in parsed.items() if k not in ("records", "quarantine")}}


def main() -> None:
    world = post_draw(-80, -180, 80, 180, "harvest_world")
    med_html = (OUT / "harvest_med_rect.html").read_text(encoding="utf-8")
    med_raw = (OUT / "harvest_med_rect.html").read_bytes()
    med = parse_html(med_html, "harvest_med_rect.html", sha256_bytes(med_raw))
    med_ids = {x["chart_id"] for x in med["records"] if x.get("chart_id")}
    world_ids = set(world["ids"])
    extra = sorted(world_ids - med_ids)
    missing = sorted(med_ids - world_ids)
    report = {
        "med_count": len(med_ids),
        "world_count": len(world_ids),
        "world_only": extra,
        "med_only": missing,
    }
    print(json.dumps(report, indent=2))
    (OUT / "harvest_completeness.json").write_text(json.dumps(report, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
