const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium, devices } = require('C:/goi-pw-probe/node_modules/playwright');

const repoRoot = path.resolve(__dirname, '../../../../');
const source = fs.readFileSync(path.join(repoRoot, 'coordinate_converter Claude.html'), 'utf8');
const baseline = source
  .replace('const APP_BUILD_ID = "GIS-IOS-LANDSCAPE-STABILITY-A";', 'const APP_BUILD_ID = "GIS-MOBILE-LANDSCAPE-UX-A";')
  .replace('const APP_BUILD_DETAIL = "Viewport mobile senza animazioni di altezza instabili.";', 'const APP_BUILD_DETAIL = "Layer senza ridisegno della mappa; barra mobile compatta e vista espandibile.";')
  .replace('const APP_BUILD_NUM = 273;', 'const APP_BUILD_NUM = 272;')
  .replace('height:48px;box-sizing:border-box;padding:2px max(6px,env(safe-area-inset-left,0px));overflow:visible;', 'height:48px;box-sizing:border-box;transition:height .18s ease;padding:2px max(6px,env(safe-area-inset-left,0px));overflow:visible;')
  .replace('min-height:150px;}', 'min-height:150px;transition:height .18s ease;}');

function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
      if (pathname === '/build272.html' || pathname === '/build273.html') {
        res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
        res.end(pathname === '/build272.html' ? baseline : source);
        return;
      }
      const target = path.resolve(repoRoot, `.${pathname}`);
      if (target !== repoRoot && !target.startsWith(repoRoot + path.sep)) { res.writeHead(403).end(); return; }
      fs.readFile(target, (err, bytes) => {
        if (err) { res.writeHead(404).end(); return; }
        const ext = path.extname(target).toLowerCase();
        res.writeHead(200, { 'content-type': ext === '.svg' ? 'image/svg+xml' : 'application/octet-stream', 'cache-control': 'no-store' });
        res.end(bytes);
      });
    });
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

async function run(engineName, browserType, build, width, startHeight) {
  const browser = await browserType.launch({ headless: true, channel: 'msedge' });
  const ctx = await browser.newContext({
    ...devices['iPhone 13 Pro'], viewport: { width, height: startHeight },
    screen: { width, height: startHeight }, isMobile: true, hasTouch: true,
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  const pageErrors = [];
  await page.addInitScript(() => { window.__resizeCount = 0; addEventListener('resize', () => window.__resizeCount++, { passive: true }); });
  await page.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort('blockedbyclient'));
  page.on('pageerror', e => pageErrors.push(e.message));
  const result = { engine: engineName, build, viewport: { width, startHeight }, pageErrors, samples: [] };
  try {
    await page.goto(`${origin}/${build === 272 ? 'build272' : 'build273'}.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForFunction(() => document.body.classList.contains('gis-mode') && document.querySelector('#gisMapMount [data-role="basemap-menu-toggle"]'), { timeout: 60000 });
    const heights = [startHeight, startHeight - 22, startHeight - 8, startHeight - 34, startHeight - 15, startHeight - 30, startHeight];
    for (const viewportHeight of heights) {
      await page.setViewportSize({ width, height: viewportHeight });
      await page.waitForTimeout(45);
      result.samples.push(await page.evaluate(() => {
        const map = document.querySelector('.gis-map-mount');
        const header = document.querySelector('body.gis-mode > header');
        return {
          viewportHeight: innerHeight,
          mapHeight: map.getBoundingClientRect().height,
          expectedMapHeight: innerHeight - 48,
          heightError: Math.abs(map.getBoundingClientRect().height - (innerHeight - 48)),
          headerHeight: header.getBoundingClientRect().height,
          mapHeightTransition: getComputedStyle(map).transitionProperty,
          headerHeightTransition: getComputedStyle(header).transitionProperty,
          resizeCount: window.__resizeCount,
        };
      }));
    }
    await page.waitForTimeout(250);
    result.settled = await page.evaluate(() => {
      const r = document.querySelector('.gis-map-mount').getBoundingClientRect();
      const h = document.querySelector('body.gis-mode > header').getBoundingClientRect();
      return { mapHeight: r.height, expectedMapHeight: innerHeight - 48, heightError: Math.abs(r.height - (innerHeight - 48)), headerHeight: h.height, viewportHeight: innerHeight };
    });
    const layer = page.locator('#gisMapMount [data-role="basemap-menu-toggle"]');
    const box = await layer.boundingBox();
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    result.layerOpenAfterViewportStress = await page.locator('#gisMapMount [data-role="basemap-menu"]').evaluate(el => !el.hidden && getComputedStyle(el).display !== 'none');
    result.pageErrors = pageErrors;
    result.pass = result.samples.every(s => s.headerHeight === 48) && result.layerOpenAfterViewportStress && pageErrors.length === 0;
  } catch (error) {
    result.error = String(error && error.stack || error);
    result.pass = false;
  } finally {
    await ctx.close();
    await browser.close();
  }
  return result;
}

let origin;
(async () => {
  const { server, port } = await startServer();
  origin = `http://127.0.0.1:${port}`;
  const results = [];
  try {
    for (const [name, engine] of [['Chromium', chromium]]) {
      for (const build of [272, 273]) {
        for (const [width, height] of [[844, 390], [667, 375]]) results.push(await run(name, engine, build, width, height));
      }
    }
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
  const output = { schema: 'tmart-ios-landscape-stability-273', limitation: 'Chromium with iPhone touch emulation; not physical iOS Safari.', results };
  fs.writeFileSync(path.join(__dirname, 'stress-results.json'), JSON.stringify(output, null, 2) + '\n');
  const compact = results.map(r => ({ engine: r.engine, build: r.build, viewport: r.viewport, pass: r.pass, maxTransientHeightError: Math.max(0, ...r.samples.map(s => s.heightError)), transitions: r.samples[0] ? { map: r.samples[0].mapHeightTransition, header: r.samples[0].headerHeightTransition } : null, settled: r.settled, layerOpenAfterViewportStress: r.layerOpenAfterViewportStress, error: r.error }));
  const comparison = [844, 667].map(width => {
    const old = compact.find(r => r.build === 272 && r.viewport.width === width);
    const fixed = compact.find(r => r.build === 273 && r.viewport.width === width);
    return { width, build272MaxError: old?.maxTransientHeightError ?? null, build273MaxError: fixed?.maxTransientHeightError ?? null, improved: !!old && !!fixed && fixed.maxTransientHeightError < old.maxTransientHeightError };
  });
  const pass = results.length === 4 && results.every(r => r.pass) && comparison.every(c => c.improved && c.build273MaxError <= 1);
  console.log(JSON.stringify({ results: compact, comparison, pass }, null, 2));
  if (!pass) process.exitCode = 1;
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
