#!/usr/bin/env python3
"""Parse UKHO Chart Availability List (.xls) into provider-neutral metadata_only records.

CAL has no footprint columns (PROVATO). catalog_status = metadata_only; no invented polygons.
"""
from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path
from typing import Any

try:
    import xlrd
except ImportError as e:  # pragma: no cover
    raise SystemExit("xlrd required for CAL parse (tooling only): python -m pip install xlrd") from e


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 16), b""):
            h.update(chunk)
    return h.hexdigest()


def norm_header(s: Any) -> str:
    t = "" if s is None else str(s)
    t = t.replace("\n", " ").strip().lower()
    t = re.sub(r"\s+", " ", t)
    return t


def normalize_chart_id(raw: Any) -> str:
    s = "" if raw is None else str(raw).strip()
    s = re.sub(r"\s+", "", s)
    return s.upper()


def parse_scale(raw: Any) -> int | None:
    if raw is None or raw == "":
        return None
    if isinstance(raw, (int, float)) and raw == raw:
        n = int(raw)
        return n if n > 0 else None
    s = str(raw).strip().replace(",", "")
    s = re.sub(r"^1:", "", s)
    s = s.replace(" ", "")
    if not s:
        return None
    try:
        n = int(float(s))
    except ValueError:
        return None
    return n if n > 0 else None


HEADER_MAP = {
    "number": "chart_id",
    "chart number": "chart_id",
    "title": "title",
    "scale": "scale_denominator",
    "edition date": "publication_date",
    "withdrawn date": "withdrawn_date",
    "replaced by": "replaced_by",
    "replaces": "replaces",
    "last nm number": "last_nm_number",
    "last nm week-year": "last_nm_week_year",
    "product status": "availability_status_raw",
    "edition number": "edition",
}


def cell_str(cell) -> str | None:
    if cell.ctype in (xlrd.XL_CELL_EMPTY, xlrd.XL_CELL_BLANK):
        return None
    if cell.ctype == xlrd.XL_CELL_NUMBER:
        v = cell.value
        if float(v).is_integer():
            return str(int(v))
        return str(v)
    if cell.ctype == xlrd.XL_CELL_DATE:
        try:
            t = xlrd.xldate_as_tuple(cell.value, 0)
            return f"{t[0]:04d}-{t[1]:02d}-{t[2]:02d}"
        except Exception:
            return str(cell.value)
    s = str(cell.value).strip()
    return s or None


def parse_cal(path: Path) -> dict:
    book = xlrd.open_workbook(str(path), formatting_info=False)
    sheet = book.sheet_by_index(0)
    # Find header row: first 20 rows
    header_row = None
    headers = []
    for r in range(min(20, sheet.nrows)):
        vals = [norm_header(sheet.cell_value(r, c)) for c in range(sheet.ncols)]
        if any(v in HEADER_MAP for v in vals) and sum(1 for v in vals if v in HEADER_MAP) >= 3:
            header_row = r
            headers = vals
            break
    if header_row is None:
        raise ValueError("cal_header_not_found")

    col_to_field = {}
    for i, h in enumerate(headers):
        if h in HEADER_MAP:
            col_to_field[i] = HEADER_MAP[h]

    records = []
    quarantine = []
    seen = {}
    for r in range(header_row + 1, sheet.nrows):
        row = {}
        for c, field in col_to_field.items():
            row[field] = cell_str(sheet.cell(r, c))
        cid = normalize_chart_id(row.get("chart_id"))
        if not cid:
            continue
        title = row.get("title")
        if not title:
            # skip blank/spacer rows
            continue
        logical = "ukho|ba|" + cid
        rec = {
            "schema_version": "1.0.0-draft",
            "provider_id": "ukho",
            "provider_name": "UKHO / ADMIRALTY",
            "series_id": "ba",
            "series_name": "ADMIRALTY paper charts",
            "chart_id": cid,
            "international_id": None,
            "title": title,
            "chart_type": "nautical",
            "scale_denominator": parse_scale(row.get("scale_denominator")),
            "edition": row.get("edition"),
            "revision": None,
            "publication_date": row.get("publication_date"),
            "availability_status": (row.get("availability_status_raw") or "unknown"),
            "withdrawn_date": row.get("withdrawn_date"),
            "replaced_by": row.get("replaced_by"),
            "replaces": row.get("replaces"),
            "source_url": "https://www.admiralty.co.uk/charts/chart-availability-list",
            "source_file": path.name,
            "original_crs": None,
            "footprints": [],
            "bbox": None,
            "catalog_status": "metadata_only",
            "logical_key": logical,
            "archive_match_keys": [logical, "ukho|" + cid],
            "record_id": "ukho:ba:" + cid,
            "raw": row,
        }
        if logical in seen:
            q = dict(rec)
            q["catalog_status"] = "quarantine"
            q["quarantine_reason"] = "duplicate_logical_key"
            quarantine.append(q)
            continue
        seen[logical] = True
        records.append(rec)

    return {
        "sheet_name": sheet.name,
        "nrows": sheet.nrows,
        "ncols": sheet.ncols,
        "header_row": header_row,
        "headers": headers,
        "mapped_fields": list(col_to_field.values()),
        "record_count": len(records),
        "quarantine_count": len(quarantine),
        "metadata_only_count": len(records),
        "footprint_count": 0,
        "records": records,
        "quarantine": quarantine,
    }


if __name__ == "__main__":
    import sys
    p = Path(sys.argv[1] if len(sys.argv) > 1 else "C:/tmp/goi-carto-discovery/ukho/Chart_Availability_List_0.xls")
    parsed = parse_cal(p)
    summary = {k: v for k, v in parsed.items() if k not in ("records", "quarantine")}
    print(json.dumps(summary, indent=2))
    print("sample", json.dumps(parsed["records"][:2], indent=2)[:1200])
