// Real interactions on the two editor consumers: Waypoint editor (#wpFieldCoord + Salva)
// and Polygon vertex coordinate modal (Lat/Lon fields + Salva) on a draft polygon.
// Usage: node editors-ui.cjs <candidate.html> <out.json>
const fs = require("fs");
const http = require("http");
const { chromium } = require("C:/goi-pw-probe/node_modules/playwright");
const near = (a, b, t) => Math.abs(a - b) <= t;
(async () => {
  const bytes = fs.readFileSync(process.argv[2]);
  const server = http.createServer((q, r) => { r.setHeader("Content-Type", "text/html; charset=utf-8"); r.end(bytes); });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const browser = await chromium.launch({ executablePath: "C:/Users/Utente/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe", headless: true });
  const out = { waypoint: [], polygon: [], external: [], pageErrors: [] };
  try {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await ctx.route("**/*", (r) => { const u = r.request().url(); if (u.startsWith("http://127.0.0.1:")) return r.continue(); out.external.push(u.split("/")[2]); return r.abort(); });
    const page = await ctx.newPage();
    page.on("pageerror", (e) => out.pageErrors.push(e.message));
    await page.goto("http://127.0.0.1:" + server.address().port + "/", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => typeof startWaypointNewWaypointFlow === "function" && typeof polygonStartDraw === "function");

    // --- Waypoint editor ---
    const WP = [
      ["eu-semicolon", "45,5; 9,2", 45.5, 9.2],
      ["neg-n", "-44.1N 9.8E"],
      ["s-plus", "S+44.1 E9.8"],
      ["neg-s", "-44.1S 9.8E", -44.1, 9.8]
    ];
    await page.evaluate(() => openWaypointModal());
    for (const [id, q, lat, lon] of WP) {
      await page.evaluate(() => startWaypointNewWaypointFlow());
      await page.locator("#wpFieldCoord").waitFor({ state: "visible" });
      const n0 = await page.evaluate(() => state.mapWaypoints.length);
      await page.locator("#wpFieldName").fill("T-" + id);
      await page.locator("#wpFieldCoord").fill(q);
      await page.waitForTimeout(700);
      await page.locator("#wpEditorSave").click();
      await page.waitForTimeout(300);
      const r = await page.evaluate((n0) => {
        const added = state.mapWaypoints.slice(n0);
        const fb = document.getElementById("wpFieldCoordFeedback");
        return { added: added.map((w) => ({ name: w.name, lat: w.lat, lon: w.lon })), fb: fb ? fb.textContent.trim().slice(0, 60) : "", editorOpen: !!state.waypointEditorDraft };
      }, n0);
      let pass;
      if (lat !== undefined) pass = r.added.length === 1 && near(r.added[0].lat, lat, 1e-9) && near(r.added[0].lon, lon, 1e-9);
      else pass = r.added.length === 0 && !!r.fb;
      out.waypoint.push({ id, q, pass, ...r });
      if (r.editorOpen) await page.evaluate(() => { try { closeWaypointEditor(); } catch (_) { state.waypointEditorDraft = null; } });
    }
    await page.evaluate(() => { try { closeWaypointModal(); } catch (_) {} });
    await page.waitForTimeout(200);

    // --- Polygon vertex modal on a draft ---
    await page.evaluate(() => openPolygonPanel());
    await page.locator("#polygonPanelNewBtn").click();
    await page.screenshot({path: "work/ui-stage/viewport-regression/polygon-draft.png"});
    const points = await page.evaluate(() => {let points=[]; for(let y=140;y<innerHeight-60;y+=28) for(let x=12;x<innerWidth-12;x+=28){let el=document.elementFromPoint(x,y); if(el && el.closest('#miniMap') && !el.closest('button,.tile-ctrls,.gis-panel-floating')) points.push([x,y]);} return points;});
    console.log("VISIBLE_MAP_POINTS", points.length, points.slice(0,3));
    for (const point of [points[0],points[Math.floor(points.length/2)],points[points.length-1]].filter(Boolean)) { await page.mouse.click(point[0],point[1]); await page.waitForTimeout(250); }
    const nDraft = await page.evaluate(() => (state._polygonDraftVertices || []).length);
    out.polygonDraftVertices = nDraft;
    out.polygonButtons = await page.evaluate(() => Array.from(document.querySelectorAll("#polygonPanel button")).filter((b) => b.offsetParent !== null).map((b) => b.className + " | " + (b.getAttribute("aria-label") || b.textContent.trim()).slice(0, 40)));
    console.log("DRAFT=" + nDraft, JSON.stringify(out.polygonButtons));
    const POLY = [
      ["eu-fields", "45,5", "9,2", 45.5, 9.2],
      ["neg-n-fields", "-44.1N", "9.8E"],
      ["lone-lat", "45,5", ""],
      ["dot-fields", "44.1", "9.8", 44.1, 9.8]
    ];
    for (const [id, la, lo, lat, lon] of POLY) {
      const btn = page.locator("#polygonPanel .poly-edit-vert-mod").first();
      const nBtn = await btn.count();
      if (!nBtn) { out.polygon.push({ id, pass: false, note: "vertex coord button not found", nDraft }); continue; }
      await btn.click();
      await page.locator("#polygonVertexCoordDialog").waitFor({ state: "visible", timeout: 4000 });
      await page.evaluate(() => { const s = document.getElementById("polygonVertexCoordFormatSel"); if (s && s.value !== "dd") { s.value = "dd"; s.dispatchEvent(new Event("change", { bubbles: true })); } });
      const before = await page.evaluate(() => JSON.stringify(state._polygonDraftVertices[0]));
      await page.locator("#polygonVertexCoordLat").fill(la);
      await page.locator("#polygonVertexCoordLon").fill(lo);
      await page.locator("#polygonVertexCoordDialogSave").click();
      await page.waitForTimeout(250);
      const r = await page.evaluate(() => ({
        v0: state._polygonDraftVertices[0],
        dialogOpen: document.getElementById("polygonVertexCoordDialog").open,
        err: document.getElementById("polygonVertexCoordDialogErr").hidden ? "" : document.getElementById("polygonVertexCoordDialogErr").textContent.trim().slice(0, 60),
        saved: (state.gisPolygons || []).length
      }));
      let pass;
      if (lat !== undefined) pass = !r.dialogOpen && near(r.v0[1], lat, 5e-8) && near(r.v0[0], lon, 5e-8);
      else pass = r.dialogOpen && !!r.err && JSON.stringify(r.v0) === before;
      pass = pass && r.saved === 0;
      out.polygon.push({ id, la, lo, pass, before, ...r });
      if (r.dialogOpen) await page.locator("#polygonVertexCoordDialogCancel").click();
    }
  } finally {
    await browser.close();
    server.close();
  }
  out.summary = {
    waypoint: out.waypoint.filter((r) => r.pass).length + "/" + out.waypoint.length,
    polygon: out.polygon.filter((r) => r.pass).length + "/" + out.polygon.length,
    external: out.external.length,
    pageErrors: out.pageErrors.length
  };
  fs.writeFileSync(process.argv[3], JSON.stringify(out, null, 2));
  console.log("SUMMARY=" + JSON.stringify(out.summary));
  for (const r of out.waypoint.concat(out.polygon)) if (!r.pass) console.log("FAIL", JSON.stringify(r));
})().catch((e) => { console.error(e.stack || e); process.exit(1); });
