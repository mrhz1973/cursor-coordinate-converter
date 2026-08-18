#!/usr/bin/env python3
from __future__ import annotations

import csv
import json
import zipfile
from pathlib import Path

ROOT = Path("C:/tmp/goi-carto-discovery/ukho")
EXT = ROOT / "adc_extract"
CSV = EXT / "objects/ADMIRALTY_Digital_Catalogue/data/world/objects.csv"
PAPER = EXT / "Paper_Charts.cat"


def main() -> None:
    with CSV.open("r", encoding="utf-8", errors="replace", newline="") as f:
        r = csv.reader(f)
        header = next(r)
        rows = []
        for i, row in enumerate(r):
            if i < 3:
                rows.append(row)
            if i >= 2:
                break
    print("CSV cols", len(header))
    print("HEADERS:")
    for i, h in enumerate(header):
        print(f"  {i:02d} {h}")
    print("ROW0", rows[0][:20] if rows else None)

    n = 0
    with CSV.open("r", encoding="utf-8", errors="replace", newline="") as f:
        r = csv.DictReader(f)
        n = sum(1 for _ in r)
    print("CSV rows", n)

    print("Paper Charts.cat as zip?")
    try:
        with zipfile.ZipFile(PAPER) as z:
            print(" paper zip entries", len(z.infolist()))
            for i in z.infolist()[:40]:
                print(" ", i.filename, i.file_size)
    except Exception as e:
        print(" not zip", e)

    (ROOT / "adc_objects_header.json").write_text(
        json.dumps({"n": n, "header": header, "row0": rows[0] if rows else None}, indent=2),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
