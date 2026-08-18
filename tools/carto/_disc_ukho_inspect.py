#!/usr/bin/env python3
"""Inspect UKHO CAL XLS + ADC Catalogs ZIP structure (stdlib + optional xlrd)."""
from __future__ import annotations

import json
import zipfile
from collections import Counter
from pathlib import Path

OUT = Path("C:/tmp/goi-carto-discovery/ukho")
CAL = OUT / "Chart_Availability_List_0.xls"
ADC = OUT / "ADC_Catalogs_WK33_26.zip"


def inspect_zip() -> dict:
    names = []
    ext = Counter()
    with zipfile.ZipFile(ADC) as z:
        for i in z.infolist():
            names.append({"name": i.filename, "bytes": i.file_size, "compress": i.compress_size})
            p = Path(i.filename)
            ext[p.suffix.lower() or "(dir/noext)"] += 1
    return {
        "entries": len(names),
        "ext": dict(ext),
        "sample": names[:80],
        "geoish": [
            n["name"]
            for n in names
            if any(k in n["name"].lower() for k in (".shp", ".geojson", ".json", ".kml", ".gml", ".xml", ".dbf", "limit", "cover", "extent", "polygon", "bbox", "catalogue", "catalog"))
        ][:200],
    }


def inspect_xls() -> dict:
    rec = {"path": str(CAL), "bytes": CAL.stat().st_size}
    try:
        import xlrd  # type: ignore
    except Exception as e:
        rec["xlrd"] = f"missing:{type(e).__name__}:{e}"
        # crude string harvest
        raw = CAL.read_bytes()
        strings = []
        buf = b""
        for b in raw:
            if 32 <= b < 127:
                buf += bytes([b])
            else:
                if len(buf) >= 4:
                    strings.append(buf.decode("ascii"))
                buf = b""
        rec["ascii_strings_n"] = len(strings)
        rec["ascii_sample"] = strings[:80]
        rec["has_lat"] = any("lat" in s.lower() for s in strings)
        rec["has_lon"] = any(("lon" in s.lower()) or ("long" in s.lower()) for s in strings)
        rec["has_scale"] = any("scale" in s.lower() for s in strings)
        rec["has_bbox"] = any("bbox" in s.lower() or "limit" in s.lower() for s in strings)
        return rec

    book = xlrd.open_workbook(str(CAL), formatting_info=False)
    rec["xlrd"] = "ok"
    rec["nsheets"] = book.nsheets
    rec["sheet_names"] = book.sheet_names()
    sheets = []
    for name in book.sheet_names()[:12]:
        sh = book.sheet_by_name(name)
        headers = [str(sh.cell_value(0, c)).strip() for c in range(min(sh.ncols, 40))] if sh.nrows else []
        row1 = [sh.cell_value(1, c) for c in range(min(sh.ncols, 20))] if sh.nrows > 1 else []
        sheets.append({"name": name, "nrows": sh.nrows, "ncols": sh.ncols, "headers": headers, "row1": row1})
    rec["sheets"] = sheets
    return rec


def main() -> None:
    z = inspect_zip()
    x = inspect_xls()
    out = {"cal": x, "adc_zip": {"entries": z["entries"], "ext": z["ext"], "geoish_n": len(z["geoish"]), "geoish": z["geoish"][:120], "sample": z["sample"][:40]}}
    dest = OUT / "structure_report.json"
    dest.write_text(json.dumps(out, indent=2, default=str), encoding="utf-8")
    print("ADC entries", z["entries"], "ext", z["ext"])
    print("geoish", len(z["geoish"]))
    for n in z["geoish"][:60]:
        print(" ", n)
    print("CAL", json.dumps({k: v for k, v in x.items() if k not in ("ascii_sample",)}, indent=2, default=str)[:4000])
    print("WROTE", dest)


if __name__ == "__main__":
    main()
