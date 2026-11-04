const { chromium, devices } = require('C:/goi-pw-probe/node_modules/playwright');

const url = 'http://100.99.54.93:8000/coordinate_converter%20Claude.html?v=273';
const sizes = [{ width: 844, height: 390 }, { width: 667, height: 375 }];

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const results = [];
  try {
    for (const size of sizes) {
      const context = await browser.newContext({ ...devices['iPhone 13 Pro'], viewport: size, screen: size, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
      const page = await context.newPage();
      const pageErrors = [];
      page.on('pageerror', e => pageErrors.push(e.message));
      await page.route('**/*', route => new URL(route.request().url()).origin === 'http://100.99.54.93:8000' ? route.continue() : route.abort('blockedbyclient'));
      const result = { viewport: size, pageErrors };
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForFunction(() => document.body.classList.contains('gis-mode') && document.querySelector('#gisMapMount [data-role="basemap-menu-toggle"]'), { timeout: 60000 });
        result.build = await page.evaluate(() => ({ id: APP_BUILD_ID, num: APP_BUILD_NUM }));
        result.heights = [];
        for (const height of [size.height, size.height - 22, size.height - 8, size.height - 34, size.height - 15, size.height - 30, size.height]) {
          await page.setViewportSize({ width: size.width, height });
          await page.waitForTimeout(45);
          result.heights.push(await page.evaluate(() => {
            const map = document.querySelector('.gis-map-mount');
            const header = document.querySelector('body.gis-mode > header');
            return { viewportHeight: innerHeight, mapHeight: map.getBoundingClientRect().height, headerHeight: header.getBoundingClientRect().height, mapTransitionDuration: getComputedStyle(map).transitionDuration, headerTransitionDuration: getComputedStyle(header).transitionDuration };
          }));
        }
        const layer = page.locator('#gisMapMount [data-role="basemap-menu-toggle"]');
        let rect = await layer.boundingBox();
        await page.touchscreen.tap(rect.x + rect.width / 2, rect.y + rect.height / 2);
        result.layerOpenAfterResizeStress = await page.locator('#gisMapMount [data-role="basemap-menu"]').evaluate(el => !el.hidden && getComputedStyle(el).display !== 'none');
        await page.touchscreen.tap(8, 60);
        const toolbar = page.locator('#gisMobileToolbarToggle');
        rect = await toolbar.boundingBox();
        result.toolbarToggleVisible = !!rect;
        await page.touchscreen.tap(rect.x + rect.width / 2, rect.y + rect.height / 2);
        result.toolbarCollapsed = await page.evaluate(() => document.body.classList.contains('gis-mobile-toolbar-collapsed'));
        rect = await toolbar.boundingBox();
        await page.touchscreen.tap(rect.x + rect.width / 2, rect.y + rect.height / 2);
        result.toolbarRestored = await page.evaluate(() => !document.body.classList.contains('gis-mobile-toolbar-collapsed'));
        result.pageErrors = pageErrors;
        result.pass = result.build?.num === 273 && result.heights.every(s => Math.abs(s.mapHeight - (s.viewportHeight - 48)) <= 1 && s.headerHeight === 48 && s.mapTransitionDuration === '0s' && s.headerTransitionDuration === '0s') && result.layerOpenAfterResizeStress && result.toolbarToggleVisible && result.toolbarCollapsed && result.toolbarRestored && pageErrors.length === 0;
      } catch (error) {
        result.error = String(error && error.stack || error);
        result.pass = false;
      } finally {
        await context.close();
      }
      results.push(result);
    }
  } finally {
    await browser.close();
  }
  const output = { schema: 'tmart-build273-vps-postdeploy', engine: 'Microsoft Edge / Chromium with iPhone touch emulation', limitation: 'Not physical iOS Safari; external map providers blocked.', results, pass: results.length === sizes.length && results.every(r => r.pass) };
  require('node:fs').writeFileSync(require('node:path').join(__dirname, 'postdeploy-results.json'), JSON.stringify(output, null, 2) + '\n');
  console.log(JSON.stringify({ pass: output.pass, results: results.map(r => ({ viewport: r.viewport, build: r.build, pass: r.pass, layerOpenAfterResizeStress: r.layerOpenAfterResizeStress, toolbarToggleVisible: r.toolbarToggleVisible, toolbarCollapsed: r.toolbarCollapsed, toolbarRestored: r.toolbarRestored, error: r.error })) }, null, 2));
  if (!output.pass) process.exitCode = 1;
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
