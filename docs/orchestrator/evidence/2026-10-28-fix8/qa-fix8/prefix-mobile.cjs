// Cross-entry equivalence matrix. Expected values are literals/arithmetics, never app output.
// Usage: node matrix.cjs <candidate.html> <out.json>
const fs = require("fs");
const http = require("http");
const path = require("path");
const { chromium } = require("C:/goi-pw-probe/node_modules/playwright");

const candPath = process.argv[2];
const outPath = process.argv[3];
const DMS_LAT = 44 + 6 / 60;
const DMS_LON = 9 + 49 / 60;
const S1 = 1 / 3600;

// [id, input, kind, lat, lon, tol, support]
// kind: valid | invalid | place | consistent (documented ambiguity: all entries must agree)
// support: "ll" lat/lon entries; "grid" = MGRS/UTM (search/detect/editors only)
const CASES = [
  ["eu-semicolon", "45,5; 9,2", "valid", 45.5, 9.2],
  ["eu-space", "45,5 9,2", "valid", 45.5, 9.2],
  ["eu-tight", "45,5;9,2", "valid", 45.5, 9.2],
  ["eu-neg", "-45,5; 9,2", "valid", -45.5, 9.2],
  ["eu-plus", "+45,5; +9,2", "valid", 45.5, 9.2],
  ["dot-comma", "45.5, 9.2", "valid", 45.5, 9.2],
  ["dot-space", "45.5 9.2", "valid", 45.5, 9.2],
  ["int-pair", "45, 5", "valid", 45, 5],
  ["isolated-45,5", "45,5", "consistent"],
  ["eu-hemi-ambiguous", "45,5N 9,2E", "consistent"],
  ["n-suffix", "44.1N 9.8E", "valid", 44.1, 9.8],
  ["s-suffix", "44.1S 9.8E", "valid", -44.1, 9.8],
  ["neg-s", "-44.1S 9.8E", "valid", -44.1, 9.8],
  ["plus-n", "+44.1N 9.8E", "valid", 44.1, 9.8],
  ["neg-w", "44.1N -9.8W", "valid", 44.1, -9.8],
  ["plus-e", "44.1N +9.8E", "valid", 44.1, 9.8],
  ["prefix-hemi", "N44.1 E9.8", "valid", 44.1, 9.8],
  ["lon-first", "E9.8 N44.1", "valid", 44.1, 9.8],
  ["dd-plus", "DD +44.1, +9.8", "valid", 44.1, 9.8],
  ["dms-plus", "DMS +44 6 0 N +9 49 0 E", "valid", DMS_LAT, DMS_LON],
  ["dms-neg0", "DMS -0 0 1 9 0 0", "valid", -S1, 9],
  ["dms-neg0-s", "DMS -0 0 1 S 9 0 0 E", "valid", -S1, 9],
  ["plain", "44.1, 9.8", "valid", 44.1, 9.8],
  ["mgrs", "30nul8431881439", "valid", 5.259444, -4.043909, 1e-4, "grid"],
  ["utm", "33t 291952 4640699", "valid", 41.8908, 12.4922, 1e-3, "grid"],
  ["neg-n", "-44.1N 9.8E", "invalid"],
  ["plus-s", "+44.1S 9.8E", "invalid"],
  ["n-neg", "N-44.1 E9.8", "invalid"],
  ["s-plus", "S+44.1 E9.8", "invalid"],
  ["e-neg", "44.1N -9.8E", "invalid"],
  ["w-plus", "44.1N +9.8W", "invalid"],
  ["neg0-n", "DMS -0 0 1 N 9 0 0 E", "invalid"],
  ["junk", "44\u00b0 foo1 9\u00b0 bar2", "invalid"],
  ["address", "Via 20 Settembre 12", "place"],
  ["dd-junk", "DD 44foo 9bar", "invalid"],
  ["conflict", "44.1 N S", "invalid"],
  ["neg-min", "DMS 44 -6 0 N 9 49 0 E", "invalid"],
  ["mgrs-bad", "3 2t hu 12589 15323", "invalid"]
];

CASES.push(["dd-wrong-arity", "DD 44 6 9 49", "invalid"], ["ddm-wrong-arity", "DDM 44.1 9.8", "invalid"], ["dms-wrong-arity", "DMS 44.1 9.8", "invalid"]); CASES.push(["dd-valid-prefix","DD 44.1 9.8","valid",44.1,9.8],["ddm-valid-prefix","DDM 44 6 N 9 48 E","valid",44.1,9.8],["dms-valid-prefix","DMS 44 6 0 N 9 48 0 E","valid",44.1,9.8]); const UI_IDS = ["dd-wrong-arity", "ddm-wrong-arity", "dms-wrong-arity", "dd-valid-prefix", "ddm-valid-prefix", "dms-valid-prefix"];

function near(p, lat, lon, tol){
  return !!p && Number.isFinite(p.lat) && Number.isFinite(p.lon) && Math.abs(p.lat - lat) <= tol && Math.abs(p.lon - lon) <= tol;
}

(async () => {
  const bytes = fs.readFileSync(candPath);
  const server = http.createServer((req, res) => { res.setHeader("Content-Type", "text/html; charset=utf-8"); res.end(bytes); });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  let browser;
  try {
    browser = await chromium.launch({ executablePath: "C:/Users/Utente/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe", headless: true });
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const net = [];
    await ctx.route("**/*", async (route) => {
      const u = route.request().url();
      if (u.startsWith("http://127.0.0.1:")) return route.continue();
      if (u.includes("nominatim")) {
        const p = new URL(u);
        net.push({ phase: ctx._phase || "", path: p.pathname, q: p.searchParams.get("q") });
        return route.fulfill({ contentType: "application/json", body: p.pathname.includes("search") ? "[]" : "{}" });
      }
      net.push({ phase: ctx._phase || "", other: u.split("/")[2] });
      return route.abort();
    });
    const page = await ctx.newPage();
    const pageErrors = [];
    page.on("pageerror", (e) => pageErrors.push(e.message));
    await page.goto("http://127.0.0.1:" + server.address().port + "/", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => typeof parseFreeTextLatLon === "function" && typeof routingSearchTryParseCoords === "function");

    // --- helper layer: every consumer of the shared parser ---
    const helper = await page.evaluate((cases) => {
      const ll = (fn) => {
        try {
          const x = fn();
          if (!x) return { none: true };
          if (x.ok === false) return { error: x.key || "not-ok" };
          return { lat: x.lat, lon: x.lon };
        } catch (e) { return { error: (e && (e.key || e.i18nKey)) || String(e && e.message || e).slice(0, 60) }; }
      };
      return cases.map(([id, q]) => {
        const s = classifyGeoSearchInput(q);
        return {
          id, q,
          search: s.kind === "coord_valid" ? { kind: s.kind, lat: s.det.lat, lon: s.det.lon } : { kind: s.kind },
          free: ll(() => parseFreeTextLatLon(q)),
          detect: ll(() => autoDetect(q)),
          routing: ll(() => routingSearchTryParseCoords(q)),
          polyInput: ll(() => polygonParseVertexCoordInputText(q)),
          polyDms: ll(() => polygonParseVertexCoordByFormat("dms", "", "", q)),
          wpEditor: ll(() => parseWaypointEditorCoordText(q))
        };
      });
    }, CASES);

    const rows = [];
    for (const [id, q, kind, lat, lon, tol0, support] of CASES) {
      const h = helper.find((x) => x.id === id);
      const tol = tol0 || 1e-9;
      const grid = support === "grid";
      const entries = {};
      const llEntries = ["free", "routing", "polyDms"];
      const anyEntries = ["detect", "polyInput", "wpEditor"];
      const isOk = (r) => r && Number.isFinite(r.lat);
      // polygon editor stores GIS coordinates rounded to 1e-7 (gisSanitizeCoordinate)
      const tolFor = (k) => (k === "polyInput" || k === "polyDms") ? Math.max(tol, 5e-8) : tol;
      if (kind === "valid") {
        entries.search = h.search.kind === "coord_valid" && near(h.search, lat, lon, tol);
        for (const k of anyEntries) entries[k] = near(h[k], lat, lon, tolFor(k));
        for (const k of llEntries) entries[k] = grid ? !isOk(h[k]) : near(h[k], lat, lon, tolFor(k));
      } else if (kind === "invalid" || kind === "place") {
        entries.search = kind === "place" ? h.search.kind === "place_text" : h.search.kind === "coord_invalid";
        for (const k of anyEntries.concat(llEntries)) entries[k] = !isOk(h[k]);
      } else {
        const ref = h.free;
        const same = (k) => (isOk(ref) && near(h[k], ref.lat, ref.lon, Math.max(1e-9, tolFor(k)))) || (!isOk(ref) && !isOk(h[k]));
        entries.search = isOk(ref) ? (h.search.kind === "coord_valid" && near(h.search, ref.lat, ref.lon, 1e-9)) : h.search.kind !== "coord_valid";
        for (const k of ["detect", "routing", "polyInput", "polyDms", "wpEditor"]) entries[k] = same(k);
      }
      const pass = Object.values(entries).every(Boolean);
      rows.push({ id, q, kind, expected: kind === "valid" ? { lat, lon } : null, pass, entries, observed: h });
    }

    const clickMethods = {};
    const clickReal = async (sel) => {
      try { await page.locator(sel).click({ timeout: 2500 }); clickMethods[sel] = clickMethods[sel] || "mouse"; }
      catch (_) { await page.locator(sel).focus(); await page.keyboard.press("Enter"); clickMethods[sel] = "keyboard-Enter-on-focused-button"; }
    };
    // --- real interactions ---
    const ui = [];
    // Cerca
    await page.evaluate(() => { state.geocodeEnabled = true; state.opsecStrict = false; state.forceOffline = false; document.getElementById("geocodeCard")._refreshGeoCard(); });
    await page.locator('#appTopbar [data-tab="geocoding"]').click();
    for (const id of UI_IDS) {
      const c = CASES.find((x) => x[0] === id);
      ctx._phase = "cerca:sentinel";
      await page.locator("#geoInput").fill("10, 20");
      await page.locator("#geoInput").press("Enter");
      await page.waitForTimeout(250);
      ctx._phase = "cerca:" + id;
      const n0 = net.length;
      const before = await page.evaluate(() => ({ point: state.lastPoint, center: state.viewCenter, wp: state.mapWaypoints.length }));
      const sentinelOk = !!before.point && before.point.lat === 10 && before.point.lon === 20;
      await page.locator("#geoInput").fill(c[1]);
      await page.locator("#geoInput").press("Enter");
      await page.waitForTimeout(450);
      const after = await page.evaluate(() => ({ point: state.lastPoint, center: state.viewCenter, wp: state.mapWaypoints.length, fb: document.getElementById("geoSearchFeedback").textContent }));
      const reqs = net.slice(n0).filter((r) => r.path);
      let pass;
      if (c[2] === "valid") pass = near(after.point, c[3], c[4], 1e-9) && near(after.center, c[3], c[4], 1e-9) && !reqs.length;
      else if (c[2] === "place") pass = JSON.stringify(before.point) === JSON.stringify(after.point) && reqs.length === 1 && reqs[0].path.includes("search");
      else pass = JSON.stringify(before.point) === JSON.stringify(after.point) && JSON.stringify(before.center) === JSON.stringify(after.center) && !reqs.length;
      pass = pass && after.wp === before.wp && sentinelOk;
      ui.push({ entry: "cerca", id, q: c[1], pass, sentinelOk, after: { point: after.point, fb: after.fb.slice(0, 50) }, reqs });
    }
    await page.keyboard.press("Escape");

    // Converti (testo libero) + Incolla
    await page.locator("#topbarConvertBtn").click();
    await page.locator("#convertModal").waitFor({ state: "visible" });
    await page.evaluate(() => { const d = document.getElementById("manualInputDetails"); if (d) d.open = true; });
    await page.evaluate(() => document.querySelector('.subtab[data-sub="free"]').click());
    await page.evaluate(() => { window.__confirms = []; window.confirm = (m) => { window.__confirms.push(String(m)); return false; }; });
    for (const id of UI_IDS) {
      const c = CASES.find((x) => x[0] === id);
      for (const entry of ["converti", "incolla"]) {
        ctx._phase = entry + ":sentinel";
        if (entry === "converti") { await page.locator("#free-text").fill("10, 20"); await clickReal("#btnConvert"); }
        else { await page.locator("#pasteInput").fill("10, 20"); await clickReal("#pasteDetect"); }
        await page.waitForTimeout(150);
        ctx._phase = entry + ":" + id;
        const n0 = net.length;
        const pre = await page.evaluate(() => state.lastResult && { lat: state.lastResult.lat, lon: state.lastResult.lon });
        const sentinelOk = !!pre && pre.lat === 10 && pre.lon === 20;
        const conf0 = await page.evaluate(() => window.__confirms.length);
        if (entry === "converti") {
          await page.locator("#free-text").fill(c[1]);
          await clickReal("#btnConvert");
        } else {
          await page.locator("#pasteInput").fill(c[1]);
          await clickReal("#pasteDetect");
        }
        await page.waitForTimeout(200);
        const after = await page.evaluate(() => ({
          result: state.lastResult && { lat: state.lastResult.lat, lon: state.lastResult.lon },
          err: (document.getElementById("errorBox").hidden ? "" : document.getElementById("errorBox").textContent.trim()).slice(0, 60),
          paste: document.getElementById("pasteStatus").textContent.slice(0, 60),
          confirms: window.__confirms.length,
          wp: state.mapWaypoints.length
        }));
        const searchReqs = net.slice(n0).filter((r) => r.path && r.path.includes("search"));
        const asked = after.confirms - conf0;
        let pass;
        if (c[2] === "valid") pass = near(after.result, c[3], c[4], 1e-9);
        else {
          const unchanged = JSON.stringify(pre) === JSON.stringify(after.result);
          pass = unchanged && !searchReqs.length;
          if (entry === "incolla") pass = pass && (c[2] === "place" ? asked === 1 : asked === 0);
          if (entry === "converti") pass = pass && !!after.err;
        }
        pass = pass && after.wp === 0 && sentinelOk;
        ui.push({ entry, id, q: c[1], pass, sentinelOk, after, asked, searchReqs: searchReqs.length });
      }
    }
    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);

    // Routing — point label + Enter
    ctx._phase = "routing-open";
    await page.evaluate(() => { const d = document.getElementById("convertModal"); if (d && d.open && typeof closeConvertModal === "function") closeConvertModal(); });
    await page.evaluate(() => openTrackModal());
    await page.waitForTimeout(300);
    await page.locator("#btnRoutingPlannerOpen").click();
    await page.waitForTimeout(600);
    const labelSel = "input.routing-pt-field[data-routing-label]";
    const hasLabel = await page.locator(labelSel).count();
    if (hasLabel) {
      for (const id of UI_IDS) {
        const c = CASES.find((x) => x[0] === id);
        ctx._phase = "routing:" + id;
        const lab = page.locator(labelSel).first();
        const pid = await lab.getAttribute("data-routing-id");
        await lab.fill("10, 20");
        await lab.press("Enter");
        await page.waitForTimeout(250);
        const before = await page.evaluate((pid) => { const p = state._routing.points.find((x) => x.id === pid); return p && { lat: p.lat, lon: p.lon }; }, pid);
        await lab.fill(c[1]);
        await lab.press("Enter");
        await page.waitForTimeout(300);
        const after = await page.evaluate((pid) => { const p = state._routing.points.find((x) => x.id === pid); return p && { lat: p.lat, lon: p.lon }; }, pid);
        let pass;
        if (c[2] === "valid") pass = near(after, c[3], c[4], 1e-9);
        else pass = JSON.stringify(before) === JSON.stringify(after);
        const sentinelOk = !!before && before.lat === 10 && before.lon === 20;
        pass = pass && sentinelOk;
        ui.push({ entry: "routing", id, q: c[1], pass, sentinelOk, before, after });
      }
    } else {
      ui.push({ entry: "routing", id: "n/a", pass: false, note: "label input not found" });
    }

    const byEntry = {};
    for (const r of ui) { byEntry[r.entry] = byEntry[r.entry] || { n: 0, pass: 0 }; byEntry[r.entry].n++; if (r.pass) byEntry[r.entry].pass++; }
    const summary = {
      helper: { n: rows.length, pass: rows.filter((r) => r.pass).length, fail: rows.filter((r) => !r.pass).map((r) => r.id) },
      ui: byEntry,
      uiFail: ui.filter((r) => !r.pass).map((r) => r.entry + ":" + r.id),
      pageErrors,
      clickMethods
    };
    fs.writeFileSync(outPath, JSON.stringify({ candidate: candPath, summary, rows, ui }, null, 2));
    console.log("SUMMARY=" + JSON.stringify(summary));
  } finally {
    if (browser) await browser.close();
    server.close();
  }
})().catch((e) => { console.error(e.stack || e); process.exit(1); });
