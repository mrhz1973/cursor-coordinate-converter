const fs = require('node:fs');
const crypto = require('node:crypto');
const { chromium } = require('C:/goi-pw-probe/node_modules/playwright');

const appPath = 'C:/Users/Utente/Documents/Codex/2026-10-28/gi/work/mart-gis/coordinate_converter Claude.html';
const expectedSha256 = '32f2b7a65310d69e405d1102b753b10a7adcda4b7efad629d3042e25dc397b28';
const appUrl = 'https://app.invalid/';
const coordinates = [[9.8236, 44.1024], [9.829, 44.107]];
const bytes = fs.readFileSync(appPath);
const runtimeSha256 = crypto.createHash('sha256').update(bytes).digest('hex');
if (runtimeSha256 !== expectedSha256) throw new Error('Runtime SHA mismatch; check stopped.');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/Utente/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe' });
  const context = await browser.newContext();
  const page = await context.newPage();
  let blockedRequests = 0;
  await context.route('**/*', async route => {
    if (route.request().url() === appUrl) return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: bytes });
    blockedRequests++;
    return route.abort('blockedbyclient').catch(() => {});
  });
  let result;
  try {
    await page.goto(appUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(400);
    await page.evaluate(() => openRoutingPlannerPanel('graphhopper'));
    await page.waitForSelector('#routingPlannerPanel[open]', { timeout: 10000 });
    await page.locator('#routingProfileSelect').selectOption('hiking');
    const pointsAccepted = await page.evaluate(coords => {
      const routing = typeof state !== 'undefined' ? state._routing : null;
      if (!routing?.points || routing.points.length < 2) return false;
      coords.forEach(([lon, lat], i) => routingSetPointCoordinates(routing.points[i].id, lat, lon, 'map'));
      routingSyncCalculateBtnUi();
      return true;
    }, coordinates);
    await page.waitForTimeout(250);
    result = await page.evaluate(() => ({
      pointsAccepted: true,
      pointCount: state._routing.points.length,
      pointsHaveCoordinates: state._routing.points.slice(0, 2).every(p => Number.isFinite(p.lat) && Number.isFinite(p.lon)),
      opsecStrict: !!state.opsecStrict,
      forceOffline: !!state.forceOffline,
      calculateButtonDisabled: !!document.querySelector('#routingCalculateBtn')?.disabled,
      selectedProfile: document.querySelector('#routingProfileSelect')?.value || null,
    }));
    result.pointsAccepted = pointsAccepted;
    result.runtimeSha256 = runtimeSha256;
    result.blockedRequests = blockedRequests;
    result.outcome = result.calculateButtonDisabled ? 'CALCULATE_UI_GATE_REMAINS_DISABLED' : 'UI_GATE_READY';
  } catch (error) {
    result = { runtimeSha256, blockedRequests, outcome: error?.name === 'TimeoutError' ? 'UI_CHECK_TIMEOUT' : 'UI_CHECK_FAILED_REDACTED' };
  } finally {
    await context.close();
    await browser.close();
  }
  fs.writeFileSync(__dirname + '/after-coordinates-check.json', JSON.stringify(result, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify(result, null, 2));
})().catch(() => { console.error('Redacted UI check failure.'); process.exitCode = 1; });
