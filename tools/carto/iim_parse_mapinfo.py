#!/usr/bin/env python3
"""Parse IIM Interactive Map HTML (myPathMaps.php) into provider-neutral records.

Source contract (PROVATO, 2026-08-18):
  POST https://www.istitutoidrografico.it/InteractiveSailingMap/myPathMaps.php
  form: markers | drawRecs | selScala=tutte
  response text/html with:
    var rectMaps = [[south,north,west,east], ...]
    var mapInfoWin = [[chart_id, int_id, title, edition, pub_date, scale, datum,
                       date2, reprint, nm, extra, price, paper, proj, panel, mappa_id, subtitle], ...]
  Pairing is by array index (NOT HTML table order).
"""
from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path
from typing import Any

MAPINFO_RE = re.compile(r"var mapInfoWin\s*=\s*(\[[\s\S]*?\]);")
RECTMAPS_RE = re.compile(r"var rectMaps\s*=\s*(\[[\s\S]*?\]);")


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def parse_js_array_literal(src: str) -> Any:
    """mapInfoWin / rectMaps are JSON-compatible array literals."""
    return json.loads(src)


def extract_arrays(html: str) -> tuple[list, list]:
    m = MAPINFO_RE.search(html)
    r = RECTMAPS_RE.search(html)
    if not m:
        raise ValueError("mapInfoWin_missing")
    if not r:
        raise ValueError("rectMaps_missing")
    info = parse_js_array_literal(m.group(1))
    rects = parse_js_array_literal(r.group(1))
    if not isinstance(info, list) or not isinstance(rects, list):
        raise ValueError("arrays_not_lists")
    return info, rects


def normalize_chart_id(raw: Any) -> str:
    s = "" if raw is None else str(raw).strip()
    s = re.sub(r"\s+", " ", s)
    return s.upper()


def normalize_int_id(raw: Any) -> str | None:
    if raw is None:
        return None
    s = str(raw).strip()
    if not s:
        return None
    s = re.sub(r"^(INT|I\.?N\.?T\.?)\s*", "", s, flags=re.I).strip()
    if not s or s.upper() in ("NULL", "NONE", "N/A", "-", "—"):
        return None
    return s


def parse_scale(raw: Any) -> int | None:
    if raw is None:
        return None
    s = str(raw).strip().replace(" ", "").replace(".", "")
    s = re.sub(r"^1:", "", s)
    if not s:
        return None
    try:
        n = int(float(s))
    except ValueError:
        return None
    return n if n > 0 else None


def closed_ring(south: float, west: float, north: float, east: float) -> list[list[float]]:
    # GeoJSON lon/lat, closed
    return [
        [west, south],
        [east, south],
        [east, north],
        [west, north],
        [west, south],
    ]


def bbox_ok(south: float, west: float, north: float, east: float) -> str | None:
    for v in (south, west, north, east):
        if v != v:  # NaN
            return "nan"
    if not (-90 <= south <= 90 and -90 <= north <= 90):
        return "lat_range"
    if not (-180 <= west <= 180 and -180 <= east <= 180):
        return "lon_range"
    if south >= north:
        return "south_ge_north"
    if west == east:
        return "zero_width"
    # IIM rectangles observed do not wrap antimeridian (west < east).
    if west > east:
        return "antimeridian_or_inverted"
    return None


def panel_role(panel_raw: Any) -> str:
    p = "" if panel_raw is None else str(panel_raw).strip().lower()
    if p in ("sngpnl", "sng", "single"):
        return "primary"
    if p in ("mltpnl", "multi", "multipnl"):
        return "panel"
    if p in ("inset", "ins"):
        return "inset"
    return "unknown" if p else "primary"


def chart_type_from_scale(scale: int | None) -> str:
    if scale is None:
        return "nautical"
    if scale <= 25000:
        return "harbour"
    if scale <= 150000:
        return "coastal"
    if scale <= 1500000:
        return "general"
    return "overview"


def record_from_pair(info: list, rect: list, idx: int, source_file: str, source_checksum: str) -> dict:
    if not isinstance(info, list) or len(info) < 6:
        return {"catalog_status": "quarantine", "quarantine_reason": "short_mapinfo", "source_index": idx}
    if not isinstance(rect, list) or len(rect) < 4:
        return {"catalog_status": "quarantine", "quarantine_reason": "short_rect", "source_index": idx}

    chart_id = normalize_chart_id(info[0])
    if not chart_id:
        return {"catalog_status": "quarantine", "quarantine_reason": "missing_chart_id", "source_index": idx}

    try:
        south, north, west, east = (float(rect[0]), float(rect[1]), float(rect[2]), float(rect[3]))
    except (TypeError, ValueError):
        return {
            "catalog_status": "metadata_only",
            "quarantine_reason": "rect_non_numeric",
            "chart_id": chart_id,
            "source_index": idx,
        }

    geom_err = bbox_ok(south, west, north, east)
    scale = parse_scale(info[5] if len(info) > 5 else None)
    intl = normalize_int_id(info[1] if len(info) > 1 else None)
    title = str(info[2]).strip() if len(info) > 2 and info[2] is not None else None
    edition = str(info[3]).strip() if len(info) > 3 and info[3] not in (None, "") else None
    pub = str(info[4]).strip() if len(info) > 4 and info[4] not in (None, "") else None
    datum = str(info[6]).strip() if len(info) > 6 and info[6] else None
    panel_raw = info[14] if len(info) > 14 else None
    mappa_id = str(info[15]).strip() if len(info) > 15 and info[15] not in (None, "") else None
    subtitle = str(info[16]).strip() if len(info) > 16 and info[16] not in (None, "") else None

    logical_key = "iim|paper|" + chart_id
    rec: dict[str, Any] = {
        "schema_version": "1.0.0-draft",
        "provider_id": "iim",
        "provider_name": "Istituto Idrografico della Marina",
        "series_id": "paper",
        "series_name": "Carte nautiche IIM",
        "chart_id": chart_id,
        "international_id": intl,
        "title": title,
        "subtitle": subtitle or None,
        "chart_type": "nautical",
        "chart_class": chart_type_from_scale(scale),
        "scale_denominator": scale,
        "edition": edition,
        "revision": None,
        "publication_date": pub,
        "availability_status": "unknown",
        "source_updated_at": None,
        "source_url": "https://www.istitutoidrografico.it/InteractiveSailingMap/myPath.php",
        "source_file": source_file,
        "source_checksum": source_checksum,
        "original_crs": "WGS84" if (datum or "").upper().replace(" ", "") in ("WGS84", "WGS1984") else (datum or "unknown"),
        "mappa_id": mappa_id,
        "panel_raw": panel_raw,
        "logical_key": logical_key,
        "archive_match_keys": [logical_key, "iim|" + chart_id],
        "source_index": idx,
        "raw_mapinfo": info,
    }
    if geom_err:
        rec["catalog_status"] = "metadata_only"
        rec["geometry_error"] = geom_err
        rec["footprints"] = []
        rec["bbox"] = None
        return rec

    ring = closed_ring(south, west, north, east)
    area = abs((east - west) * (north - south))
    if area <= 0:
        rec["catalog_status"] = "metadata_only"
        rec["geometry_error"] = "area_zero"
        rec["footprints"] = []
        rec["bbox"] = None
        return rec

    fid = "iim|paper|" + chart_id + "|f0"
    rec["catalog_status"] = "in_imported_catalog"
    rec["footprints"] = [{
        "footprint_id": fid,
        "role": panel_role(panel_raw),
        "geometry_type": "Polygon",
        "geometry": {"type": "Polygon", "coordinates": [ring]},
        "scale": scale,
        "crs_original": rec["original_crs"],
        "notes": "axis-aligned rectangle from IIM Interactive Sailing Map rectMaps [S,N,W,E]",
    }]
    rec["bbox"] = [west, south, east, north]
    rec["record_id"] = "iim:paper:" + chart_id
    return rec


def merge_by_logical_key(records: list[dict]) -> tuple[list[dict], list[dict]]:
    """Merge multi-row same chart_id (multi-panel). Quarantine contradictory metadata."""
    buckets: dict[str, list[dict]] = {}
    other = []
    for rec in records:
        key = rec.get("logical_key")
        if not key:
            other.append(rec)
            continue
        buckets.setdefault(key, []).append(rec)

    out = []
    quarantined = []
    for key, group in buckets.items():
        if len(group) == 1:
            out.append(group[0])
            continue
        base = dict(group[0])
        fps = []
        titles = set()
        scales = set()
        ints = set()
        for i, g in enumerate(group):
            titles.add(g.get("title"))
            scales.add(g.get("scale_denominator"))
            ints.add(g.get("international_id"))
            for fp in (g.get("footprints") or []):
                fp2 = dict(fp)
                fp2["footprint_id"] = "iim|paper|" + str(g.get("chart_id")) + "|f" + str(len(fps))
                if i > 0 and fp2.get("role") == "primary":
                    fp2["role"] = "panel"
                fps.append(fp2)
        conflict = []
        if len(titles) > 1:
            conflict.append("title")
        if len(scales) > 1:
            conflict.append("scale")
        if len({x for x in ints if x}) > 1:
            conflict.append("international_id")
        if conflict:
            for g in group:
                q = dict(g)
                q["catalog_status"] = "quarantine"
                q["quarantine_reason"] = "duplicate_key_conflict:" + ",".join(conflict)
                quarantined.append(q)
            continue
        if not fps:
            base["catalog_status"] = "metadata_only"
            base["footprints"] = []
            out.append(base)
            continue
        west = min(fp["geometry"]["coordinates"][0][0][0] for fp in fps)
        south = min(fp["geometry"]["coordinates"][0][0][1] for fp in fps)
        east = max(fp["geometry"]["coordinates"][0][2][0] for fp in fps)
        north = max(fp["geometry"]["coordinates"][0][2][1] for fp in fps)
        base["footprints"] = fps
        base["bbox"] = [west, south, east, north]
        base["catalog_status"] = "in_imported_catalog"
        base["multi_panel"] = True
        out.append(base)
    return out, quarantined + other


def parse_html(html: str, source_file: str, source_checksum: str) -> dict:
    info, rects = extract_arrays(html)
    n = min(len(info), len(rects))
    length_mismatch = len(info) != len(rects)
    raw_recs = [record_from_pair(info[i], rects[i], i, source_file, source_checksum) for i in range(n)]
    merged, extra_q = merge_by_logical_key(raw_recs)
    quarantined = [r for r in merged if r.get("catalog_status") == "quarantine"] + extra_q
    kept = [r for r in merged if r.get("catalog_status") != "quarantine"]
    meta_only = sum(1 for r in kept if r.get("catalog_status") == "metadata_only")
    with_fp = sum(1 for r in kept if r.get("footprints"))
    fp_count = sum(len(r.get("footprints") or []) for r in kept)
    return {
        "source_file": source_file,
        "source_checksum": source_checksum,
        "mapinfo_count": len(info),
        "rectmaps_count": len(rects),
        "length_mismatch": length_mismatch,
        "raw_row_count": n,
        "record_count": len(kept),
        "footprint_count": fp_count,
        "with_geometry": with_fp,
        "metadata_only_count": meta_only,
        "quarantine_count": len(quarantined),
        "panel_raw_values": sorted({
            str(r.get("panel_raw")) for r in (kept + quarantined) if r.get("panel_raw") is not None
        }),
        "records": kept,
        "quarantine": quarantined,
    }


def compact_record(rec: dict) -> dict | None:
    fps = rec.get("footprints") or []
    if not fps or rec.get("catalog_status") != "in_imported_catalog":
        return None
    if len(fps) == 1:
        g = fps[0]["geometry"]
        gtype = "P"
        coords = g["coordinates"]
    else:
        gtype = "M"
        coords = [fp["geometry"]["coordinates"] for fp in fps]
    b = rec["bbox"]
    out = {
        "id": rec.get("record_id") or ("iim:paper:" + rec["chart_id"]),
        "pid": "iim",
        "sid": "paper",
        "sn": rec.get("series_name") or "Carte nautiche IIM",
        "cid": rec["chart_id"],
        "t": rec.get("title"),
        "sc": rec.get("scale_denominator"),
        "ed": rec.get("edition"),
        "edt": rec.get("publication_date"),
        "iid": rec.get("international_id"),
        "cs": "in_imported_catalog",
        "ct": "nautical",
        "b": [round(b[0], 7), round(b[1], 7), round(b[2], 7), round(b[3], 7)],
        "g": {"t": gtype, "c": coords},
        "rs": "derived-public-interactive-map-index",
        "src": rec.get("source_file"),
    }
    if rec.get("mappa_id"):
        out["mid"] = rec["mappa_id"]
    return out


if __name__ == "__main__":
    import sys
    p = Path(sys.argv[1] if len(sys.argv) > 1 else "C:/tmp/goi-carto-discovery/iim/harvest_med_rect.html")
    raw = p.read_bytes()
    html = raw.decode("utf-8", "replace")
    # Strip any Google Maps API key from diagnostics we print (never copy keys).
    html_safe = re.sub(r"key=[A-Za-z0-9_-]+", "key=REDACTED", html)
    result = parse_html(html_safe, p.name, sha256_bytes(raw))
    summary = {k: v for k, v in result.items() if k not in ("records", "quarantine")}
    print(json.dumps(summary, indent=2))
    print("sample", json.dumps(result["records"][:2], indent=2)[:1500])
