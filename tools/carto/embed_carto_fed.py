#!/usr/bin/env python3
"""Embed IIM/UKHO compact payloads into the monolite after #cartoIgmEmbeddedData."""
from __future__ import annotations

import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HTML = ROOT / "coordinate_converter Claude.html"
IIM_COMPACT = ROOT / "data" / "carto" / "iim" / "compact-v1.json"
UKHO_COMPACT = ROOT / "data" / "carto" / "ukho" / "compact-v1.json"
START = "<!-- CARTO-FED-EMBED-START -->"
END = "<!-- CARTO-FED-EMBED-END -->"


def tag_for(el_id: str, payload: str, provider: str, count: int) -> str:
    raw = payload.encode("utf-8")
    sha = hashlib.sha256(raw).hexdigest().upper()
    return (
        f'<script type="application/json" id="{el_id}" '
        f'data-format="carto-igm-compact-v1" data-provider="{provider}" '
        f'data-sha256="{sha}" data-bytes="{len(raw)}" data-feature-count="{count}">\n'
        f"{payload}\n"
        f"</script>"
    )


def main() -> None:
    iim = IIM_COMPACT.read_text(encoding="utf-8").strip()
    ukho = UKHO_COMPACT.read_text(encoding="utf-8").strip()
    import json
    iim_n = json.loads(iim)["feature_count"]
    ukho_n = json.loads(ukho)["feature_count"]
    block = (
        f"\n{START}\n"
        + tag_for("cartoIimEmbeddedData", iim, "iim", iim_n)
        + "\n"
        + tag_for("cartoUkhoEmbeddedData", ukho, "ukho", ukho_n)
        + f"\n{END}\n"
    )
    text = HTML.read_text(encoding="utf-8")
    if START in text and END in text:
        pre = text.split(START, 1)[0]
        post = text.split(END, 1)[1]
        # keep a single newline after END block
        new = pre.rstrip("\n") + block + post.lstrip("\n")
    else:
        needle = 'id="cartoIgmEmbeddedData"'
        idx = text.find(needle)
        if idx < 0:
            raise SystemExit("cartoIgmEmbeddedData not found")
        close = text.find("</script>", idx)
        if close < 0:
            raise SystemExit("closing script not found")
        insert_at = close + len("</script>")
        new = text[:insert_at] + block + text[insert_at:]
    HTML.write_text(new, encoding="utf-8", newline="\n")
    print("embedded iim", iim_n, "ukho", ukho_n, "html_bytes", HTML.stat().st_size)


if __name__ == "__main__":
    main()
