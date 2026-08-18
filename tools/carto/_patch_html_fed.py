#!/usr/bin/env python3
"""Surgical HTML patcher for CARTO IIM/UKHO federation.

Protects #cartoIgmEmbeddedData JSON (never rewritten). Applies prefix/suffix
replacements, then inserts compact IIM/UKHO script tags after the IGM payload.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HTML = ROOT / "coordinate_converter Claude.html"
IIM_COMPACT = ROOT / "data" / "carto" / "iim" / "compact-v1.json"
UKHO_COMPACT = ROOT / "data" / "carto" / "ukho" / "compact-v1.json"

IGM_OPEN = '<script type="application/json" id="cartoIgmEmbeddedData"'
START = "<!-- CARTO-FED-EMBED-START -->"
END = "<!-- CARTO-FED-EMBED-END -->"


def repl(text: str, old: str, new: str, expected: int, label: str) -> str:
    n = text.count(old)
    if n != expected:
        raise SystemExit(f"replace {label}: expected {expected} got {n}")
    return text.replace(old, new)


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


def split_igm(text: str) -> tuple[str, str, str]:
    a = text.find(IGM_OPEN)
    if a < 0:
        raise SystemExit("IGM open tag missing")
    b = text.find("</script>", a)
    if b < 0:
        raise SystemExit("IGM close missing")
    b2 = b + len("</script>")
    return text[:a], text[a:b2], text[b2:]


def main() -> None:
    raise SystemExit(
        "SUPERSEDED: UKHO is NOT OPENED FOR RUNTIME. Use tools/carto/_patch_html_iim_split.py "
        "(IIM snapshot only). Re-running this script would re-embed CAL as a spatial provider."
    )
    raw = HTML.read_bytes()
    crlf = b"\r\n" in raw[:8000]
    text = raw.decode("utf-8").replace("\r\n", "\n")
    prefix, igm, suffix = split_igm(text)
    if "carto-igm-compact-v1" not in igm:
        raise SystemExit("IGM payload missing")

    # --- prefix: panel UI ---
    prefix = repl(
        prefix,
        '<h2 id="cartoIgmPanelTitle" class="app-modal-title" data-i18n="carto.title">Indice cartografico IGM</h2>',
        '<h2 id="cartoIgmPanelTitle" class="app-modal-title" data-i18n="carto.title">Indice cartografico IGM / IIM / UKHO</h2>',
        1,
        "panel-title",
    )
    prefix = repl(
        prefix,
        '<label class="carto-filter-item" data-i18n-tip="carto.series25kautoTip" data-i18n-aria="carto.series25kautoTip"><input type="checkbox" id="cartoIgmFilter25kauto" checked> <span>Serie 25K Automatica</span></label>\n    </fieldset>',
        '<label class="carto-filter-item" data-i18n-tip="carto.series25kautoTip" data-i18n-aria="carto.series25kautoTip"><input type="checkbox" id="cartoIgmFilter25kauto" checked> <span>Serie 25K Automatica</span></label>\n'
        '      <label class="carto-filter-item" data-i18n-tip="carto.seriesIimTip" data-i18n-aria="carto.seriesIimTip"><input type="checkbox" id="cartoIimFilterPaper" checked> <span data-i18n="carto.seriesIim">IIM carte nautiche</span></label>\n'
        "    </fieldset>\n"
        '    <p id="cartoUkhoMetaHint" class="hint carto-ukho-hint" data-i18n="carto.ukhoNote">UKHO/ADMIRALTY: catalogo metadati CAL embedded, senza impronte — escluso dalla ricerca spaziale.</p>',
        1,
        "filters",
    )

    # --- suffix: i18n IT + engine + build ---
    suffix = repl(
        suffix,
        '"carto.title":"Indice cartografico IGM"',
        '"carto.title":"Indice cartografico IGM / IIM / UKHO"',
        1,
        "i18n-title",
    )
    suffix = repl(
        suffix,
        '"carto.series25kautoTip":"Mostra o nasconde la Serie 25K Automatica nei risultati e sulla mappa",',
        '"carto.series25kautoTip":"Mostra o nasconde la Serie 25K Automatica nei risultati e sulla mappa",\n'
        '    "carto.seriesIim":"IIM carte nautiche",\n'
        '    "carto.seriesIimTip":"Mostra o nasconde le carte nautiche IIM nei risultati e sulla mappa",\n'
        '    "carto.ukhoNote":"UKHO/ADMIRALTY: catalogo metadati CAL embedded, senza impronte — escluso dalla ricerca spaziale.",',
        1,
        "i18n-new",
    )
    suffix = repl(
        suffix,
        'const APP_BUILD_ID = "OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6";\n'
        'const APP_BUILD_DETAIL = "Mobile Percorso chips wrap (FIX6).";\n'
        "/** Monotonic runtime build counter — increment on each runtime patch (not persisted). */\n"
        "const APP_BUILD_NUM = 228;",
        'const APP_BUILD_ID = "CARTO-IIM-UKHO-PROVIDERS-A";\n'
        'const APP_BUILD_DETAIL = "Federazione IIM/UKHO nell\'indice CARTO (IIM impronte; UKHO metadati CAL).";\n'
        "/** Monotonic runtime build counter — increment on each runtime patch (not persisted). */\n"
        "const APP_BUILD_NUM = 229;",
        1,
        "build-const",
    )
    n_fix6 = suffix.count("OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6")
    if n_fix6 < 1:
        raise SystemExit("no remaining FIX6 pins in suffix")
    suffix = suffix.replace("OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6", "CARTO-IIM-UKHO-PROVIDERS-A")
    print("replaced FIX6 pins", n_fix6)
    n228 = suffix.count("APP_BUILD_NUM === 228")
    suffix = suffix.replace("APP_BUILD_NUM === 228", "APP_BUILD_NUM === 229")
    print("replaced APP_BUILD_NUM === 228", n228)

    suffix = repl(
        suffix,
        """  function cartoIndexExpandRecord(rec){
    const gtype = (rec.g && rec.g.t === "M") ? "MultiPolygon" : "Polygon";
    return {
      record_id: rec.id,
      provider_id: rec.pid || "igm",
      series_id: rec.sid,
      series_name: rec.sn,
      chart_id: rec.cid,
      title: rec.t == null ? null : rec.t,
      scale_denominator: rec.sc == null ? null : rec.sc,
      edition: rec.ed == null ? null : rec.ed,
      edition_date: rec.edt == null ? null : rec.edt,
      bbox: Array.isArray(rec.b) ? rec.b.slice() : null,
      geometry: { type: gtype, coordinates: rec.g && rec.g.c },
      rights_status: rec.rs || "authorized-noncommercial-redistribution",
      source_file: rec.src || null
    };
  }""",
        """  function cartoIndexExpandRecord(rec){
    const hasG = !!(rec && rec.g && rec.g.c);
    const gtype = (hasG && rec.g.t === "M") ? "MultiPolygon" : "Polygon";
    return {
      record_id: rec.id,
      provider_id: rec.pid || "igm",
      series_id: rec.sid,
      series_name: rec.sn,
      chart_id: rec.cid,
      international_id: rec.iid == null ? null : rec.iid,
      title: rec.t == null ? null : rec.t,
      scale_denominator: rec.sc == null ? null : rec.sc,
      edition: rec.ed == null ? null : rec.ed,
      edition_date: rec.edt == null ? null : rec.edt,
      catalog_status: rec.cs || (hasG ? "in_imported_catalog" : "metadata_only"),
      chart_type: rec.ct == null ? null : rec.ct,
      bbox: Array.isArray(rec.b) ? rec.b.slice() : null,
      geometry: hasG ? { type: gtype, coordinates: rec.g.c } : null,
      rights_status: rec.rs || "authorized-noncommercial-redistribution",
      source_file: rec.src || null
    };
  }""",
        1,
        "expandRecord",
    )

    suffix = repl(
        suffix,
        """    try {
      const el = document.getElementById("cartoIgmEmbeddedData");
      if (!el) throw new Error("carto_embedded_missing");
      const raw = el.textContent || "";
      const obj = JSON.parse(raw);
      if (!obj || obj.schema !== "carto-igm-compact-v1" || !Array.isArray(obj.records)) {
        throw new Error("carto_embedded_schema");
      }
      {
        const declared = (obj.feature_count != null) ? Number(obj.feature_count)
          : Number(el.getAttribute("data-feature-count"));
        if (Number.isFinite(declared) && declared > 0 && obj.records.length !== declared) {
          throw new Error("carto_embedded_count_" + obj.records.length + "_vs_" + declared);
        }
      }
      const records = obj.records.map(cartoIndexExpandRecord);
      records.sort(function(a, b){
        return String(a.record_id).localeCompare(String(b.record_id));
      });
      t.records = records;
      {
        const byId = new Map();
        for (let i = 0; i < records.length; i++){
          const r = records[i];
          if (r && r.record_id != null) byId.set(String(r.record_id), r);
        }
        t.byRecordId = byId;
      }
      t.loadedAt = Date.now();
      t.error = null;
      t.payloadSha256 = el.getAttribute("data-sha256") || null;
      t.featureCount = records.length;
      t.manifest = Object.freeze({
        schema: obj.schema,
        schema_version: obj.schema_version || null,
        attribution: obj.attribution || CARTO_IGM_ATTRIBUTION,
        authorization_reference: obj.authorization_reference || CARTO_IGM_AUTH_REF,
        authorization_date: obj.authorization_date || "2024-05-24",
        rights_status: obj.rights_status || "authorized-noncommercial-redistribution",
        feature_count: records.length,
        series_counts: obj.series_counts || null
      });
      t.status = "ready";
      return { ok: true, fromCache: false, featureCount: records.length };""",
        """    try {
      function loadCompact(elId, required){
        const el = document.getElementById(elId);
        if (!el) {
          if (required) throw new Error("carto_embedded_missing_" + elId);
          return { records: [], el: null, obj: null };
        }
        const raw = el.textContent || "";
        const obj = JSON.parse(raw);
        if (!obj || obj.schema !== "carto-igm-compact-v1" || !Array.isArray(obj.records)) {
          throw new Error("carto_embedded_schema_" + elId);
        }
        const declared = (obj.feature_count != null) ? Number(obj.feature_count)
          : Number(el.getAttribute("data-feature-count"));
        if (Number.isFinite(declared) && declared > 0 && obj.records.length !== declared) {
          throw new Error("carto_embedded_count_" + elId + "_" + obj.records.length + "_vs_" + declared);
        }
        return { records: obj.records.map(cartoIndexExpandRecord), el: el, obj: obj };
      }
      const igm = loadCompact("cartoIgmEmbeddedData", true);
      const iim = loadCompact("cartoIimEmbeddedData", true);
      const ukho = loadCompact("cartoUkhoEmbeddedData", true);
      const records = igm.records.concat(iim.records, ukho.records);
      records.sort(function(a, b){
        return String(a.record_id).localeCompare(String(b.record_id));
      });
      t.records = records;
      {
        const byId = new Map();
        for (let i = 0; i < records.length; i++){
          const r = records[i];
          if (r && r.record_id != null) byId.set(String(r.record_id), r);
        }
        t.byRecordId = byId;
      }
      t.loadedAt = Date.now();
      t.error = null;
      t.payloadSha256 = igm.el.getAttribute("data-sha256") || null;
      t.featureCount = records.length;
      t.manifest = Object.freeze({
        schema: igm.obj.schema,
        schema_version: igm.obj.schema_version || null,
        attribution: igm.obj.attribution || CARTO_IGM_ATTRIBUTION,
        authorization_reference: igm.obj.authorization_reference || CARTO_IGM_AUTH_REF,
        authorization_date: igm.obj.authorization_date || "2024-05-24",
        rights_status: igm.obj.rights_status || "authorized-noncommercial-redistribution",
        feature_count: records.length,
        series_counts: igm.obj.series_counts || null
      });
      t.status = "ready";
      return { ok: true, fromCache: false, featureCount: records.length };""",
        1,
        "ensureLoaded",
    )

    suffix = repl(
        suffix,
        """    const counts = {};
    for (let i = 0; i < t.records.length; i++) {
      const sid = t.records[i].series_id;
      if (sid == null) continue;
      const k = String(sid);
      counts[k] = (counts[k] || 0) + 1;
    }
    return Object.freeze({
      ok: true,
      status: t.status,
      featureCount: t.records.length,
      seriesCounts: Object.freeze(counts),""",
        """    const counts = {};
    const providerCounts = {};
    for (let i = 0; i < t.records.length; i++) {
      const sid = t.records[i].series_id;
      if (sid != null) {
        const k = String(sid);
        counts[k] = (counts[k] || 0) + 1;
      }
      const pid = String(t.records[i].provider_id || "igm");
      providerCounts[pid] = (providerCounts[pid] || 0) + 1;
    }
    return Object.freeze({
      ok: true,
      status: t.status,
      featureCount: t.records.length,
      seriesCounts: Object.freeze(counts),
      providerCounts: Object.freeze(providerCounts),""",
        1,
        "stats-providers",
    )

    suffix = repl(
        suffix,
        """    const seriesFilter = Array.isArray(opts.seriesIds) ? opts.seriesIds.map(String) : null;
    const limit = (opts.limit != null && Number.isFinite(Number(opts.limit)) && Number(opts.limit) > 0)
      ? Math.floor(Number(opts.limit)) : null;
    const precise = opts.preciseIntersection !== false;""",
        """    const seriesFilter = Array.isArray(opts.seriesIds) ? opts.seriesIds.map(String) : null;
    const providerFilter = Array.isArray(opts.providerIds) ? opts.providerIds.map(String) : null;
    const limit = (opts.limit != null && Number.isFinite(Number(opts.limit)) && Number(opts.limit) > 0)
      ? Math.floor(Number(opts.limit)) : null;
    const precise = opts.preciseIntersection !== false;""",
        1,
        "search-opts",
    )

    suffix = repl(
        suffix,
        """    for (let i = 0; i < t.records.length; i++) {
      const rec = t.records[i];
      if (seriesFilter && seriesFilter.indexOf(String(rec.series_id)) < 0) continue;
      const fb = rec.bbox;""",
        """    for (let i = 0; i < t.records.length; i++) {
      const rec = t.records[i];
      if (!rec || rec.catalog_status === "metadata_only" || !rec.geometry || !rec.bbox) continue;
      if (providerFilter && providerFilter.indexOf(String(rec.provider_id)) < 0) continue;
      if (seriesFilter && seriesFilter.indexOf(String(rec.series_id)) < 0) continue;
      const fb = rec.bbox;""",
        1,
        "search-skip",
    )

    suffix = repl(
        suffix,
        """    add("load_count", s1.ok && s1.featureCount === 8204, s1.featureCount);
    add("series_50", s1.ok && s1.seriesCounts && s1.seriesCounts["50"] === 633, s1.seriesCounts);
    add("series_100v", s1.ok && s1.seriesCounts && s1.seriesCounts["100v"] === 278, s1.seriesCounts);
    add("series_25", s1.ok && s1.seriesCounts && s1.seriesCounts["25"] === 2266, s1.seriesCounts);
    add("series_25v", s1.ok && s1.seriesCounts && s1.seriesCounts["25v"] === 3549, s1.seriesCounts);
    add("series_25kauto", s1.ok && s1.seriesCounts && s1.seriesCounts["25kauto"] === 1478, s1.seriesCounts);
    const nord = cartoIndexSearchBbox({ west: 7.5, south: 44.5, east: 10.5, north: 46.5 });
    add("nord_nonzero", nord.total > 0, nord.total);
    const fuori = cartoIndexSearchBbox({ west: -10, south: 50, east: -5, north: 55 });
    add("fuori_zero", fuori.total === 0, fuori.total);
    const only50 = cartoIndexSearchBbox({ west: 7.5, south: 44.5, east: 10.5, north: 46.5 }, { seriesIds: ["50"] });
    add("filter_50", only50.results.every(function(r){ return r.series_id === "50"; }), only50.total);
    const bad = cartoIndexSearchBbox({ west: 1, south: 10, east: 2, north: 5 });
    add("bbox_invalid", !!bad.error, bad.error);
    const s2 = cartoIndexEnsureLoaded();
    add("second_load_cache", s2.ok && s2.fromCache === true, s2);
    cartoIndexClearTransient();
    const s3 = cartoIndexEnsureLoaded();
    add("reload_after_clear", s3.ok && s3.fromCache === false && s3.featureCount === 8204, s3);""",
        """    const wp0 = (typeof state !== "undefined" && Array.isArray(state.mapWaypoints)) ? state.mapWaypoints.length : 0;
    const gp0 = (typeof state !== "undefined" && Array.isArray(state.gisPolygons)) ? state.gisPolygons.length : 0;
    add("load_count", s1.ok && s1.providerCounts && s1.providerCounts.igm === 8204, s1.providerCounts);
    add("iim_load_count", s1.ok && s1.providerCounts && s1.providerCounts.iim === 180, s1.providerCounts);
    add("ukho_load_count", s1.ok && s1.providerCounts && s1.providerCounts.ukho === 3912, s1.providerCounts);
    add("series_50", s1.ok && s1.seriesCounts && s1.seriesCounts["50"] === 633, s1.seriesCounts);
    add("series_100v", s1.ok && s1.seriesCounts && s1.seriesCounts["100v"] === 278, s1.seriesCounts);
    add("series_25", s1.ok && s1.seriesCounts && s1.seriesCounts["25"] === 2266, s1.seriesCounts);
    add("series_25v", s1.ok && s1.seriesCounts && s1.seriesCounts["25v"] === 3549, s1.seriesCounts);
    add("series_25kauto", s1.ok && s1.seriesCounts && s1.seriesCounts["25kauto"] === 1478, s1.seriesCounts);
    const nord = cartoIndexSearchBbox({ west: 7.5, south: 44.5, east: 10.5, north: 46.5 });
    add("nord_nonzero", nord.total > 0, nord.total);
    const fuori = cartoIndexSearchBbox({ west: -10, south: 50, east: -5, north: 55 });
    add("fuori_zero", fuori.total === 0, fuori.total);
    const only50 = cartoIndexSearchBbox({ west: 7.5, south: 44.5, east: 10.5, north: 46.5 }, { seriesIds: ["50"] });
    add("filter_50", only50.results.every(function(r){ return r.series_id === "50"; }), only50.total);
    const onlyIim = cartoIndexSearchBbox({ west: 9.82, south: 44.09, east: 9.84, north: 44.11 }, { seriesIds: ["paper"] });
    add("filter_iim", onlyIim.total > 0 && onlyIim.results.every(function(r){ return r.provider_id === "iim"; }), onlyIim.total);
    const mix = cartoIndexSearchBbox({ west: 9.82, south: 44.09, east: 9.84, north: 44.11 }, { seriesIds: ["50","100v","25","25v","25kauto","paper"] });
    const mixP = {};
    for (let mi = 0; mi < mix.results.length; mi++) mixP[mix.results[mi].provider_id] = true;
    add("mixed_igm_iim", !!mixP.igm && !!mixP.iim && !mixP.ukho, mixP);
    add("ukho_spatial_zero", nord.results.every(function(r){ return r.provider_id !== "ukho"; }) && onlyIim.results.every(function(r){ return r.provider_id !== "ukho"; }));
    const bad = cartoIndexSearchBbox({ west: 1, south: 10, east: 2, north: 5 });
    add("bbox_invalid", !!bad.error, bad.error);
    const s2 = cartoIndexEnsureLoaded();
    add("second_load_cache", s2.ok && s2.fromCache === true, s2);
    cartoIndexClearTransient();
    const s3 = cartoIndexEnsureLoaded();
    add("reload_after_clear", s3.ok && s3.fromCache === false && s3.featureCount === (8204 + 180 + 3912), s3);
    const fo = (typeof state !== "undefined") ? !!state.forceOffline : false;
    const os = (typeof state !== "undefined") ? !!state.opsecStrict : false;
    try {
      if (typeof state !== "undefined") state.forceOffline = true;
      add("forceOffline_blocks_refresh", cartoTryProviderRefresh().blocked === true);
      if (typeof state !== "undefined") { state.forceOffline = false; state.opsecStrict = true; }
      add("opsecStrict_blocks_refresh", cartoTryProviderRefresh().blocked === true);
    } finally {
      try { if (typeof state !== "undefined") { state.forceOffline = fo; state.opsecStrict = os; } } catch(_){}
    }
    add("no_auto_network", typeof cartoTryProviderRefresh === "function" && cartoTryProviderRefresh().blocked === true);
    add("no_wp_mut", (typeof state !== "undefined" && Array.isArray(state.mapWaypoints)) ? state.mapWaypoints.length === wp0 : true);
    add("no_poly_mut", (typeof state !== "undefined" && Array.isArray(state.gisPolygons)) ? state.gisPolygons.length === gp0 : true);""",
        1,
        "selftest",
    )

    suffix = repl(
        suffix,
        """    Object.freeze(api);
    window.GOICartoIndex = api;
  } catch (_){ /* ignore */ }

  // Attach to global scope used by app (functions in same script)
  window.cartoIndexEnsureLoaded = cartoIndexEnsureLoaded;""",
        """    Object.freeze(api);
    window.GOICartoIndex = api;
  } catch (_){ /* ignore */ }

  function cartoTryProviderRefresh(){
    try {
      if (typeof state !== "undefined" && (state.forceOffline || state.opsecStrict)) {
        return { ok: false, blocked: true, reason: "opsec_or_offline" };
      }
    } catch(_){}
    return { ok: false, blocked: true, reason: "refresh_not_implemented" };
  }
  window.cartoTryProviderRefresh = cartoTryProviderRefresh;

  // Attach to global scope used by app (functions in same script)
  window.cartoIndexEnsureLoaded = cartoIndexEnsureLoaded;""",
        1,
        "refresh-stub",
    )

    suffix = repl(
        suffix,
        """    "25kauto": {
      fillColor: "#16a34a",
      fillOpacity: 0.14,
      fillOpacitySelected: 0.22,
      strokeColor: "#15803d",
      strokeOpacity: 0.92,
      labelColor: "#14532d",
      labelHalo: "#ffffff"
    }
  };""",
        """    "25kauto": {
      fillColor: "#16a34a",
      fillOpacity: 0.14,
      fillOpacitySelected: 0.22,
      strokeColor: "#15803d",
      strokeOpacity: 0.92,
      labelColor: "#14532d",
      labelHalo: "#ffffff"
    },
    "paper": {
      fillColor: "#0f766e",
      fillOpacity: 0.14,
      fillOpacitySelected: 0.22,
      strokeColor: "#0f766e",
      strokeOpacity: 0.92,
      labelColor: "#134e4a",
      labelHalo: "#ffffff"
    }
  };""",
        1,
        "visual-paper",
    )

    suffix = repl(
        suffix,
        'selectedSeries: ["50", "100v", "25", "25v", "25kauto"],',
        'selectedSeries: ["50", "100v", "25", "25v", "25kauto", "paper"],',
        1,
        "default-series",
    )
    suffix = repl(
        suffix,
        """      if (!Object.prototype.hasOwnProperty.call(state._cartoUi, "_areaPickMinimizedByPicker"))
        state._cartoUi._areaPickMinimizedByPicker = false;
    }""",
        """      if (!Object.prototype.hasOwnProperty.call(state._cartoUi, "_areaPickMinimizedByPicker"))
        state._cartoUi._areaPickMinimizedByPicker = false;
      if (Array.isArray(state._cartoUi.selectedSeries) && state._cartoUi.selectedSeries.indexOf("paper") < 0)
        state._cartoUi.selectedSeries.push("paper");
    }""",
        1,
        "additive-paper",
    )

    suffix = repl(
        suffix,
        """      ["cartoIgmFilter50", "50"],
      ["cartoIgmFilter100v", "100v"],
      ["cartoIgmFilter25", "25"],
      ["cartoIgmFilter25v", "25v"],
      ["cartoIgmFilter25kauto", "25kauto"]
    ];""",
        """      ["cartoIgmFilter50", "50"],
      ["cartoIgmFilter100v", "100v"],
      ["cartoIgmFilter25", "25"],
      ["cartoIgmFilter25v", "25v"],
      ["cartoIgmFilter25kauto", "25kauto"],
      ["cartoIimFilterPaper", "paper"]
    ];""",
        2,
        "filter-pairs",
    )

    suffix = repl(
        suffix,
        '    ["cartoIgmFilter50","cartoIgmFilter100v","cartoIgmFilter25","cartoIgmFilter25v","cartoIgmFilter25kauto"].forEach(function(fid){',
        '    ["cartoIgmFilter50","cartoIgmFilter100v","cartoIgmFilter25","cartoIgmFilter25v","cartoIgmFilter25kauto","cartoIimFilterPaper"].forEach(function(fid){',
        1,
        "filter-bind",
    )

    suffix = repl(
        suffix,
        """    const series = item.series_id || "—";
    const chart = item.chart_id != null ? String(item.chart_id) : cartoUiT("carto.notAvailable");""",
        """    const pid = String((item && item.provider_id) || "igm").toUpperCase();
    const series = pid + " · " + (item.series_id || "—");
    const chart = item.chart_id != null ? String(item.chart_id) : cartoUiT("carto.notAvailable");""",
        1,
        "row-provider",
    )

    suffix = repl(
        suffix,
        """    const txt = (typeof CARTO_IGM_ATTRIBUTION === "string" && CARTO_IGM_ATTRIBUTION)
      || (window.GOICartoIndex && window.GOICartoIndex.attribution)
      || "";
    el.textContent = txt;""",
        """    const igm = (typeof CARTO_IGM_ATTRIBUTION === "string" && CARTO_IGM_ATTRIBUTION)
      || (window.GOICartoIndex && window.GOICartoIndex.attribution)
      || "";
    const extra = " © IIM — indice Interactive Sailing Map. UKHO/ADMIRALTY CAL — metadati, senza impronte.";
    el.textContent = String(igm) + extra;""",
        1,
        "legal",
    )

    iim = IIM_COMPACT.read_text(encoding="utf-8").strip()
    ukho = UKHO_COMPACT.read_text(encoding="utf-8").strip()
    iim_n = json.loads(iim)["feature_count"]
    ukho_n = json.loads(ukho)["feature_count"]
    embed = (
        "\n"
        + START
        + "\n"
        + tag_for("cartoIimEmbeddedData", iim, "iim", iim_n)
        + "\n"
        + tag_for("cartoUkhoEmbeddedData", ukho, "ukho", ukho_n)
        + "\n"
        + END
        + "\n"
    )
    if START in suffix:
        raise SystemExit("embed markers already in suffix")

    out = prefix + igm + embed + suffix
    if crlf:
        out = out.replace("\n", "\r\n")
    HTML.write_bytes(out.encode("utf-8"))
    print("wrote", HTML.stat().st_size, "iim", iim_n, "ukho", ukho_n)
    # integrity
    t2 = HTML.read_text(encoding="utf-8")
    p2, igm2, s2 = split_igm(t2)
    if igm2 != igm:
        raise SystemExit("IGM payload mutated")
    if "cartoIimEmbeddedData" not in t2 or "cartoUkhoEmbeddedData" not in t2:
        raise SystemExit("fed tags missing")
    if "CARTO-IIM-UKHO-PROVIDERS-A" not in t2:
        raise SystemExit("build id missing")
    print("IGM payload intact, fed tags present")


if __name__ == "__main__":
    main()
