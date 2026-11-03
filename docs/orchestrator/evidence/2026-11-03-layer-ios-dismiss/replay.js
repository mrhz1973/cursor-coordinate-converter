const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { chromium, devices } = require('C:/goi-pw-probe/node_modules/playwright');

const repoRoot = path.resolve(__dirname, '../../../../');
const evidenceDir = __dirname;
const currentFile = path.join(repoRoot, 'coordinate_converter Claude.html');
const build270 = execFileSync('git', ['show', 'HEAD:coordinate_converter Claude.html'], { cwd: repoRoot, maxBuffer: 64 * 1024 * 1024 });
const build271 = fs.readFileSync(currentFile);
const sources = [
  { id: 'build271', bytes: build271 },
];
const profiles = [
  { id: 'ios-390x844', width: 390, height: 844, mobile: true },
  { id: 'ios-320x568', width: 320, height: 568, mobile: true },
  { id: 'desktop-1280x800', width: 1280, height: 800, mobile: false },
  { id: 'legacy-desktop-pointer-fallback', width: 1280, height: 800, mobile: false, disablePointerEvent: true },
];

function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
      if (pathname === '/build270.html') {
        res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
        res.end(build270);
        return;
      }
      if (pathname === '/build271.html') {
        res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
        res.end(build271);
        return;
      }
      const target = path.resolve(repoRoot, `.${pathname}`);
      if (target !== repoRoot && !target.startsWith(repoRoot + path.sep)) { res.writeHead(403).end(); return; }
      fs.readFile(target, (error, bytes) => {
        if (error) { res.writeHead(404).end(); return; }
        const ext = path.extname(target).toLowerCase();
        const contentType = ext === '.svg' ? 'image/svg+xml' : 'application/octet-stream';
        res.writeHead(200, { 'content-type': contentType, 'cache-control': 'no-store' });
        res.end(bytes);
      });
    });
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

async function state(page) {
  return page.evaluate(() => {
    const toggle = document.querySelector('#gisMapMount [data-role="basemap-menu-toggle"]');
    const menu = document.querySelector('#gisMapMount [data-role="basemap-menu"]');
    const box = toggle?.getBoundingClientRect();
    return {
      build: typeof APP_BUILD_NUM !== 'undefined' ? APP_BUILD_NUM : null,
      open: !!menu && !menu.hidden && getComputedStyle(menu).display !== 'none',
      button: box ? { x: box.x, y: box.y, width: box.width, height: box.height } : null,
      menuHeight: menu?.getBoundingClientRect().height || 0,
      activeLayer: menu?.querySelector('.tlayer-item[data-layer].is-active')?.dataset.layer || '',
    };
  });
}

async function run(browser, origin, source, profile) {
  process.stdout.write(`START ${source.id}/${profile.id}\n`);
  const device = profile.mobile ? devices['iPhone 13 Pro'] : {};
  const context = await browser.newContext({
    ...device,
    viewport: { width: profile.width, height: profile.height },
    ...(profile.mobile ? { screen: { width: profile.width, height: profile.height }, deviceScaleFactor: 1 } : {}),
    hasTouch: profile.mobile,
    isMobile: profile.mobile,
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(e.message));
  await context.route('**/*', async (route) => {
    if (new URL(route.request().url()).origin === origin) return route.continue();
    return route.abort('blockedbyclient');
  });
  try {
    if (profile.disablePointerEvent) {
      await context.addInitScript(() => { try { Object.defineProperty(window, 'PointerEvent', { configurable: true, value: undefined }); } catch (_) {} });
    }
    await page.goto(`${origin}/${source.id}.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForFunction(() => document.body.classList.contains('gis-mode') && document.querySelector('#gisMapMount [data-role="basemap-menu-toggle"]'), { timeout: 60000 });
    const tap = async (s) => {
      const b = s.button;
      if (profile.mobile) await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2);
      else await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
    };
    let before = await state(page);
    await tap(before);
    await page.waitForTimeout(250);
    const opened = await state(page);
    process.stdout.write(`OPEN ${source.id}/${profile.id} ${opened.open}\n`);
    await page.screenshot({ path: path.join(evidenceDir, `${source.id}-${profile.id}-open.png`) });

    // Reproduce a late compatibility mousedown outside after a touch opens the menu.
    await page.evaluate(() => document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: 2, clientY: 2 })));
    await page.waitForTimeout(150);
    const afterCompatMouse = await state(page);
    process.stdout.write(`COMPAT ${source.id}/${profile.id} ${afterCompatMouse.open}\n`);
    await page.screenshot({ path: path.join(evidenceDir, `${source.id}-${profile.id}-after-compat-mousedown.png`) });

    let ordinaryToggle = null;
    let outsidePointerClose = null;
    let selectedLayer = null;
    if (source.id === 'build271') {
      const after = await state(page);
      if (after.open) {
        await tap(after);
        await page.waitForTimeout(180);
        ordinaryToggle = await state(page);
      } else {
        // Reopen to test normal button toggle independently.
        await tap(after);
        await page.waitForTimeout(180);
        const reopened = await state(page);
        await tap(reopened);
        await page.waitForTimeout(180);
        ordinaryToggle = await state(page);
      }
      if (ordinaryToggle && !ordinaryToggle.open) {
        await tap(ordinaryToggle);
        await page.waitForTimeout(180);
      }
      const beforeOutside = await state(page);
      await page.evaluate((disablePointerEvent) => {
        const ev = disablePointerEvent
          ? new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: 2, clientY: 2 })
          : new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch', clientX: 2, clientY: 2 });
        document.body.dispatchEvent(ev);
      }, !!profile.disablePointerEvent);
      await page.waitForTimeout(150);
      outsidePointerClose = await state(page);
      outsidePointerClose.beforeOutside = beforeOutside;
      process.stdout.write(`OUTSIDE ${source.id}/${profile.id} ${beforeOutside.open}->${outsidePointerClose.open}\n`);

      const readyToSelect = await state(page);
      await tap(readyToSelect);
      await page.waitForTimeout(180);
      const option = await page.evaluate(() => {
        const menu = document.querySelector('#gisMapMount [data-role="basemap-menu"]');
        const row = menu?.querySelector('.tlayer-item[data-layer]:not(.is-active)');
        if (!row) return null;
        const r = row.getBoundingClientRect();
        return { layer: row.dataset.layer, x: r.x + r.width / 2, y: r.y + r.height / 2, width: r.width, height: r.height };
      });
      if (option && option.width > 0 && option.height > 0) {
        process.stdout.write(`SELECT ${source.id}/${profile.id} ${option.layer} @${option.x},${option.y}\n`);
        if (profile.mobile) await page.touchscreen.tap(option.x, option.y);
        else await page.mouse.click(option.x, option.y);
        await page.waitForTimeout(250);
        selectedLayer = await page.evaluate((targetLayer) => ({
          targetLayer,
          activeLayer: document.querySelector('#gisMapMount [data-role="basemap-menu"] .tlayer-item[data-layer].is-active')?.dataset.layer || '',
          menuOpen: (() => { const m = document.querySelector('#gisMapMount [data-role="basemap-menu"]'); return !!m && !m.hidden; })(),
        }), option.layer);
        process.stdout.write(`SELECTED ${source.id}/${profile.id} ${JSON.stringify(selectedLayer)}\n`);
      }
      else process.stdout.write(`NO OPTION ${source.id}/${profile.id}\n`);
    }
    return {
      source: source.id,
      profile: profile.id,
      expectedBuild: source.id === 'build270' ? 270 : 271,
      before,
      opened,
      afterCompatMouse,
      ordinaryToggle,
      outsidePointerClose,
      selectedLayer,
      pageErrors,
      checks: {
        buildLabel: opened.build === (source.id === 'build270' ? 270 : 271),
        opensAfterTap: opened.open,
        compatMouseBehaviorMatches: profile.disablePointerEvent ? !afterCompatMouse.open : afterCompatMouse.open,
        buttonStillToggles: source.id === 'build271' ? ordinaryToggle && !ordinaryToggle.open : null,
        outsidePointerStillDismisses: source.id === 'build271' ? outsidePointerClose?.beforeOutside?.open && !outsidePointerClose.open : null,
        layerOptionSelectsAndCloses: source.id === 'build271' ? !!selectedLayer && selectedLayer.activeLayer === selectedLayer.targetLayer && !selectedLayer.menuOpen : null,
        noPageErrors: pageErrors.length === 0,
      },
    };
  } finally {
    await context.close();
  }
}

(async () => {
  const serverInfo = await startServer();
  let browser;
  const results = [];
  try {
    browser = await chromium.launch({ headless: true, channel: 'msedge' });
    const engine = `Microsoft Edge / Chromium ${browser.version()} with iPhone 13 Pro touch emulation`;
    const origin = `http://127.0.0.1:${serverInfo.port}`;
    for (const source of sources) for (const profile of profiles) {
      results.push(await run(browser, origin, source, profile));
      fs.writeFileSync(path.join(evidenceDir, 'selection-results.json'), JSON.stringify({ engine, results, pass: results.length === profiles.length && results.every((r) => Object.values(r.checks).every((x) => x === null || x === true)) }, null, 2));
    }
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => { serverInfo.server.closeAllConnections?.(); serverInfo.server.close(resolve); });
  }
  const output = {
    schema: 'tmart-mobile-layer-dismiss-271',
    engine: `Microsoft Edge / Chromium ${browser.version()} with iPhone 13 Pro touch emulation`,
    build270Sha256: crypto.createHash('sha256').update(build270).digest('hex'),
    build271Sha256: crypto.createHash('sha256').update(build271).digest('hex'),
    limitation: 'The compatibility mousedown is dispatched explicitly; this test does not establish the event sequence of Safari or Chrome on a physical iPhone.',
    results,
    pass: results.every((r) => Object.values(r.checks).every((x) => x === null || x === true)),
  };
  fs.writeFileSync(path.join(evidenceDir, 'results.json'), JSON.stringify(output, null, 2));
  process.stdout.write(JSON.stringify({ pass: output.pass, engine: output.engine, build270Sha256: output.build270Sha256, build271Sha256: output.build271Sha256, limitation: output.limitation, results: results.map((r) => ({ source: r.source, profile: r.profile, checks: r.checks })) }, null, 2));
  if (!output.pass) process.exitCode = 1;
})().catch((e) => { console.error(e.stack || e); process.exitCode = 1; });
