#!/usr/bin/env python3
"""CARTO-IIM-PROVIDER-A-FIX1 — IIM filter must stay uncheckable.

Root cause: cartoUiGetState() re-pushed series \"paper\" on every get, so
cartoUiRenderPanel() immediately re-checked #cartoIimFilterPaper.

Protects #cartoIgmEmbeddedData. Does not touch UKHO.
"""
from __future__ import annotations

import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HTML = ROOT / "coordinate_converter Claude.html"
IGM_OPEN = '<script type="application/json" id="cartoIgmEmbeddedData"'

PAPER_PUSH = (
    '      if (!Object.prototype.hasOwnProperty.call(state._cartoUi, "_areaPickMinimizedByPicker"))\n'
    '        state._cartoUi._areaPickMinimizedByPicker = false;\n'
    '      if (Array.isArray(state._cartoUi.selectedSeries) && state._cartoUi.selectedSeries.indexOf("paper") < 0)\n'
    '        state._cartoUi.selectedSeries.push("paper");\n'
    "    }"
)
PAPER_PUSH_FIXED = (
    '      if (!Object.prototype.hasOwnProperty.call(state._cartoUi, "_areaPickMinimizedByPicker"))\n'
    '        state._cartoUi._areaPickMinimizedByPicker = false;\n'
    "    }"
)

SELFTEST_OLD = (
    '    add("no_poly_mut", (typeof state !== "undefined" && Array.isArray(state.gisPolygons)) ? state.gisPolygons.length === gp0 : true);\n'
    "    const pass = checks.every(function(c){ return c.ok; });"
)
SELFTEST_NEW = (
    '    add("no_poly_mut", (typeof state !== "undefined" && Array.isArray(state.gisPolygons)) ? state.gisPolygons.length === gp0 : true);\n'
    "    (function probeIimFilterUncheck(){\n"
    '      try { if (typeof initCartoUiResultsA === "function") initCartoUiResultsA(); } catch(_){}\n'
    '      const el = document.getElementById("cartoIimFilterPaper");\n'
    '      const igmEl = document.getElementById("cartoIgmFilter50");\n'
    '      if (!el) { add("filter_iim_uncheckable", false, "missing_checkbox"); add("filter_igm_uncheckable", false, "skipped"); return; }\n'
    "      const prevIim = !!el.checked;\n"
    "      el.checked = false;\n"
    '      try { el.dispatchEvent(new Event("change", { bubbles: true })); } catch(_){}\n'
    "      const series = (typeof state !== \"undefined\" && state._cartoUi && Array.isArray(state._cartoUi.selectedSeries))\n"
    "        ? state._cartoUi.selectedSeries : [];\n"
    '      add("filter_iim_uncheckable", el.checked === false && series.indexOf("paper") < 0,\n'
    "        { checked: el.checked, series: Array.isArray(series) ? series.slice() : series });\n"
    "      el.checked = prevIim;\n"
    '      try { el.dispatchEvent(new Event("change", { bubbles: true })); } catch(_){}\n'
    '      if (!igmEl) { add("filter_igm_uncheckable", true, "no_dom"); return; }\n'
    "      const prevIgm = !!igmEl.checked;\n"
    "      igmEl.checked = false;\n"
    '      try { igmEl.dispatchEvent(new Event("change", { bubbles: true })); } catch(_){}\n'
    '      add("filter_igm_uncheckable", igmEl.checked === false, igmEl.checked);\n'
    "      igmEl.checked = prevIgm;\n"
    '      try { igmEl.dispatchEvent(new Event("change", { bubbles: true })); } catch(_){}\n'
    "    })();\n"
    "    const pass = checks.every(function(c){ return c.ok; });"
)

BUILD_OLD = (
    'const APP_BUILD_ID = "CARTO-IIM-PROVIDER-A";\n'
    'const APP_BUILD_DETAIL = "IIM snapshot Interactive Sailing Map (180), federato IGM. UKHO non a runtime.";\n'
    "/** Monotonic runtime build counter — increment on each runtime patch (not persisted). */\n"
    "const APP_BUILD_NUM = 230;"
)
BUILD_NEW = (
    'const APP_BUILD_ID = "CARTO-IIM-PROVIDER-A-FIX1";\n'
    'const APP_BUILD_DETAIL = "IIM snapshot Interactive Sailing Map (180), federato IGM. Filtro IIM deselezionabile. UKHO non a runtime.";\n'
    "/** Monotonic runtime build counter — increment on each runtime patch (not persisted). */\n"
    "const APP_BUILD_NUM = 231;"
)


def repl(text: str, old: str, new: str, expected: int, label: str) -> str:
    n = text.count(old)
    if n != expected:
        raise SystemExit(f"replace {label}: expected {expected} got {n}")
    return text.replace(old, new)


def split_igm(text: str) -> tuple[str, str, str]:
    a = text.find(IGM_OPEN)
    if a < 0:
        raise SystemExit("IGM open missing")
    b = text.find("</script>", a)
    if b < 0:
        raise SystemExit("IGM close missing")
    return text[:a], text[a : b + len("</script>")], text[b + len("</script>") :]


def main() -> None:
    raw = HTML.read_bytes()
    crlf = b"\r\n" in raw[:8000]
    text = raw.decode("utf-8").replace("\r\n", "\n")
    prefix, igm, suffix = split_igm(text)
    if "carto-igm-compact-v1" not in igm:
        raise SystemExit("IGM payload missing")

    suffix = repl(suffix, PAPER_PUSH, PAPER_PUSH_FIXED, 1, "remove-paper-push")
    suffix = repl(suffix, SELFTEST_OLD, SELFTEST_NEW, 1, "selftest-uncheck")
    suffix = repl(suffix, BUILD_OLD, BUILD_NEW, 1, "build-identity")

    n_id = suffix.count("CARTO-IIM-PROVIDER-A")
    # BUILD_NEW already contains CARTO-IIM-PROVIDER-A-FIX1, whose prefix
    # still matches the old token. Pin replacements must skip FIX1.
    suffix = suffix.replace("CARTO-IIM-PROVIDER-A-FIX1", "\x00FIX1\x00")
    n_plain = suffix.count("CARTO-IIM-PROVIDER-A")
    suffix = suffix.replace("CARTO-IIM-PROVIDER-A", "CARTO-IIM-PROVIDER-A-FIX1")
    suffix = suffix.replace("\x00FIX1\x00", "CARTO-IIM-PROVIDER-A-FIX1")
    print("id tokens before pin replace", n_id, "plain after shielding FIX1", n_plain)

    n230 = suffix.count("APP_BUILD_NUM === 230")
    suffix = suffix.replace("APP_BUILD_NUM === 230", "APP_BUILD_NUM === 231")
    print("replaced APP_BUILD_NUM === 230", n230)
    if n230 < 1:
        raise SystemExit("no APP_BUILD_NUM === 230 pins")
    if "APP_BUILD_NUM === 230" in suffix or "const APP_BUILD_NUM = 230" in suffix:
        raise SystemExit("stale 230 pin remains")
    if 'APP_BUILD_ID === "CARTO-IIM-PROVIDER-A"' in suffix:
        raise SystemExit("stale APP_BUILD_ID pin without FIX1")
    if "selectedSeries.push(\"paper\")" in suffix:
        raise SystemExit("paper push still present")

    out = prefix + igm + suffix
    if crlf:
        out = out.replace("\n", "\r\n")
    HTML.write_bytes(out.encode("utf-8"))

    t2 = HTML.read_text(encoding="utf-8").replace("\r\n", "\n")
    _p2, igm2, s2 = split_igm(t2)
    if igm2 != igm:
        raise SystemExit("IGM payload mutated")
    if "cartoUkhoEmbeddedData" in t2:
        raise SystemExit("UKHO embed must stay absent")
    if 'const APP_BUILD_NUM = 231' not in s2:
        raise SystemExit("build 231 missing")
    if 'const APP_BUILD_ID = "CARTO-IIM-PROVIDER-A-FIX1"' not in s2:
        raise SystemExit("FIX1 id missing")
    lf = t2.encode("utf-8")
    print("bytes_lf", len(lf))
    print("sha256_lf", hashlib.sha256(lf).hexdigest())
    print("IGM intact, UKHO absent, FIX1 applied")


if __name__ == "__main__":
    main()
