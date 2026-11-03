const fs = require('node:fs');
const path = require('node:path');
const { chromium, devices } = require('C:/goi-pw-probe/node_modules/playwright');
const evidenceDir = __dirname;
const url = 'http://100.99.54.93:8000/coordinate_converter%20Claude.html?v=272';
const origin = new URL(url).origin;
const profiles = [
  { id: 'landscape-844x390', width: 844, height: 390 },
  { id: 'landscape-667x375', width: 667, height: 375 },
];
function rect(e) {
  if (!e) return null;
  const r = e.getBoundingClientRect();
  return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom, centerX: r.x + r.width / 2, centerY: r.y + r.height / 2 };
}
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const results = [];
  try {
    for (const profile of profiles) {
      const device = devices['iPhone 13 Pro'];
      const context = await browser.newContext({ ...device, viewport: { width: profile.width, height: profile.height }, screen: { width: profile.width, height: profile.height }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort('blockedbyclient'));
      const result = { profile: profile.id, checks: {}, pageErrors: errors };
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForFunction(() => document.body.classList.contains('gis-mode') && document.querySelector('#gisMapMount [data-role="basemap-menu-toggle"]'), { timeout: 45000 });
        await page.waitForTimeout(350);
        result.build = await page.evaluate(() => ({ id: APP_BUILD_ID, num: APP_BUILD_NUM }));
        result.layout = await page.evaluate(() => {
          const rect = selector => { const e = document.querySelector(selector); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom, centerX: r.x + r.width / 2, centerY: r.y + r.height / 2 }; };
          const nav = rect('#gisMobileFullscreenBtn');
          const brand = rect('.header-inner>.brand');
          const tools = rect('#btnTopbarTools');
          const exportButton = rect('#gisExportSummary');
          const online = rect('#netStatus');
          const settings = rect('#btnHeaderSettings');
          return { header: rect('body.gis-mode>header'), nav, brand, tools, export: exportButton, online, settings,
            parents: { brand: document.querySelector('.brand')?.parentElement?.className || '', tools: document.getElementById('btnTopbarTools')?.parentElement?.className || '', export: document.getElementById('gisExportMenu')?.parentElement?.className || '' },
            aria: { tools: document.getElementById('btnTopbarTools')?.getAttribute('aria-label') || '', export: document.getElementById('gisExportSummary')?.getAttribute('aria-label') || '' } };
        });
        const centers = ['nav', 'brand', 'tools', 'export', 'online', 'settings'].map(key => result.layout[key]?.centerY).filter(Number.isFinite);
        result.checks.build272 = result.build.num === 272;
        result.checks.sharedRow = centers.length === 6 && Math.max(...centers) - Math.min(...centers) <= 2;
        result.checks.titleCenteredAndClear = Math.abs(result.layout.brand.centerX - profile.width / 2) <= 2 && result.layout.brand.x > result.layout.nav.right && result.layout.brand.right < result.layout.tools.x;
        result.checks.rightControlOrder = result.layout.tools.x < result.layout.export.x && result.layout.export.x < result.layout.online.x && result.layout.online.x < result.layout.settings.x;
        result.checks.controlsMovedToHeader = result.layout.parents.brand === 'header-inner' && result.layout.parents.tools === 'header-ctrls' && result.layout.parents.export === 'header-ctrls';
        result.checks.accessibleNames = result.layout.aria.tools === 'Strumenti' && result.layout.aria.export === 'Esporta';
        await page.evaluate(() => { const root = document.getElementById('miniMap'); const original = window.renderTileMap; window.__liveQa = { beforeNode: root?.querySelector('.tile-map'), renders: 0 }; window.renderTileMap = function(...args) { window.__liveQa.renders++; return original.apply(this, args); }; });
        const toggle = await page.locator('#gisMapMount [data-role="basemap-menu-toggle"]').boundingBox();
        await page.touchscreen.tap(toggle.x + toggle.width / 2, toggle.y + toggle.height / 2);
        await page.waitForTimeout(180);
        result.layer = await page.evaluate(() => { const root = document.getElementById('miniMap'); const menu = root?.querySelector('[data-role="basemap-menu"]'); return { open: !!menu && !menu.hidden && getComputedStyle(menu).display !== 'none', nodePreserved: root?.querySelector('.tile-map') === window.__liveQa.beforeNode, renderCalls: window.__liveQa.renders, menu: (() => { if (!menu) return null; const r = menu.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, insideViewport: r.left >= 0 && r.top >= 0 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1 }; })() }; });
        result.checks.layerOpensWithoutMapRedraw = result.layer.open && result.layer.nodePreserved && result.layer.renderCalls === 0;
        result.checks.layerMenuVisibleInViewport = !!result.layer.menu?.insideViewport;
        await page.screenshot({ path: path.join(evidenceDir, `build272-live-${profile.id}.png`) });
        result.checks.noPageErrors = errors.length === 0;
        result.pass = Object.values(result.checks).every(Boolean);
      } catch (error) {
        result.error = error.stack || String(error);
        result.pass = false;
      } finally {
        await context.close();
      }
      results.push(result);
      process.stdout.write(`${result.pass ? 'PASS' : 'FAIL'} ${profile.id} ${JSON.stringify(result.error || result.checks)}\n`);
      fs.writeFileSync(path.join(evidenceDir, 'build272-postdeploy-results.json'), JSON.stringify({ schema: 'tmart-gis-build272-postdeploy-browser-qa', url, engine: 'Microsoft Edge / Chromium with iPhone 13 Pro touch viewport emulation', limitation: 'External tile providers were blocked; verifies the deployed app, one-row layout and Layer interaction, not map-provider availability or real iOS Safari/Chrome.', results, pass: results.every(item => item.pass) }, null, 2));
    }
  } finally {
  await Promise.race([browser.close(), new Promise(resolve => setTimeout(resolve, 8000))]);
  }
  const report = { schema: 'tmart-gis-build272-postdeploy-browser-qa', url, engine: 'Microsoft Edge / Chromium with iPhone 13 Pro touch viewport emulation', limitation: 'External tile providers were blocked; verifies the deployed app, one-row layout and Layer interaction, not map-provider availability or real iOS Safari/Chrome.', results, pass: results.every(result => result.pass) };
  fs.writeFileSync(path.join(evidenceDir, 'build272-postdeploy-results.json'), JSON.stringify(report, null, 2));
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  process.exit(report.pass ? 0 : 1);
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
