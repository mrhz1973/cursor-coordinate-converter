const fs = require('node:fs');
const crypto = require('node:crypto');
const { chromium } = require('C:/goi-pw-probe/node_modules/playwright');

const appPath = 'C:/Users/Utente/Documents/Codex/2026-10-28/gi/work/mart-gis/coordinate_converter Claude.html';
const expectedSha256 = '32f2b7a65310d69e405d1102b753b10a7adcda4b7efad629d3042e25dc397b28';
const appUrl = 'https://app.invalid/';
const bytes = fs.readFileSync(appPath);
const runtimeSha256 = crypto.createHash('sha256').update(bytes).digest('hex');
if (runtimeSha256 !== expectedSha256) throw new Error('Runtime SHA mismatch; setup check stopped.');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/Utente/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe' });
  const context = await browser.newContext();
  const page = await context.newPage();
  let blockedRequests = 0;
  let disallowedProviderRoutes = 0;
  await context.route('**/*', async route => {
    const request = route.request();
    if (request.url() === appUrl) return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: bytes });
    blockedRequests++;
    try {
      const url = new URL(request.url());
      if ((url.hostname === 'graphhopper.com' && url.pathname === '/api/1/route') ||
          (url.hostname === 'api.openrouteservice.org' && url.pathname.startsWith('/v2/directions/'))) disallowedProviderRoutes++;
    } catch { /* no raw request details are retained */ }
    return route.abort('blockedbyclient').catch(() => {});
  });

  const result = { runtimeSha256, appLoaded: false, routingUiAvailable: false, profileOptions: [], panelOpened: false, calculateButtonVisible: false, calculateButtonDisabled: null, blockedRequests: 0, disallowedProviderRoutes: 0, outcome: null };
  try {
    await page.goto(appUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(500);
    result.appLoaded = await page.evaluate(() => document.readyState === 'complete' && !!document.querySelector('#routingPlannerPanel'));
    result.routingUiAvailable = await page.evaluate(() => typeof openRoutingPlannerPanel === 'function' && typeof state !== 'undefined' && !!state._routing);
    if (result.routingUiAvailable) {
      await page.evaluate(() => window.openRoutingPlannerPanel('graphhopper'));
      result.panelOpened = await page.locator('#routingPlannerPanel[open]').count().then(x => x === 1).catch(() => false);
      result.profileOptions = await page.locator('#routingProfileSelect option').evaluateAll(xs => xs.map(x => x.value).filter(Boolean)).catch(() => []);
      result.calculateButtonVisible = await page.locator('#routingCalculateBtn').count().then(x => x === 1).catch(() => false);
      result.calculateButtonDisabled = await page.locator('#routingCalculateBtn').isDisabled().catch(() => null);
    }
    result.outcome = result.appLoaded && result.routingUiAvailable && result.panelOpened ? 'UI_READY_METADATA_BLOCKED' : 'UI_NOT_READY';
  } catch (error) {
    result.outcome = error?.name === 'TimeoutError' ? 'UI_SETUP_TIMEOUT' : 'UI_SETUP_FAILED_REDACTED';
  } finally {
    result.blockedRequests = blockedRequests;
    result.disallowedProviderRoutes = disallowedProviderRoutes;
    await context.close();
    await browser.close();
  }

  fs.writeFileSync(__dirname + '/setup-check.json', JSON.stringify(result, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify(result, null, 2));
})().catch(() => { console.error('Redacted setup-check failure.'); process.exitCode = 1; });
