const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { chromium, devices } = require('C:/goi-pw-probe/node_modules/playwright');

const root = __dirname;
const evidenceRoot = path.resolve(root, '../../docs/orchestrator/evidence/2026-11-03-mobile-layer-hotfix/replay-v3');
const sources = [
  { key: 'live268', file: 'live268.html', expectResizeClose: true },
  { key: 'hotfix270', file: 'hotfix270.html', expectResizeClose: false },
];
const profiles = [
  { id: '390x844-portrait', width: 390, height: 844, mobile: true },
  { id: '320x720-portrait', width: 320, height: 720, mobile: true },
  { id: '844x390-landscape', width: 844, height: 390, mobile: true },
  { id: '720x320-landscape', width: 720, height: 320, mobile: true },
  { id: '1280x800-desktop', width: 1280, height: 800, mobile: false },
];
const failures = [];

function hashFile(file) {
  const bytes = fs.readFileSync(file);
  const git = spawnSync('git', ['hash-object', '--', file], { cwd: path.resolve(root, '../..'), encoding: 'utf8' });
  return { file: path.basename(file), bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), gitBlob: git.status === 0 ? git.stdout.trim() : null };
}

function fail(source, profile, phase, check, detail) {
  failures.push({ source, profile, phase, check, detail: String(detail) });
}

async function boundedCleanup(promise, label, timeoutMs) {
  let timer;
  try {
    await Promise.race([
      promise,
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${label} cleanup exceeded ${timeoutMs}ms`)), timeoutMs); }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function startLocalServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let pathname;
      try { pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname); }
      catch { res.writeHead(400).end(); return; }
      const target = path.resolve(root, `.${pathname}`);
      if (target !== root && !target.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
      const ext = path.extname(target).toLowerCase();
      const type = ({ '.html': 'text/html; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.css': 'text/css', '.js': 'text/javascript' })[ext] || 'application/octet-stream';
      fs.readFile(target, (err, bytes) => {
        if (err) { res.writeHead(404).end(); return; }
        res.writeHead(200, { 'content-type': type, 'cache-control': 'no-store' });
        res.end(bytes);
      });
    });
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

async function makePage(browser, origin, source, profile, sink) {
  const context = await browser.newContext({
    ...(profile.mobile ? devices['iPhone 13 Pro'] : {}),
    viewport: { width: profile.width, height: profile.height },
    ...(profile.mobile ? { screen: { width: profile.width, height: profile.height } } : {}),
    isMobile: profile.mobile,
    hasTouch: profile.mobile,
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  page.on('pageerror', (error) => sink.pageErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') sink.consoleErrors.push(message.text());
  });
  await context.route('**/*', async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    if (url.origin === origin) return route.continue();
    sink.blockedRequests.push({ host: url.host, resourceType: req.resourceType() });
    return route.abort('blockedbyclient');
  });
  await page.goto(`${origin}/${encodeURIComponent(source.file)}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForFunction(() => document.body.classList.contains('gis-mode') && document.querySelector('#gisMapMount [data-role="basemap-menu-toggle"]'), { timeout: 30000 });
  await page.waitForTimeout(500);
  return { context, page };
}

async function readState(page) {
  return page.evaluate(() => {
    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom };
    };
    const root = document.querySelector('#gisMapMount .tile-map');
    const toggle = root?.querySelector('[data-role="basemap-menu-toggle"]');
    const menu = root?.querySelector('[data-role="basemap-menu"]');
    const mgrs = menu?.querySelector('.tlayer-item[data-overlay="mgrs"]');
    const mr = rect(menu);
    const gr = rect(mgrs);
    let mgrsHit = '';
    let mgrsHitTag = '';
    if (gr && gr.width > 0 && gr.height > 0) {
      const x = gr.x + gr.width / 2;
      const y = gr.y + gr.height / 2;
      if (x >= 0 && x < innerWidth && y >= 0 && y < innerHeight) {
        const hit = document.elementFromPoint(x, y);
        mgrsHit = hit?.closest?.('.tlayer-item')?.dataset.overlay || '';
        mgrsHitTag = hit?.tagName?.toLowerCase() || '';
      }
    }
    const hr = rect(document.querySelector('body.gis-mode > header') || document.querySelector('header'));
    const fr = rect(document.querySelector('body.gis-mode > footer'));
    const vv = window.visualViewport;
    const menuVisible = !!menu && !menu.hidden && getComputedStyle(menu).display !== 'none';
    const activeLayers = menu ? [...menu.querySelectorAll('.tlayer-item[data-layer].is-active')].map((el) => el.dataset.layer) : [];
    const activeOverlays = menu ? [...menu.querySelectorAll('.tlayer-item[data-overlay].is-active')].map((el) => el.dataset.overlay) : [];
    const menuFitsViewport = !!mr && menuVisible && mr.x >= 0 && mr.y >= 0 && mr.right <= innerWidth && mr.bottom <= innerHeight;
    const headerVisible = !!hr && hr.width > 0 && hr.height > 0 && hr.bottom > 0 && hr.top < innerHeight;
    const footerVisible = !!fr && fr.width > 0 && fr.height > 0 && fr.bottom > 0 && fr.top < innerHeight;
    const menuFitsSafeArea = menuFitsViewport && (!headerVisible || mr.y >= hr.bottom - 1) && (!footerVisible || mr.bottom <= fr.top + 1);
    return {
      gisReady: document.body.classList.contains('gis-mode'),
      menuVisible,
      toggleExpanded: toggle?.getAttribute('aria-expanded') === 'true',
      toggleRect: rect(toggle),
      menuRect: mr,
      menuStyle: menu ? { position: getComputedStyle(menu).position, maxHeight: getComputedStyle(menu).maxHeight, overflowY: getComputedStyle(menu).overflowY, scrollTop: menu.scrollTop, scrollHeight: menu.scrollHeight, clientHeight: menu.clientHeight } : null,
      mgrsRect: gr,
      mgrsHit,
      mgrsHitTag,
      activeLayers,
      activeOverlays,
      headerRect: hr,
      footerRect: fr,
      viewport: { width: innerWidth, height: innerHeight, visualWidth: vv?.width ?? innerWidth, visualHeight: vv?.height ?? innerHeight },
      menuFitsViewport,
      menuFitsSafeArea,
      positionFunctionPresent: typeof positionBasemapMenuGis === 'function',
      buildLabelVisible: document.body.innerText.includes('build 270') || document.body.innerText.includes('build 268'),
    };
  });
}

async function inputTap(page, profile, x, y) {
  if (profile.mobile) await page.touchscreen.tap(x, y);
  else await page.mouse.click(x, y);
}

function center(box) { return { x: box.x + box.width / 2, y: box.y + box.height / 2 }; }

async function openMenu(page, profile, log, label) {
  const before = await readState(page);
  log.actions.push({ action: `${label}:tap-layer-toggle`, at: center(before.toggleRect), input: profile.mobile ? 'touchscreen.tap' : 'mouse.click' });
  await inputTap(page, profile, ...Object.values(center(before.toggleRect)));
  await page.waitForTimeout(350);
  return readState(page);
}

async function outsideTap(page, profile, log, label) {
  const state = await readState(page);
  const point = { x: Math.min(8, Math.max(1, state.viewport.width - 1)), y: Math.min(state.viewport.height - 24, Math.max(1, state.viewport.height - 24)) };
  log.actions.push({ action: `${label}:tap-outside`, at: point, input: profile.mobile ? 'touchscreen.tap' : 'mouse.click' });
  await inputTap(page, profile, point.x, point.y);
  await page.waitForTimeout(300);
  return readState(page);
}

async function scrollGesture(page, context, profile, state, iteration) {
  const m = state.menuRect;
  const headerBottom = state.headerRect?.bottom || 0;
  const footerTop = state.footerRect?.top || state.viewport.height;
  const top = Math.max(m.y + 10, headerBottom + 2);
  const bottom = Math.min(m.bottom - 8, footerTop - 8, state.viewport.height - 8);
  const startY = Math.max(top + 2, bottom - 8);
  const endY = Math.max(top + 1, startY - Math.max(36, Math.min(100, Math.floor((bottom - top) * 0.8))));
  const x = m.x + m.width / 2;
  if (profile.mobile) {
    const cdp = await context.newCDPSession(page);
    const point = (y) => ({ id: 1, x, y, radiusX: 1, radiusY: 1, force: 1 });
    try {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point(startY)] });
      await page.waitForTimeout(35);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [point(Math.floor(startY + (endY - startY) / 2))] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [point(endY)] });
      await page.waitForTimeout(35);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    } finally { await cdp.detach(); }
  } else {
    await page.mouse.move(x, startY);
    await page.mouse.wheel(0, 180);
  }
  await page.waitForTimeout(140);
  return { iteration, start: { x, y: startY }, end: { x, y: endY }, input: profile.mobile ? 'CDP Input.dispatchTouchEvent swipe' : 'mouse.wheel' };
}

async function tapRow(page, profile, row, log, label) {
  const r = row.rect;
  const point = center(r);
  const x = Math.max(1, Math.min(log.viewport.width - 1, point.x));
  const y = Math.max(1, Math.min(log.viewport.height - 1, point.y));
  const before = await page.evaluate(({ x, y }) => {
    const hit = document.elementFromPoint(x, y);
    return { overlay: hit?.closest?.('.tlayer-item')?.dataset.overlay || '', layer: hit?.closest?.('.tlayer-item')?.dataset.layer || '', tag: hit?.tagName?.toLowerCase() || '' };
  }, { x, y });
  log.actions.push({ action: label, targetCenter: point, at: { x, y }, clamped: x !== point.x || y !== point.y, hitBeforeTap: before, input: profile.mobile ? 'touchscreen.tap' : 'mouse.click' });
  await inputTap(page, profile, x, y);
  await page.waitForTimeout(350);
  return { point, at: { x, y }, hitBeforeTap: before };
}

async function runResizePhase(browser, origin, source, profile, kind, sourceResult) {
  const sink = { pageErrors: [], consoleErrors: [], blockedRequests: [] };
  const { context, page } = await makePage(browser, origin, source, profile, sink);
  const phase = { open: null, changed: null, restored: null, normalizedOpen: null, actions: [] };
  try {
    phase.open = await openMenu(page, profile, phase, `${kind}:open`);
    if (!phase.open.menuVisible) fail(source.key, profile.id, `${kind}.open`, 'menu-opens', JSON.stringify(phase.open));
    const changedSize = kind === 'rotation'
      ? { width: profile.height, height: profile.width }
      : { width: profile.width, height: Math.max(240, profile.height - 32) };
    await page.setViewportSize(changedSize);
    await page.waitForTimeout(450);
    phase.changed = await readState(page);
    phase.screenshotChanged = `${source.key}-${profile.id}-${kind}-changed.png`;
    await page.screenshot({ path: path.join(evidenceRoot, phase.screenshotChanged) });
    const shouldStayOpen = source.key === 'hotfix270';
    if (phase.changed.menuVisible !== shouldStayOpen) fail(source.key, profile.id, `${kind}.changed`, shouldStayOpen ? 'menu-remains-open' : 'baseline-closes-menu', JSON.stringify(phase.changed));
    if (shouldStayOpen && !phase.changed.menuFitsSafeArea) fail(source.key, profile.id, `${kind}.changed`, 'candidate-menu-fits-safe-area', JSON.stringify(phase.changed));

    await page.setViewportSize({ width: profile.width, height: profile.height });
    await page.waitForTimeout(450);
    phase.restored = await readState(page);
    if (phase.restored.menuVisible !== shouldStayOpen) fail(source.key, profile.id, `${kind}.restored`, shouldStayOpen ? 'menu-remains-open' : 'baseline-remains-closed', JSON.stringify(phase.restored));

    // Identical normalization actions for LIVE and candidate: outside tap, then Layer tap.
    await outsideTap(page, profile, phase, `${kind}:normalize`);
    phase.normalizedOpen = await openMenu(page, profile, phase, `${kind}:normalize`);
    if (!phase.normalizedOpen.menuVisible) fail(source.key, profile.id, `${kind}.normalize`, 'menu-reopens', JSON.stringify(phase.normalizedOpen));
    if (phase.normalizedOpen.menuVisible && source.key === 'hotfix270' && !phase.normalizedOpen.menuFitsSafeArea) fail(source.key, profile.id, `${kind}.normalize`, 'candidate-menu-fits-safe-area', JSON.stringify(phase.normalizedOpen));
    if (phase.normalizedOpen.menuVisible) await page.screenshot({ path: path.join(evidenceRoot, `${source.key}-${profile.id}-${kind}-normalized.png`) });

    sourceResult.checks.jsErrors.push(...sink.pageErrors.map((message) => ({ profile: profile.id, phase: kind, message })));
    sourceResult.checks.consoleErrors.push(...sink.consoleErrors.map((message) => ({ profile: profile.id, phase: kind, message })));
    sourceResult.checks.blockedRequestCount += sink.blockedRequests.length;
    sourceResult.checks.blockedHosts.push(...sink.blockedRequests.map((r) => r.host));
    phase.pageErrors = sink.pageErrors;
    phase.consoleErrors = sink.consoleErrors;
    phase.blockedRequestCount = sink.blockedRequests.length;
  } catch (error) {
    phase.error = error.stack || String(error);
    fail(source.key, profile.id, kind, 'phase-completes', phase.error);
  } finally {
    await context.close();
  }
  return phase;
}

async function runInteractionPhase(browser, origin, source, profile, sourceResult) {
  const sink = { pageErrors: [], consoleErrors: [], blockedRequests: [] };
  const { context, page } = await makePage(browser, origin, source, profile, sink);
  const phase = { actions: [], initial: null, basemapTap: null, afterBasemap: null, afterNormalize: null, scrollGestures: [], afterScroll: null, mgrsTap: null, afterMgrsTap: null, afterOutsideClose: null, afterReopen: null, afterFinalClose: null };
  phase.viewport = { width: profile.width, height: profile.height };
  try {
    phase.initial = await openMenu(page, profile, phase, 'interaction');
    phase.buildLabel = await page.evaluate((key) => document.body.innerText.includes(key), source.key === 'hotfix270' ? 'build 270' : 'build 268');
    if (!phase.initial.menuVisible) fail(source.key, profile.id, 'interaction.open', 'menu-opens', JSON.stringify(phase.initial));
    if (!phase.initial.positionFunctionPresent) fail(source.key, profile.id, 'interaction.open', 'position-function-present', 'positionBasemapMenuGis missing');
    if (!phase.buildLabel) fail(source.key, profile.id, 'interaction.open', 'correct-build-label', source.key);
    if (phase.initial.menuVisible && source.key === 'hotfix270' && !phase.initial.menuFitsSafeArea) fail(source.key, profile.id, 'interaction.open', 'candidate-menu-fits-safe-area', JSON.stringify(phase.initial));
    if (profile.id === '720x320-landscape') await page.screenshot({ path: path.join(evidenceRoot, `${source.key}-${profile.id}-open.png`) });

    const baseRow = await page.evaluate(() => {
      const menu = document.querySelector('#gisMapMount [data-role="basemap-menu"]');
      const row = menu?.querySelector('.tlayer-item[data-layer="osmHot"]');
      if (!row) return null;
      const r = row.getBoundingClientRect();
      return { rect: { x: r.x, y: r.y, width: r.width, height: r.height }, visible: r.width > 0 && r.height > 0 && r.top >= 0 && r.bottom <= innerHeight };
    });
    phase.basemapRowFound = !!baseRow;
    if (!baseRow) fail(source.key, profile.id, 'interaction.basemap', 'osmHot-row-present', 'row not found');
    else {
      phase.basemapTap = await tapRow(page, profile, { rect: baseRow.rect }, phase, 'tap-basemap-osmHot');
      phase.afterBasemap = await readState(page);
      phase.basemapSelected = phase.afterBasemap.activeLayers.includes('osmHot');
      if (source.key === 'hotfix270' && !phase.basemapSelected) fail(source.key, profile.id, 'interaction.basemap', 'osmHot-selected', JSON.stringify(phase.afterBasemap));
    }

    // Identical normalization sequence whether selecting the basemap closed the menu or not.
    phase.afterNormalize = await outsideTap(page, profile, phase, 'basemap-normalize');
    phase.afterNormalize = await openMenu(page, profile, phase, 'basemap-normalize');
    if (!phase.afterNormalize.menuVisible) fail(source.key, profile.id, 'interaction.normalize', 'menu-reopens-for-overlay', JSON.stringify(phase.afterNormalize));

    const firstScrollState = await readState(page);
    const targetBefore = firstScrollState.mgrsRect;
    phase.mgrsRowFound = !!targetBefore && targetBefore.width > 0 && targetBefore.height > 0;
    if (!phase.mgrsRowFound) fail(source.key, profile.id, 'interaction.overlay', 'mgrs-row-present', JSON.stringify(firstScrollState));
    let targetReachable = false;
    for (let i = 0; i < 20; i++) {
      const state = await readState(page);
      const hit = state.mgrsHit === 'mgrs' && state.mgrsRect && state.menuRect && state.mgrsRect.y >= state.menuRect.y && state.mgrsRect.bottom <= state.menuRect.bottom;
      if (hit && state.menuStyle.scrollTop > 0) { targetReachable = true; break; }
      if (!state.menuVisible || !state.menuRect) break;
      phase.scrollGestures.push(await scrollGesture(page, context, profile, state, i + 1));
    }
    phase.afterScroll = await readState(page);
    phase.mgrsReachableBeforeTap = phase.afterScroll.mgrsHit === 'mgrs' && phase.afterScroll.mgrsRect && phase.afterScroll.menuRect && phase.afterScroll.mgrsRect.y >= phase.afterScroll.menuRect.y && phase.afterScroll.mgrsRect.bottom <= phase.afterScroll.menuRect.bottom;
    phase.scrollTopAfterGestures = phase.afterScroll.menuStyle?.scrollTop ?? null;
    if (source.key === 'hotfix270' && (!targetReachable || (phase.afterScroll.menuStyle?.scrollTop ?? 0) <= 0 || !phase.mgrsReachableBeforeTap)) fail(source.key, profile.id, 'interaction.overlay-scroll', 'touch-scrolls-menu-and-reveals-mgrs', JSON.stringify(phase.afterScroll));
    if (profile.id === '720x320-landscape') await page.screenshot({ path: path.join(evidenceRoot, `${source.key}-${profile.id}-mgrs-before-tap.png`) });

    if (phase.afterScroll.mgrsRect) {
      phase.mgrsTap = await tapRow(page, profile, { rect: phase.afterScroll.mgrsRect }, phase, 'tap-overlay-mgrs');
      phase.afterMgrsTap = await readState(page);
      phase.mgrsActivated = phase.afterMgrsTap.activeOverlays.includes('mgrs');
      if (source.key === 'hotfix270' && (!phase.mgrsReachableBeforeTap || phase.mgrsTap.hitBeforeTap.overlay !== 'mgrs' || !phase.mgrsActivated)) {
        fail(source.key, profile.id, 'interaction.overlay-tap', 'touch-activates-mgrs', JSON.stringify({ reachable: phase.mgrsReachableBeforeTap, tap: phase.mgrsTap, after: phase.afterMgrsTap }));
      }
    } else {
      fail(source.key, profile.id, 'interaction.overlay-tap', 'tap-attempt-recorded', 'MGRS row missing; no tap coordinate available');
    }
    if (profile.id === '720x320-landscape') await page.screenshot({ path: path.join(evidenceRoot, `${source.key}-${profile.id}-mgrs-after-tap.png`) });

    phase.afterOutsideClose = await outsideTap(page, profile, phase, 'close-external');
    phase.outsideClosed = !phase.afterOutsideClose.menuVisible;
    if (source.key === 'hotfix270' && !phase.outsideClosed) fail(source.key, profile.id, 'interaction.outside-close', 'outside-tap-closes-menu', JSON.stringify(phase.afterOutsideClose));
    phase.afterReopen = await openMenu(page, profile, phase, 'reopen');
    phase.reopened = phase.afterReopen.menuVisible;
    if (source.key === 'hotfix270' && !phase.reopened) fail(source.key, profile.id, 'interaction.reopen', 'layer-tap-reopens-menu', JSON.stringify(phase.afterReopen));
    phase.afterFinalClose = await openMenu(page, profile, phase, 'final-close');
    phase.finalClosed = !phase.afterFinalClose.menuVisible;
    if (source.key === 'hotfix270' && !phase.finalClosed) fail(source.key, profile.id, 'interaction.final-close', 'layer-tap-closes-menu', JSON.stringify(phase.afterFinalClose));

    phase.pageErrors = sink.pageErrors;
    phase.consoleErrors = sink.consoleErrors;
    phase.blockedRequestCount = sink.blockedRequests.length;
    sourceResult.checks.jsErrors.push(...sink.pageErrors.map((message) => ({ profile: profile.id, phase: 'interaction', message })));
    sourceResult.checks.consoleErrors.push(...sink.consoleErrors.map((message) => ({ profile: profile.id, phase: 'interaction', message })));
    sourceResult.checks.blockedRequestCount += sink.blockedRequests.length;
    sourceResult.checks.blockedHosts.push(...sink.blockedRequests.map((r) => r.host));
    if (sink.pageErrors.length) fail(source.key, profile.id, 'interaction.javascript', 'no-page-errors', sink.pageErrors.join(' | '));
  } catch (error) {
    phase.error = error.stack || String(error);
    fail(source.key, profile.id, 'interaction', 'phase-completes', phase.error);
  } finally {
    await context.close();
  }
  return phase;
}

async function runSource(browser, origin, source) {
  const sourceResult = {
    source: source.key,
    input: hashFile(path.join(root, source.file)),
    expected: source.key === 'live268' ? { resize: 'menu closes on rotation and height change' } : { resize: 'menu remains open and fits safe viewport', interactions: 'PASS' },
    checks: { jsErrors: [], consoleErrors: [], blockedRequestCount: 0, blockedHosts: [] },
    profiles: {},
  };
  for (const profile of profiles) {
    const item = { viewport: { width: profile.width, height: profile.height, mobile: profile.mobile } };
    item.rotation = await runResizePhase(browser, origin, source, profile, 'rotation', sourceResult);
    item.heightChange = await runResizePhase(browser, origin, source, profile, 'height-change', sourceResult);
    item.interaction = await runInteractionPhase(browser, origin, source, profile, sourceResult);
    if (sourceResult.checks.jsErrors.length) fail(source.key, profile.id, 'javascript', 'no-uncaught-js-errors', JSON.stringify(sourceResult.checks.jsErrors.filter((x) => x.profile === profile.id)));
    sourceResult.profiles[profile.id] = item;
  }
  sourceResult.checks.blockedHosts = [...new Set(sourceResult.checks.blockedHosts)].sort();
  return sourceResult;
}

function summarize(result) {
  const rows = [];
  for (const [id, p] of Object.entries(result.profiles)) {
    rows.push({
      profile: id,
      rotationMenuOpen: p.rotation.changed?.menuVisible ?? null,
      heightMenuOpen: p.heightChange.changed?.menuVisible ?? null,
      rotationSafe: p.rotation.changed?.menuFitsSafeArea ?? null,
      heightSafe: p.heightChange.changed?.menuFitsSafeArea ?? null,
      basemap: p.interaction.basemapSelected === true,
      mgrsVisibleBeforeTap: p.interaction.mgrsReachableBeforeTap === true,
      mgrsActivated: p.interaction.mgrsActivated === true,
      scrollTop: p.interaction.scrollTopAfterGestures,
      closedOutside: p.interaction.outsideClosed === true,
      reopened: p.interaction.reopened === true,
      finalClosed: p.interaction.finalClosed === true,
      jsErrors: p.rotation.pageErrors?.length + p.heightChange.pageErrors?.length + p.interaction.pageErrors?.length,
    });
  }
  return rows;
}

(async () => {
  fs.mkdirSync(evidenceRoot, { recursive: true });
  const runnerHash = hashFile(__filename);
  for (const source of sources) if (!fs.existsSync(path.join(root, source.file))) throw new Error(`Missing input ${source.file}`);
  const { server, port } = await startLocalServer();
  const origin = `http://127.0.0.1:${port}`;
  let browser;
  let output;
  try {
    browser = await chromium.launch({ headless: true, channel: 'msedge' });
    const results = {};
    for (const source of sources) results[source.key] = await runSource(browser, origin, source);
    output = {
      schema: 'tmart-mobile-layer-replay-v2',
      startedAt: new Date().toISOString(),
      engine: `Microsoft Edge / Chromium ${browser.version()} via Playwright (iPhone 13 Pro UA, touch input for mobile profiles)`,
      runner: runnerHash,
      scenario: { viewportProfiles: profiles, sourcePair: sources.map((s) => s.key), actions: ['open Layer', 'rotate viewport', 'restore', 'outside tap + reopen', 'shrink viewport height', 'restore', 'outside tap + reopen', 'select OSM HOT by input coordinates', 'outside tap + reopen', 'touch-scroll to MGRS', 'tap MGRS by input coordinates', 'outside close', 'reopen', 'close'], network: 'Only the temporary local test-server origin is allowed; all other origins are aborted by Playwright routing.' },
      results,
      failures,
      pass: failures.length === 0,
    };
    fs.writeFileSync(path.join(evidenceRoot, 'replay-results.json'), JSON.stringify(output, null, 2));
    const summary = { schema: output.schema, engine: output.engine, pass: output.pass, failureCount: failures.length, runner: runnerHash, inputs: Object.fromEntries(Object.entries(results).map(([key, value]) => [key, value.input])), results: Object.fromEntries(Object.entries(results).map(([key, value]) => [key, summarize(value)])), failures };
    fs.writeFileSync(path.join(evidenceRoot, 'replay-summary.json'), JSON.stringify(summary, null, 2));
    process.stdout.write(JSON.stringify(summary, null, 2));
  } finally {
    const cleanupErrors = [];
    const serverClosed = new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
    server.closeIdleConnections?.();
    server.closeAllConnections?.();
    try { await boundedCleanup(serverClosed, 'HTTP server', 10000); }
    catch (error) { cleanupErrors.push(error); }
    if (browser) {
      try { await boundedCleanup(browser.close(), 'Edge browser', 20000); }
      catch (error) { cleanupErrors.push(error); }
    }
    if (cleanupErrors.length) throw new Error(cleanupErrors.map((error) => error.message).join('; '));
  }
  if (failures.length) process.exitCode = 1;
})().catch((error) => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
