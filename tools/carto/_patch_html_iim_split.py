#!/usr/bin/env python3
"""Split UKHO out of CARTO runtime; IIM snapshot-only candidate CARTO-IIM-PROVIDER-A.

Protects #cartoIgmEmbeddedData. Rebuilds IIM embed. Does not invent UKHO geometry.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HTML = ROOT / "coordinate_converter Claude.html"
IIM_COMPACT = ROOT / "data" / "carto" / "iim" / "compact-v1.json"
IGM_OPEN = '<script type="application/json" id="cartoIgmEmbeddedData"'
START = "<!-- CARTO-FED-EMBED-START -->"
END = "<!-- CARTO-FED-EMBED-END -->"
NEW_ATTR = (
    "© Istituto Idrografico della Marina — snapshot Interactive Sailing Map "
    "(180 carte osservate, NON catalogo completo). Rettangoli WGS84. Non affiliato."
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
    return text[:a], text[a:b + len("</script>")], text[b + len("</script>"):]


def tag_iim(payload: str, count: int) -> str:
    raw = payload.encode("utf-8")
    sha = hashlib.sha256(raw).hexdigest().upper()
    return (
        f'<script type="application/json" id="cartoIimEmbeddedData" '
        f'data-format="carto-igm-compact-v1" data-provider="iim" '
        f'data-sha256="{sha}" data-bytes="{len(raw)}" data-feature-count="{count}">\n'
        f"{payload}\n"
        f"</script>"
    )


def update_compact() -> str:
    obj = json.loads(IIM_COMPACT.read_text(encoding="utf-8"))
    obj["attribution"] = NEW_ATTR
    obj["schema_version"] = "1.0.0-iim-snapshot"
    obj["catalog_kind"] = "interactive_sailing_map_snapshot"
    text = json.dumps(obj, ensure_ascii=False, separators=(",", ":"))
    IIM_COMPACT.write_text(text, encoding="utf-8")
    meta = ROOT / "data" / "carto" / "iim" / "manifest.json"
    man = json.loads(meta.read_text(encoding="utf-8"))
    raw = IIM_COMPACT.read_bytes()
    sha = hashlib.sha256(raw).hexdigest().upper()
    man["catalog_kind"] = "interactive_sailing_map_snapshot"
    man["not_complete_catalog"] = True
    man["completeness_findings"] = [
        {"chart_id": "2", "title": "Da Imperia a Portofino", "status": "missing_from_snapshot_present_in_shop"},
        {"chart_id": "326", "title": "Bocche di Bonifacio INT3350", "status": "missing_from_snapshot_present_in_shop"},
    ]
    man["edition_policy"] = "keep_interactive_map_values; shop edition mismatches are findings, not auto-corrected"
    for of in man.get("output_files", []):
        if of.get("file") == "compact-v1.json":
            of["bytes"] = len(raw)
            of["sha256"] = sha
    man["embedded_payload"] = {"file": "compact-v1.json", "bytes": len(raw), "sha256": sha}
    meta.write_text(json.dumps(man, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return text


def main() -> None:
    compact = update_compact()
    obj = json.loads(compact)
    count = obj["feature_count"]

    raw = HTML.read_bytes()
    crlf = b"\r\n" in raw[:8000]
    text = raw.decode("utf-8").replace("\r\n", "\n")
    prefix, igm, suffix = split_igm(text)

    prefix = repl(
        prefix,
        '<h2 id="cartoIgmPanelTitle" class="app-modal-title" data-i18n="carto.title">Indice cartografico IGM / IIM / UKHO</h2>',
        '<h2 id="cartoIgmPanelTitle" class="app-modal-title" data-i18n="carto.title">Indice cartografico IGM / IIM</h2>',
        1,
        "title",
    )
    prefix = repl(
        prefix,
        '    <p id="cartoUkhoMetaHint" class="hint carto-ukho-hint" data-i18n="carto.ukhoNote">UKHO/ADMIRALTY: catalogo metadati CAL embedded, senza impronte — escluso dalla ricerca spaziale.</p>',
        '    <p id="cartoIimSnapshotHint" class="hint carto-iim-hint" data-i18n="carto.iimSnapshotNote">IIM: snapshot Interactive Sailing Map (180 carte osservate), non catalogo completo.</p>',
        1,
        "hint",
    )

    suffix = repl(
        suffix,
        '"carto.title":"Indice cartografico IGM / IIM / UKHO"',
        '"carto.title":"Indice cartografico IGM / IIM"',
        1,
        "i18n-title",
    )
    suffix = repl(
        suffix,
        '"carto.ukhoNote":"UKHO/ADMIRALTY: catalogo metadati CAL embedded, senza impronte — escluso dalla ricerca spaziale.",',
        '"carto.iimSnapshotNote":"IIM: snapshot Interactive Sailing Map (180 carte osservate), non catalogo completo.",',
        1,
        "i18n-hint",
    )
    suffix = repl(
        suffix,
        'const APP_BUILD_ID = "CARTO-IIM-UKHO-PROVIDERS-A";\n'
        'const APP_BUILD_DETAIL = "Federazione IIM/UKHO nell\'indice CARTO (IIM impronte; UKHO metadati CAL).";\n'
        "/** Monotonic runtime build counter — increment on each runtime patch (not persisted). */\n"
        "const APP_BUILD_NUM = 229;",
        'const APP_BUILD_ID = "CARTO-IIM-PROVIDER-A";\n'
        'const APP_BUILD_DETAIL = "IIM snapshot Interactive Sailing Map (180), federato IGM. UKHO non a runtime.";\n'
        "/** Monotonic runtime build counter — increment on each runtime patch (not persisted). */\n"
        "const APP_BUILD_NUM = 230;",
        1,
        "build",
    )
    n_old = suffix.count("CARTO-IIM-UKHO-PROVIDERS-A")
    suffix = suffix.replace("CARTO-IIM-UKHO-PROVIDERS-A", "CARTO-IIM-PROVIDER-A")
    print("replaced old block pins", n_old)
    n229 = suffix.count("APP_BUILD_NUM === 229")
    suffix = suffix.replace("APP_BUILD_NUM === 229", "APP_BUILD_NUM === 230")
    print("replaced APP_BUILD_NUM === 229", n229)

    suffix = repl(
        suffix,
        """      const igm = loadCompact("cartoIgmEmbeddedData", true);
      const iim = loadCompact("cartoIimEmbeddedData", true);
      const ukho = loadCompact("cartoUkhoEmbeddedData", true);
      const records = igm.records.concat(iim.records, ukho.records);""",
        """      const igm = loadCompact("cartoIgmEmbeddedData", true);
      const iim = loadCompact("cartoIimEmbeddedData", true);
      const records = igm.records.concat(iim.records);""",
        1,
        "loader",
    )
    suffix = repl(
        suffix,
        """    add("iim_load_count", s1.ok && s1.providerCounts && s1.providerCounts.iim === 180, s1.providerCounts);
    add("ukho_load_count", s1.ok && s1.providerCounts && s1.providerCounts.ukho === 3912, s1.providerCounts);""",
        """    add("iim_load_count", s1.ok && s1.providerCounts && s1.providerCounts.iim === 180, s1.providerCounts);
    add("ukho_not_in_runtime", s1.ok && s1.providerCounts && !s1.providerCounts.ukho, s1.providerCounts);""",
        1,
        "st-ukho-count",
    )
    suffix = repl(
        suffix,
        """    add("ukho_spatial_zero", nord.results.every(function(r){ return r.provider_id !== "ukho"; }) && onlyIim.results.every(function(r){ return r.provider_id !== "ukho"; }));""",
        """    add("ukho_spatial_blocked", nord.results.every(function(r){ return r.provider_id !== "ukho"; }) && mix.results.every(function(r){ return r.provider_id !== "ukho"; }));""",
        1,
        "st-ukho-spatial",
    )
    suffix = repl(
        suffix,
        "add(\"reload_after_clear\", s3.ok && s3.fromCache === false && s3.featureCount === (8204 + 180 + 3912), s3);",
        "add(\"reload_after_clear\", s3.ok && s3.fromCache === false && s3.featureCount === (8204 + 180), s3);",
        1,
        "st-reload",
    )
    suffix = repl(
        suffix,
        '    const extra = " © IIM — indice Interactive Sailing Map. UKHO/ADMIRALTY CAL — metadati, senza impronte.";',
        '    const extra = " © IIM — snapshot Interactive Sailing Map (180 carte osservate, non catalogo completo).";',
        1,
        "legal",
    )

    if "cartoUkhoEmbeddedData" in suffix and START not in suffix:
        raise SystemExit("UKHO tag still in suffix unexpectedly")

    # Rebuild embed: drop UKHO script, keep IIM only
    embed = "\n" + START + "\n" + tag_iim(compact, count) + "\n" + END + "\n"
    if START in suffix:
        pre_e, rest = suffix.split(START, 1)
        _mid, post_e = rest.split(END, 1)
        suffix = pre_e.rstrip("\n") + embed + post_e.lstrip("\n")
    else:
        suffix = embed + suffix

    if "cartoUkhoEmbeddedData" in suffix:
        raise SystemExit("UKHO embed still present after rebuild")

    out = prefix + igm + suffix
    if crlf:
        out = out.replace("\n", "\r\n")
    HTML.write_bytes(out.encode("utf-8"))
    t2 = HTML.read_text(encoding="utf-8").replace("\r\n", "\n")
    _p2, igm2, s2 = split_igm(t2)
    if igm2 != igm:
        raise SystemExit("IGM payload mutated")
    print("wrote", HTML.stat().st_size, "iim", count, "ukho_tag", "cartoUkhoEmbeddedData" in t2)


if __name__ == "__main__":
    main()
