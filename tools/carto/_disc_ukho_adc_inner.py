#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import zipfile
from pathlib import Path

ROOT = Path("C:/tmp/goi-carto-discovery/ukho")
ADC = ROOT / "ADC_Catalogs_WK33_26.zip"
EXT = ROOT / "adc_extract"
EXT.mkdir(exist_ok=True)


def strings(data: bytes, minlen: int = 6) -> list[str]:
    out = []
    buf = b""
    for b in data:
        if 32 <= b < 127:
            buf += bytes([b])
        else:
            if len(buf) >= minlen:
                out.append(buf.decode("ascii"))
            buf = b""
    if len(buf) >= minlen:
        out.append(buf.decode("ascii"))
    return out


def main() -> None:
    with zipfile.ZipFile(ADC) as z:
        for name in ["objects.zip", "Paper Charts.cat", "ACCatalogs.zip", "ARCS.cat"]:
            dest = EXT / name.replace(" ", "_")
            dest.write_bytes(z.read(name))
            print("extracted", name, dest.stat().st_size)

    obj = EXT / "objects.zip"
    with zipfile.ZipFile(obj) as z:
        print("objects.zip entries:")
        for i in z.infolist():
            print(" ", i.filename, i.file_size)
        z.extractall(EXT / "objects")

    paper = (EXT / "Paper_Charts.cat").read_bytes()
    ss = strings(paper, 5)
    keys = [s for s in ss if re.search(r"lat|lon|long|scale|limit|bbox|poly|chart|north|south|east|west|INT", s, re.I)]
    print("paper strings n", len(ss))
    print("paper keys", keys[:80])
    print("paper head hex", paper[:64].hex())
    print("paper head ascii", paper[:200])

    # sample objects files
    obj_dir = EXT / "objects"
    obj_files = list(obj_dir.rglob("*"))[:40]
    print("object files", [(str(p.relative_to(obj_dir)), p.stat().st_size if p.is_file() else "dir") for p in obj_files])

    report = {
        "paper_magic": paper[:16].hex(),
        "paper_bytes": len(paper),
        "paper_key_strings": keys[:120],
        "objects_listing": [
            {"name": i.filename, "bytes": i.file_size}
            for i in zipfile.ZipFile(obj).infolist()
        ],
    }
    (ROOT / "adc_inner.json").write_text(json.dumps(report, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
