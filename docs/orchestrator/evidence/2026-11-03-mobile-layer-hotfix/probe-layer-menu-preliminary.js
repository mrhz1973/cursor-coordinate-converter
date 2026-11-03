const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { webkit, devices } = require('C:/goi-pw-probe/node_modules/playwright');

const workRoot = __dirname;
const evidenceRoot = path.resolve(workRoot, '../../docs/orchestrator/evidence/2026-11-03-mobile-layer-hotfix');
const sourceName = process.argv[2] || 'live268.html';
const phase = process.argv[3] || 'before';
const engineName = process.argv[4] || 'chromium';
const pagePath = path.join(workRoot, sourceName);
const sizes = [
  { name: '390x844-portrait', width: 390, height: 844, mobile: true },
  { name: '320x720-portrait', width: 320, height: 720, mobile: true },
  { name: '844x390-landscape', width: 844, height: 390, mobile: true },
  { name: '720x320-landscape', width: 720, height: 320, mobile: true },
  { name: '1280x800-desktop', width: 1280, height: 800, mobile: false },
];

function mimeType(file) {
  return ({ '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' })[path.extname(file).toLowerCase()] || 'application/octet-stream';
}

function startLocalServer() {
  return new Promise((resolve, reject) => {
    const root = path.resolve(workRoot);
    const server = http.createServer((req, res) => {
      let pathname;
      try { pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname); }
      catch { res.writeHead(400).end(); return; }
      const target = path.resolve(root, `.${pathname}`);
      if (target !== root && !target.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
      fs.readFile(target, (err, bytes) => {
        if (err) { res.writeHead(404).end(); return; }
        res.writeHead(200, { 'content-type': mimeType(target), 'cache-control': 'no-store' });
        res.end(bytes);
      });
    });
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

async function readState(page) {
  return page.evaluate(() => {
    const btn = document.querySelector('#gisMapMount [data-role="basemap-menu-toggle"]');
    const menu = document.querySelector('#gisMapMount [data-role="basemap-menu"]');
    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom };
    };
    const layers = menu ? [...menu.querySelectorAll('.tlayer-item')].map((el) => ({
      text: (el.innerText || el.getAttribute('aria-label') || '').trim(),
      layer: el.dataset.layer || null,
      overlay: el.dataset.overlay || null,
      active: el.classList.contains('is-active') || el.getAttribute('aria-pressed') === 'true' || el.getAttribute('aria-checked') === 'true',
      rect: rect(el),
    })) : [];
    const ancestors = [];
    for (let el = menu?.parentElement; el; el = el.parentElement) {
      const cs = getComputedStyle(el);
      if (cs.overflow !== 'visible' || cs.overflowX !== 'visible' || cs.overflowY !== 'visible' || cs.transform !== 'none' || cs.contain !== 'none' || cs.isolation === 'isolate') {
        ancestors.push({ tag: el.tagName.toLowerCase(), id: el.id || '', className: typeof el.className === 'string' ? el.className : '', overflow: `${cs.overflowX}/${cs.overflowY}`, transform: cs.transform, contain: cs.contain, isolation: cs.isolation, rect: rect(el) });
      }
    }
    return {
      ready: document.body.classList.contains('gis-mode'),
      title: document.title,
      menuVisible: !!menu && !menu.hidden && getComputedStyle(menu).display !== 'none',
      button: rect(btn),
      menu: rect(menu),
      menuStyle: menu ? { position: getComputedStyle(menu).position, maxHeight: getComputedStyle(menu).maxHeight, overflowY: getComputedStyle(menu).overflowY, scrollHeight: menu.scrollHeight, clientHeight: menu.clientHeight, scrollTop: menu.scrollTop } : null,
      controls: rect(menu?.closest('.tile-ctrls')),
      viewport: { width: innerWidth, height: innerHeight },
      fitsViewport: !!menu && !menu.hidden && rect(menu) && rect(menu).x >= 0 && rect(menu).y >= 0 && rect(menu).right <= innerWidth && rect(menu).bottom <= innerHeight,
      layers,
      ancestors,
      compactDialogCount: document.querySelectorAll('dialog.compact-basemap-dialog').length,
    };
  });
}

async function tapCenter(page, rect, mobile) {
  const x = rect.x + rect.width / 2;
  const y = rect.y + rect.height / 2;
  if (mobile) await page.touchscreen.tap(x, y);
  else await page.mouse.click(x, y);
}

async function scrollMenuTo(page, predicate) {
  const menu = page.locator('#gisMapMount [data-role="basemap-menu"]');
  const before = await menu.evaluate((el) => el.scrollTop);
  const box = await menu.boundingBox();
  if (!box) return { before, after: before, reached: false };
  await page.mouse.move(box.x + box.width / 2, box.y + box.height - 18);
  for (let i = 0; i < 12; i++) {
    const found = await page.locator('#gisMapMount [data-role="basemap-menu"] .tlayer-item').evaluateAll((els, p) => {
      const el = els.find((node) => (p.layer && node.dataset.layer === p.layer) || (p.overlay && node.dataset.overlay === p.overlay));
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { y: r.y, bottom: r.bottom };
    }, predicate);
    const state = await menu.evaluate((el) => ({ top: el.scrollTop, bottom: el.getBoundingClientRect().bottom }));
    if (found && found.y >= box.y && found.bottom <= box.y + box.height) return { before, after: state.top, reached: true, itemRect: found };
    await page.mouse.wheel(0, Math.max(180, box.height * 0.72));
    await page.waitForTimeout(120);
  }
  return { before, after: await menu.evaluate((el) => el.scrollTop), reached: false };
}

async function runCase(browser, baseUrl, size) {
  const mobile = size.mobile !== false;
  const context = await browser.newContext({
    ...(mobile ? devices['iPhone 13 Pro'] : {}),
    viewport: { width: size.width, height: size.height },
    ...(mobile ? { screen: { width: size.width, height: size.height } } : {}),
    isMobile: mobile,
    hasTouch: mobile,
    deviceScaleFactor: mobile ? 3 : 1,
  });
  const page = await context.newPage();
  const externalRequests = [];
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(e.message));
  await page.route('**/*', async (route) => {
    const url = route.request().url();
    if (url.startsWith(baseUrl)) return route.continue();
    externalRequests.push(url);
    return route.abort('blockedbyclient');
  });
  await page.addInitScript(() => {
    window.__layerTrace = [];
    window.addEventListener('resize', () => window.__layerTrace.push({ type: 'resize', width: innerWidth, height: innerHeight, time: performance.now() }), true);
    document.addEventListener('click', (ev) => {
      if (ev.target.closest?.('[data-role="basemap-menu-toggle"], [data-role="basemap-menu"] .tlayer-item')) {
        window.__layerTrace.push({ type: 'click', role: ev.target.closest('[data-role]')?.dataset.role || '', layer: ev.target.closest('.tlayer-item')?.dataset.layer || '', overlay: ev.target.closest('.tlayer-item')?.dataset.overlay || '', time: performance.now() });
      }
    }, true);
  });
  const result = { name: size.name, viewport: { width: size.width, height: size.height }, source: sourceName, phase, externalRequests, pageErrors };
  try {
    await page.goto(`${baseUrl}/${encodeURIComponent(sourceName)}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForFunction(() => document.body.classList.contains('gis-mode') && document.querySelector('#gisMapMount [data-role="basemap-menu-toggle"]'), { timeout: 30000 });
    await page.waitForTimeout(800);
    result.initial = await readState(page);
    result.initialScreenshot = `${phase}-${size.name}-closed.png`;
    await page.screenshot({ path: path.join(evidenceRoot, result.initialScreenshot), fullPage: false });

    const toggle = await page.locator('#gisMapMount [data-role="basemap-menu-toggle"]').boundingBox();
    await tapCenter(page, toggle, mobile);
    await page.waitForTimeout(450);
    result.afterOpen = await readState(page);
    result.openScreenshot = `${phase}-${size.name}-open.png`;
    await page.screenshot({ path: path.join(evidenceRoot, result.openScreenshot), fullPage: false });
    result.openTapUsed = { x: toggle.x + toggle.width / 2, y: toggle.y + toggle.height / 2, input: mobile ? 'Playwright Edge Chromium touchscreen.tap' : 'Playwright Edge Chromium mouse.click' };

    const rotated = mobile ? { width: size.height, height: size.width } : { width: size.width, height: Math.max(240, size.height - 32) };
    await page.setViewportSize(rotated);
    await page.waitForTimeout(350);
    result.afterRotationOrResize = await readState(page);
    result.resizeScreenshot = `${phase}-${size.name}-resize.png`;
    await page.screenshot({ path: path.join(evidenceRoot, result.resizeScreenshot), fullPage: false });
    await page.setViewportSize({ width: size.width, height: size.height });
    await page.waitForTimeout(350);
    result.afterViewportRestore = await readState(page);
    if (!result.afterViewportRestore.menuVisible) {
      const restoredToggle = await page.locator('#gisMapMount [data-role="basemap-menu-toggle"]').boundingBox();
      await tapCenter(page, restoredToggle, mobile);
      await page.waitForTimeout(400);
    }
    result.afterRotationInteractionOpen = await readState(page);
    if (mobile) {
      await page.setViewportSize({ width: size.width, height: Math.max(240, size.height - 32) });
      await page.waitForTimeout(350);
      result.afterViewportHeightChange = await readState(page);
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.waitForTimeout(350);
      result.afterViewportHeightRestore = await readState(page);
      if (!result.afterViewportHeightRestore.menuVisible) {
        const restoredToggle = await page.locator('#gisMapMount [data-role="basemap-menu-toggle"]').boundingBox();
        await tapCenter(page, restoredToggle, mobile);
        await page.waitForTimeout(400);
      }
    } else {
      result.afterViewportHeightChange = result.afterRotationOrResize;
    }
    result.afterResizeInteractionOpen = await readState(page);

    if (result.afterResizeInteractionOpen.menuVisible) {
      const firstBase = result.afterResizeInteractionOpen.layers.find((x) => x.layer && x.rect && x.rect.y >= 0 && x.rect.bottom <= size.height);
      result.basemapCandidate = firstBase || result.afterResizeInteractionOpen.layers.find((x) => x.layer) || null;
      if (result.basemapCandidate?.rect) {
        const r = result.basemapCandidate.rect;
        result.basemapTap = { x: r.x + r.width / 2, y: r.y + r.height / 2, layer: result.basemapCandidate.layer, input: mobile ? 'Playwright touchscreen.tap' : 'Playwright mouse.click' };
        if (mobile) await page.touchscreen.tap(result.basemapTap.x, result.basemapTap.y);
        else await page.mouse.click(result.basemapTap.x, result.basemapTap.y);
        await page.waitForTimeout(350);
        result.afterBasemap = await readState(page);
      }

      const toggleAgain = await page.locator('#gisMapMount [data-role="basemap-menu-toggle"]').boundingBox();
      await tapCenter(page, toggleAgain, mobile);
      await page.waitForTimeout(350);
      result.afterReopen = await readState(page);
      const overlay = result.afterReopen.layers.find((x) => x.overlay === 'mgrs' && x.rect);
      if (overlay) {
        result.overlayScroll = await scrollMenuTo(page, { overlay: overlay.overlay });
        result.afterScroll = await readState(page);
        const target = result.afterScroll.layers.find((x) => x.overlay === overlay.overlay);
        if (target?.rect) {
          result.overlayTap = { x: target.rect.x + target.rect.width / 2, y: target.rect.y + target.rect.height / 2, overlay: target.overlay, input: mobile ? 'Playwright touchscreen.tap' : 'Playwright mouse.click' };
          if (mobile) await page.touchscreen.tap(result.overlayTap.x, result.overlayTap.y);
          else await page.mouse.click(result.overlayTap.x, result.overlayTap.y);
          await page.waitForTimeout(350);
          result.afterOverlay = await readState(page);
        }
      }

      await (mobile ? page.touchscreen.tap(8, Math.max(30, size.height - 24)) : page.mouse.click(8, Math.max(30, size.height - 24)));
      await page.waitForTimeout(300);
      result.afterOutsideClose = await readState(page);
      const reopenToggle = await page.locator('#gisMapMount [data-role="basemap-menu-toggle"]').boundingBox();
      await tapCenter(page, reopenToggle, mobile);
      await page.waitForTimeout(350);
      result.afterOutsideReopen = await readState(page);
      const finalToggle = await page.locator('#gisMapMount [data-role="basemap-menu-toggle"]').boundingBox();
      await tapCenter(page, finalToggle, mobile);
      await page.waitForTimeout(250);
      result.afterClose = await readState(page);
    }

    result.trace = await page.evaluate(() => window.__layerTrace || []);
  } catch (e) {
    result.error = e.stack || String(e);
    try { result.lastState = await readState(page); } catch {}
    try { await page.screenshot({ path: path.join(evidenceRoot, `${phase}-${size.name}-error.png`), fullPage: false }); } catch {}
  } finally {
    await context.close();
  }
  result.externalRequestCount = externalRequests.length;
  result.externalHosts = [...new Set(externalRequests.map((url) => { try { return new URL(url).host; } catch { return ''; } }).filter(Boolean))];
  delete result.externalRequests;
  return result;
}

(async () => {
  fs.mkdirSync(evidenceRoot, { recursive: true });
  if (!fs.existsSync(pagePath)) throw new Error(`Missing page: ${pagePath}`);
  const { server, port } = await startLocalServer();
  const baseUrl = `http://127.0.0.1:${port}`;
  let browser;
  try {
    browser = engineName === 'webkit'
      ? await webkit.launch({ headless: true })
      : await require('C:/goi-pw-probe/node_modules/playwright').chromium.launch({ headless: true, channel: 'msedge' });
    const results = [];
    for (const size of sizes) results.push(await runCase(browser, baseUrl, size));
    const output = { sourceName, phase, engine: `Playwright ${engineName === 'webkit' ? 'WebKit 18.2' : 'Edge Chromium'} (iPhone 13 Pro user agent, mobile viewport, touch input)`, localServer: '127.0.0.1, HTML/assets served from work/mobile-layer-hotfix', externalNetwork: 'all requests outside the temporary test-server origin aborted by Playwright routing', results };
    fs.writeFileSync(path.join(evidenceRoot, `${phase}-probe.json`), JSON.stringify(output, null, 2));
    process.stdout.write(JSON.stringify({ sourceName, phase, engine: output.engine, externalNetwork: output.externalNetwork, results: results.map((r) => ({ name: r.name, viewport: r.viewport, mobile: r.name.includes('desktop') ? false : true, menuVisibleAfterTap: r.afterOpen?.menuVisible, menuVisibleAfterRotationOrResize: r.afterRotationOrResize?.menuVisible, menuInsideAfterRotationOrResize: r.afterRotationOrResize?.fitsViewport, menuVisibleAfterRestore: r.afterViewportRestore?.menuVisible, menuVisibleAfterHeightChange: r.afterViewportHeightChange?.menuVisible, menuVisibleForInteraction: r.afterResizeInteractionOpen?.menuVisible, menuInsideForInteraction: r.afterResizeInteractionOpen?.fitsViewport, menuScrollHeight: r.afterResizeInteractionOpen?.menuStyle?.scrollHeight, menuClientHeight: r.afterResizeInteractionOpen?.menuStyle?.clientHeight, afterBasemap: r.afterBasemap ? { menuVisible: r.afterBasemap.menuVisible, layers: r.afterBasemap.layers.filter((x) => x.active).map((x) => x.layer || x.overlay) } : null, overlayScroll: r.overlayScroll, afterOverlay: r.afterOverlay ? { menuVisible: r.afterOverlay.menuVisible, activeOverlays: r.afterOverlay.layers.filter((x) => x.overlay && x.active).map((x) => x.overlay) } : null, closedOutside: r.afterOutsideClose ? !r.afterOutsideClose.menuVisible : null, reopenedOutside: r.afterOutsideReopen?.menuVisible, finalClosed: r.afterClose ? !r.afterClose.menuVisible : null, compactDialogCount: r.afterOpen?.compactDialogCount, externalRequestCount: r.externalRequestCount, externalHosts: r.externalHosts, pageErrors: r.pageErrors, error: r.error })) }, null, 2));
  } finally {
    if (browser) await browser.close();
    server.close();
  }
})().catch((e) => { console.error(e.stack || e); process.exitCode = 1; });
