#!/usr/bin/env python3
"""Offline selftest: IIM snapshot geometry + UKHO CAL metadata parser (no spatial UKHO)."""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
IIM_CAT = ROOT / "data" / "carto" / "iim" / "catalog.json"
UKHO_CAT = ROOT / "data" / "carto" / "ukho" / "catalog.json"
IIM_FX = ROOT / "data" / "carto" / "iim" / "fixtures.json"
UKHO_FX = ROOT / "data" / "carto" / "ukho" / "fixtures.json"
MIXED = ROOT / "data" / "carto" / "fixtures-mixed.json"
IIM_MAN = ROOT / "data" / "carto" / "iim" / "manifest.json"
UKHO_MAN = ROOT / "data" / "carto" / "ukho" / "manifest.json"


def add(checks: list, name: str, ok: bool, detail=None) -> None:
    checks.append({"name": name, "ok": bool(ok), "detail": detail})


def point_in_bbox(lon, lat, bbox) -> bool:
    w, s, e, n = bbox
    return w <= lon <= e and s <= lat <= n


def main() -> int:
    checks = []
    iim = json.loads(IIM_CAT.read_text(encoding="utf-8"))
    ukho = json.loads(UKHO_CAT.read_text(encoding="utf-8"))
    iim_recs = iim["records"]
    ukho_recs = ukho["records"]
    iim_man = json.loads(IIM_MAN.read_text(encoding="utf-8"))
    ukho_man = json.loads(UKHO_MAN.read_text(encoding="utf-8"))
    iim_fx = json.loads(IIM_FX.read_text(encoding="utf-8"))
    ukho_fx = json.loads(UKHO_FX.read_text(encoding="utf-8"))

    add(checks, "iim_count_snapshot_180", len(iim_recs) == 180, len(iim_recs))
    add(checks, "iim_declared_snapshot", iim_man.get("not_complete_catalog") is True
        and iim_man.get("catalog_kind") == "interactive_sailing_map_snapshot")
    add(checks, "iim_finding_2_326", {f["chart_id"] for f in iim_man.get("completeness_findings") or []} == {"2", "326"})
    ids = {r["chart_id"] for r in iim_recs}
    add(checks, "iim_2_absent", "2" not in ids)
    add(checks, "iim_326_absent", "326" not in ids)

    iim_keys = [r["logical_key"] for r in iim_recs]
    add(checks, "iim_unique_keys", len(iim_keys) == len(set(iim_keys)), len(iim_keys) - len(set(iim_keys)))
    add(checks, "iim_pid", all(r["provider_id"] == "iim" for r in iim_recs))
    add(checks, "iim_all_geometry", all(r.get("footprints") for r in iim_recs))

    closed = True
    bbox_ok = True
    for r in iim_recs:
        for fp in r["footprints"]:
            ring = fp["geometry"]["coordinates"][0]
            if ring[0] != ring[-1]:
                closed = False
            b = r["bbox"]
            if not b or b[1] >= b[3] or b[0] >= b[2]:
                bbox_ok = False
    add(checks, "iim_polygon_closed", closed)
    add(checks, "iim_bbox", bbox_ok)

    req = [f for f in iim_fx["fixtures"] if f.get("kind") != "finding"]
    add(checks, "iim_spatial_fixtures", all(f.get("ok") for f in req) and not any(f.get("optional") for f in req),
        [f["chart_id"] for f in req if not f.get("ok")])
    add(checks, "iim_findings_not_counted_as_pass",
        all(f.get("counts_as_pass") is False for f in iim_fx.get("completeness_findings") or []))

    rec360 = next(r for r in iim_recs if r["chart_id"] == "360")
    add(checks, "iim_int_360", rec360.get("international_id") == "300", rec360.get("international_id"))
    rec115 = next(r for r in iim_recs if r["chart_id"] == "115")
    add(checks, "iim_int_115", rec115.get("international_id") == "3364")
    add(checks, "iim_scale_59", next(r for r in iim_recs if r["chart_id"] == "59")["scale_denominator"] == 5000)
    add(checks, "dup_detect_logic", len(set(iim_keys)) == len(iim_keys))
    mlt = [r for r in iim_recs if r.get("panel_raw") == "mltpnl"]
    add(checks, "iim_mltpnl_present", len(mlt) >= 1, len(mlt))

    # UKHO metadata parser only
    ukho_keys = [r["logical_key"] for r in ukho_recs]
    add(checks, "ukho_count_cal", len(ukho_recs) == 3912, len(ukho_recs))
    add(checks, "ukho_unique_keys", len(ukho_keys) == len(set(ukho_keys)), len(ukho_keys) - len(set(ukho_keys)))
    add(checks, "ukho_runtime_not_opened", ukho_fx.get("runtime_status") == "NOT_OPENED_FOR_RUNTIME"
        and ukho_man.get("runtime_status") == "NOT_OPENED_FOR_RUNTIME")
    add(checks, "ukho_footprint_blocked", ukho_fx.get("footprint_status") == "DISCOVERY_BLOCKED"
        and ukho_fx.get("footprint_count") == 0
        and ukho_fx.get("spatial_fixtures") == "NOT_AVAILABLE")
    add(checks, "ukho_all_metadata_only", all(r.get("catalog_status") == "metadata_only" for r in ukho_recs))
    add(checks, "ukho_zero_footprints", all(not r.get("footprints") for r in ukho_recs)
        and ukho_man.get("footprint_count") == 0)
    meta_fx = ukho_fx.get("metadata_parser_fixtures") or []
    add(checks, "ukho_metadata_fixtures", len(meta_fx) >= 8 and all(f.get("ok") for f in meta_fx)
        and all(f.get("spatial") == "NOT_AVAILABLE" for f in meta_fx), len(meta_fx))
    add(checks, "ukho_no_optional_missing_pass", not any(f.get("optional") for f in meta_fx))

    mixed = json.loads(MIXED.read_text(encoding="utf-8"))
    lon, lat = mixed["point"]
    hits = [r["chart_id"] for r in iim_recs if r.get("bbox") and point_in_bbox(lon, lat, r["bbox"])]
    expect = set(mixed["iim_chart_ids_expected"])
    add(checks, "mixed_iim_spezia", expect.issubset(set(hits)), sorted(hits))
    add(checks, "ukho_spatial_blocked_mixed", mixed.get("ukho_spatial") == "BLOCKED")
    add(checks, "iim_chart_id_nonempty", all(r.get("chart_id") for r in iim_recs))
    add(checks, "ukho_chart_id_nonempty", all(r.get("chart_id") for r in ukho_recs))

    failed = [c for c in checks if not c["ok"]]
    out = {"ok": not failed, "checks": checks, "failed": failed}
    print(json.dumps(out, indent=2, default=str))
    return 0 if out["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
