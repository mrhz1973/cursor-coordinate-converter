#!/usr/bin/env python3
from __future__ import annotations

import zipfile
from pathlib import Path

EXT = Path("C:/tmp/goi-carto-discovery/ukho/adc_extract")
PAPER = EXT / "Paper_Charts.cat"
OUT = EXT / "paper_unzip"
OUT.mkdir(exist_ok=True)

with zipfile.ZipFile(PAPER) as z:
    z.extractall(OUT)
    for p in sorted(OUT.iterdir()):
        if not p.is_file():
            continue
        raw = p.read_bytes()[:32]
        print(p.name, p.stat().st_size, raw[:16].hex(), raw[:16])
