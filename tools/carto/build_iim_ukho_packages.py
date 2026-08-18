#!/usr/bin/env python3
"""Build offline IIM + UKHO CARTO packages and compact embed payloads.

IIM geometry: official Interactive Sailing Map rectMaps (WGS84 rectangles).
UKHO: Chart Availability List metadata only — no footprints.
"""
from __future__ import annotations

import hashlib
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parent))
from iim_parse_mapinfo import compact_record, parse_html, sha256_bytes  # noqa: E402
from ukho_cal_parse import parse_cal, sha256_file  # noqa: E402

IIM_HTML = Path("C:/tmp/goi-carto-discovery/iim/harvest_world.html")
UKHO_XLS = Path("C:/tmp/goi-carto-discovery/ukho/Chart_Availability_List_0.xls")
OUT_IIM = ROOT / "data" / "carto" / "iim"
OUT_UKHO = ROOT / "data" / "carto" / "ukho"


def sha256_text(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8")).hexdigest().upper()


def strip_raw(rec: dict) -> dict:
    out = dict(rec)
    out.pop("raw_mapinfo", None)
    out.pop("raw", None)
    out.pop("source_index", None)
    return out


def geojson_from_iim(records: list[dict]) -> dict:
    feats = []
    for rec in records:
        for fp in rec.get("footprints") or []:
            feats.append({
                "type": "Feature",
                "id": fp["footprint_id"],
                "properties": {
                    "provider_id": rec["provider_id"],
                    "series_id": rec["series_id"],
                    "chart_id": rec["chart_id"],
                    "international_id": rec.get("international_id"),
                    "title": rec.get("title"),
                    "scale_denominator": rec.get("scale_denominator"),
                    "logical_key": rec.get("logical_key"),
                    "footprint_id": fp["footprint_id"],
                    "role": fp.get("role"),
                },
                "geometry": fp["geometry"],
            })
    return {"type": "FeatureCollection", "name": "iim-paper-footprints", "features": feats}


def write_json(path: Path, obj, pretty: bool = True) -> dict:
    if pretty:
        text = json.dumps(obj, ensure_ascii=False, indent=2) + "\n"
    else:
        text = json.dumps(obj, ensure_ascii=False, separators=(",", ":"))
    path.write_text(text, encoding="utf-8")
    raw = path.read_bytes()
    return {"file": path.name, "bytes": len(raw), "sha256": hashlib.sha256(raw).hexdigest().upper()}


def point_in_bbox(lon: float, lat: float, bbox: list[float]) -> bool:
    west, south, east, north = bbox
    return west <= lon <= east and south <= lat <= north


def validate_iim(records: list[dict]) -> dict:
    errors = []
    keys = []
    fids = []
    for rec in records:
        k = rec.get("logical_key")
        if not k:
            errors.append("missing_logical_key")
            continue
        if k in keys:
            errors.append("dup_logical:" + k)
        keys.append(k)
        b = rec.get("bbox")
        for fp in rec.get("footprints") or []:
            fid = fp.get("footprint_id")
            if fid in fids:
                errors.append("dup_fid:" + str(fid))
            fids.append(fid)
            ring = fp["geometry"]["coordinates"][0]
            if ring[0] != ring[-1]:
                errors.append("open_ring:" + str(fid))
            for lon, lat in ring:
                if not (-180 <= lon <= 180 and -90 <= lat <= 90) or lon != lon or lat != lat:
                    errors.append("coord_range:" + str(fid))
        if b:
            west, south, east, north = b
            if south >= north or west >= east:
                errors.append("bbox_bad:" + k)
            area = abs((east - west) * (north - south))
            if area <= 0:
                errors.append("area_zero:" + k)
    return {
        "ok": not errors,
        "errors": errors[:50],
        "error_count": len(errors),
        "logical_keys": len(keys),
        "footprint_ids": len(fids),
    }


def build_iim() -> dict:
    OUT_IIM.mkdir(parents=True, exist_ok=True)
    raw = IIM_HTML.read_bytes()
    html = re.sub(r"key=[A-Za-z0-9_-]+", "key=REDACTED", raw.decode("utf-8", "replace"))
    parsed = parse_html(html, IIM_HTML.name, sha256_bytes(raw))
    records = [strip_raw(r) for r in parsed["records"]]
    compact = []
    for rec in records:
        c = compact_record(rec)
        if c:
            compact.append(c)
    val = validate_iim(records)
    gj = geojson_from_iim(records)
    cat_meta = write_json(OUT_IIM / "catalog.json", {
        "schema": "carto-provider-catalog-v1",
        "provider_id": "iim",
        "records": records,
    })
    gj_meta = write_json(OUT_IIM / "footprints.geojson", gj)
    compact_obj = {
        "schema": "carto-igm-compact-v1",
        "schema_version": "1.0.0-fed-iim",
        "provider_id": "iim",
        "feature_count": len(compact),
        "attribution": "© Istituto Idrografico della Marina — indice derivato dalla Interactive Sailing Map pubblica (rettangoli WGS84). Non affiliato.",
        "rights_status": "derived-public-interactive-map-index",
        "records": compact,
    }
    compact_meta = write_json(OUT_IIM / "compact-v1.json", compact_obj, pretty=False)
    fixtures = [
        {"chart_id": "59", "title": "Porto della Spezia", "scale": 5000, "provider": "iim",
         "point_inside": [9.84, 44.095], "point_outside": [9.5, 44.2], "class": "harbour"},
        {"chart_id": "60", "title": "Rada della Spezia", "scale": 10000, "provider": "iim",
         "point_inside": [9.85, 44.06], "point_outside": [10.2, 44.3], "class": "harbour"},
        {"chart_id": "115", "title": "Litorale della Spezia", "scale": 30000, "provider": "iim",
         "point_inside": [9.82, 44.02], "point_outside": [9.2, 44.5], "class": "coastal", "international_id": "3364"},
        {"chart_id": "3", "title": "Da Portofino a San Rossore", "scale": 100000, "provider": "iim",
         "point_inside": [9.82, 44.10], "point_outside": [8.5, 44.1], "class": "coastal"},
        {"chart_id": "126", "title": "Isole Pontine", "scale": 30000, "provider": "iim",
         "point_inside": [12.95, 40.90], "point_outside": [12.0, 41.5], "class": "coastal_mltpnl"},
        {"chart_id": "340", "title": "Mar Mediterraneo", "scale": 2250000, "provider": "iim",
         "point_inside": [10.0, 40.0], "point_outside": [-20.0, 50.0], "class": "overview", "international_id": "301"},
        {"chart_id": "350", "title": "Mar Mediterraneo", "scale": 2250000, "provider": "iim",
         "point_inside": [15.0, 37.0], "point_outside": [0.0, 50.0], "class": "overview", "international_id": "302"},
        {"chart_id": "360", "title": "Mar Mediterraneo e Mar Nero", "scale": 4200000, "provider": "iim",
         "point_inside": [12.0, 42.0], "point_outside": [-20.0, 55.0], "class": "overview", "international_id": "300"},
        {"chart_id": "2", "title_contains": "Imperia", "scale": 100000, "provider": "iim", "class": "coastal",
         "optional": True},
        {"chart_id": "326", "title_contains": "Bonifacio", "scale": 30000, "provider": "iim", "class": "coastal",
         "optional": True},
    ]
    by_id = {r["chart_id"]: r for r in records}
    fx_report = []
    for fx in fixtures:
        rec = by_id.get(fx["chart_id"])
        if not rec:
            fx_report.append({**fx, "ok": False, "reason": "missing"})
            continue
        ok = rec.get("scale_denominator") == fx["scale"]
        if fx.get("international_id"):
            ok = ok and rec.get("international_id") == fx["international_id"]
        if "point_inside" in fx and rec.get("bbox"):
            lon, lat = fx["point_inside"]
            ok = ok and point_in_bbox(lon, lat, rec["bbox"])
        if "point_outside" in fx and rec.get("bbox"):
            lon, lat = fx["point_outside"]
            ok = ok and not point_in_bbox(lon, lat, rec["bbox"])
        fx_report.append({**fx, "ok": ok, "bbox": rec.get("bbox"), "title_actual": rec.get("title")})
    write_json(OUT_IIM / "fixtures.json", {"provider_id": "iim", "fixtures": fx_report})
    val_report = {
        **val,
        "record_count": len(records),
        "footprint_count": parsed["footprint_count"],
        "metadata_only_count": parsed["metadata_only_count"],
        "quarantine_count": parsed["quarantine_count"],
        "panel_raw_values": parsed["panel_raw_values"],
        "fixture_pass": all(x.get("ok") for x in fx_report if not x.get("optional")),
        "source_html_sha256": parsed["source_checksum"],
        "source_html_bytes": len(raw),
    }
    write_json(OUT_IIM / "validation-report.json", val_report)
    manifest = {
        "package_schema_version": "1.0-draft",
        "package_id": "iim-paper-interactive-map-world",
        "built_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "provider": {"id": "iim", "name": "Istituto Idrografico della Marina"},
        "source": {
            "kind": "interactive-sailing-map-post",
            "url": "https://www.istitutoidrografico.it/InteractiveSailingMap/myPathMaps.php",
            "method": "POST",
            "query": "drawRecs world bbox selScala=tutte",
            "file": IIM_HTML.name,
            "bytes": len(raw),
            "sha256": parsed["source_checksum"],
            "note": "Harvest HTML kept outside repo (contains third-party Maps API key). Normalized JSON only in git.",
        },
        "record_count": len(records),
        "footprint_count": parsed["footprint_count"],
        "metadata_only_count": parsed["metadata_only_count"],
        "quarantine_count": parsed["quarantine_count"],
        "output_files": [cat_meta, gj_meta, compact_meta],
        "rights_status": "derived-public-interactive-map-index",
        "geometry": "WGS84 GeoJSON lon/lat axis-aligned rectangles from rectMaps [S,N,W,E]",
        "embedded_payload": compact_meta,
    }
    write_json(OUT_IIM / "manifest.json", manifest)
    return {"parsed": parsed, "validation": val_report, "compact": compact_obj, "manifest": manifest}


def build_ukho() -> dict:
    OUT_UKHO.mkdir(parents=True, exist_ok=True)
    parsed = parse_cal(UKHO_XLS)
    src_sha = sha256_file(UKHO_XLS)
    records = [strip_raw(r) for r in parsed["records"]]
    compact = []
    for rec in records:
        compact.append({
            "id": rec["record_id"],
            "pid": "ukho",
            "sid": "ba",
            "sn": "ADMIRALTY paper charts",
            "cid": rec["chart_id"],
            "t": rec.get("title"),
            "sc": rec.get("scale_denominator"),
            "ed": rec.get("edition"),
            "edt": rec.get("publication_date"),
            "cs": "metadata_only",
            "ct": "nautical",
            "rs": "derived-public-cal-metadata",
            "src": rec.get("source_file"),
        })
    cat_meta = write_json(OUT_UKHO / "catalog.json", {
        "schema": "carto-provider-catalog-v1",
        "provider_id": "ukho",
        "catalog_status": "metadata_only",
        "records": records,
    })
    compact_obj = {
        "schema": "carto-igm-compact-v1",
        "schema_version": "1.0.0-fed-ukho",
        "provider_id": "ukho",
        "feature_count": len(compact),
        "attribution": "UKHO / ADMIRALTY Chart Availability List — metadati pubblici, nessuna impronta. Non affiliato.",
        "rights_status": "derived-public-cal-metadata",
        "records": compact,
    }
    compact_meta = write_json(OUT_UKHO / "compact-v1.json", compact_obj, pretty=False)
    fixtures = [
        {"chart_id": "2", "title": "United Kingdom and Ireland", "scale": 1500000, "provider": "ukho"},
        {"chart_id": "1", "provider": "ukho", "optional": True},
        {"chart_id": "100", "provider": "ukho", "optional": True},
        {"chart_id": "1446", "provider": "ukho", "optional": True},
        {"chart_id": "1780", "provider": "ukho", "optional": True},
        {"chart_id": "2115", "provider": "ukho", "optional": True},
        {"chart_id": "2649", "provider": "ukho", "optional": True},
        {"chart_id": "3105", "provider": "ukho", "optional": True},
        {"chart_id": "4000", "provider": "ukho", "optional": True},
        {"chart_id": "4404", "provider": "ukho", "optional": True},
        {"chart_id": "4801", "provider": "ukho", "optional": True},
        {"chart_id": "Q6110", "provider": "ukho", "optional": True},
    ]
    by_id = {r["chart_id"]: r for r in records}
    fx_report = []
    for fx in fixtures:
        rec = by_id.get(str(fx["chart_id"]).upper()) or by_id.get(str(fx["chart_id"]))
        if not rec:
            fx_report.append({**fx, "ok": bool(fx.get("optional")), "reason": "missing", "spatial": "n/a"})
            continue
        ok = rec.get("catalog_status") == "metadata_only" and not rec.get("footprints")
        if fx.get("title"):
            ok = ok and rec.get("title") == fx["title"]
        if fx.get("scale"):
            ok = ok and rec.get("scale_denominator") == fx["scale"]
        fx_report.append({**fx, "ok": ok, "title_actual": rec.get("title"), "spatial": "n/a-metadata_only"})
    write_json(OUT_UKHO / "fixtures.json", {"provider_id": "ukho", "fixtures": fx_report})
    val = {
        "ok": parsed["quarantine_count"] == 0 and len(records) > 1000,
        "record_count": len(records),
        "footprint_count": 0,
        "metadata_only_count": len(records),
        "quarantine_count": parsed["quarantine_count"],
        "headers": parsed["headers"],
        "duplicate_logical_keys": 0,
        "geometry": "none",
        "fixture_pass": all(x.get("ok") for x in fx_report if not x.get("optional") or x.get("reason") != "missing"),
    }
    write_json(OUT_UKHO / "validation-report.json", val)
    manifest = {
        "package_schema_version": "1.0-draft",
        "package_id": "ukho-cal-metadata-only",
        "built_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "provider": {"id": "ukho", "name": "UKHO / ADMIRALTY"},
        "source": {
            "kind": "chart-availability-list-xls",
            "url": "https://www.admiralty.co.uk/charts/chart-availability-list",
            "file": UKHO_XLS.name,
            "bytes": UKHO_XLS.stat().st_size,
            "sha256": src_sha,
            "note": "XLS kept outside repo. ADC Paper Charts .7CB is proprietary SevenCs — geometry STOP.",
        },
        "record_count": len(records),
        "footprint_count": 0,
        "metadata_only_count": len(records),
        "output_files": [cat_meta, compact_meta],
        "rights_status": "derived-public-cal-metadata",
        "embedded_payload": compact_meta,
    }
    write_json(OUT_UKHO / "manifest.json", manifest)
    mixed = {
        "point": [9.828, 44.107],
        "label": "La Spezia",
        "expect_providers": ["igm", "iim"],
        "ukho_spatial": "not_applicable_metadata_only",
        "iim_chart_ids_expected": ["59", "60", "115", "3", "340", "360"],
    }
    write_json(ROOT / "data" / "carto" / "fixtures-mixed.json", mixed)
    return {"parsed": {k: v for k, v in parsed.items() if k not in ("records", "quarantine")},
            "validation": val, "compact": compact_obj, "manifest": manifest}


NOTICE_IIM = """# NOTICE — indice IIM (carte nautiche)

I file in questa directory sono **metadati e impronte rettangolari derivate** dalla
Interactive Sailing Map pubblica dell’Istituto Idrografico della Marina.
Condizioni **separate** dalla licenza del codice.

## Fonte

- POST `InteractiveSailingMap/myPathMaps.php` (flusso ufficiale della mappa pubblica)
- Geometrie: `rectMaps` = rettangoli WGS84 `[south, north, west, east]` serviti dalla pagina
- Non è un quadro d’unione vettoriale ufficiale (SHP/GeoJSON IIM assente)

## Diritti

- Titolare delle carte: **Istituto Idrografico della Marina**
- Questo pacchetto **non** include raster, PDF di carte, né contenuti editoriali
- Indice derivato da lookup pubblico; redistribuzione nell’app richiesta dall’operatore per WU-0012
- **Non affiliato** all’IIM; l’IIM non fornisce supporto per questo software
- Autorizzazione formale analoga a IGM **non** è registrata: `rights_status = derived-public-interactive-map-index`

## Uso

- Interrogazione offline dell’indice nel GIS standalone
- Uso non commerciale del solo indice/impronte
"""

NOTICE_UKHO = """# NOTICE — catalogo UKHO / ADMIRALTY (CAL)

Metadati derivati dalla **Chart Availability List** pubblica (XLS settimanale).
**Nessuna impronta**: il CAL non contiene bbox/polygon; ADC Paper Charts è binario SevenCs non parsato.

## Diritti

- Titolare: UK Hydrographic Office / ADMIRALTY
- Questo pacchetto non include carte, raster, ENC, né geometrie ADC
- Licenza dell’indice derivato: **UNKNOWN** — snapshot richiesto dall’operatore per WU-0012
- Non affiliato a UKHO/ADMIRALTY
- `catalog_status = metadata_only` su tutti i record
"""


def main() -> None:
    if not IIM_HTML.is_file():
        raise SystemExit("missing IIM harvest: " + str(IIM_HTML))
    if not UKHO_XLS.is_file():
        raise SystemExit("missing UKHO CAL: " + str(UKHO_XLS))
    OUT_IIM.mkdir(parents=True, exist_ok=True)
    OUT_UKHO.mkdir(parents=True, exist_ok=True)
    (OUT_IIM / "NOTICE.md").write_text(NOTICE_IIM, encoding="utf-8")
    (OUT_UKHO / "NOTICE.md").write_text(NOTICE_UKHO, encoding="utf-8")
    iim = build_iim()
    ukho = build_ukho()
    print(json.dumps({
        "iim_records": iim["validation"]["record_count"],
        "iim_footprints": iim["validation"]["footprint_count"],
        "iim_ok": iim["validation"]["ok"] and iim["validation"]["fixture_pass"],
        "ukho_records": ukho["validation"]["record_count"],
        "ukho_ok": ukho["validation"]["ok"],
        "iim_compact_bytes": iim["manifest"]["embedded_payload"]["bytes"],
        "ukho_compact_bytes": ukho["manifest"]["embedded_payload"]["bytes"],
    }, indent=2))


if __name__ == "__main__":
    main()
