// Load candidate with ?debug so runSelfCheck() runs at boot; collect console.assert failures.
const fs = require("fs");
const http = require("http");
const { chromium } = require("C:/goi-pw-probe/node_modules/playwright");
(async () => {
  const bytes = fs.readFileSync(process.argv[2]);
  const server = http.createServer((q, r) => { r.setHeader("Content-Type", "text/html; charset=utf-8"); r.end(bytes); });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const browser = await chromium.launch({ executablePath: "C:/Users/Utente/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe", headless: true });
  const asserts = [], errors = [], selfLogs = [];
  try {
    const ctx = await browser.newContext();
    await ctx.route("**/*", (r) => (r.request().url().startsWith("http://127.0.0.1:") ? r.continue() : r.abort()));
    const page = await ctx.newPage();
    page.on("console", (m) => { const t = m.text(); if (/Assertion failed/i.test(t)) asserts.push(t.slice(0, 200)); else if (/self-?check/i.test(t)) selfLogs.push(t.slice(0, 200)); });
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("http://127.0.0.1:" + server.address().port + "/?debug", { waitUntil: "load" });
    await page.waitForTimeout(3000);
    const build = await page.evaluate(() => ({ id: APP_BUILD_ID, num: APP_BUILD_NUM }));
    const out = { build, assertFailures: asserts, pageErrors: errors, selfLogs };
    fs.writeFileSync(process.argv[3], JSON.stringify(out, null, 2));
    console.log(JSON.stringify(out));
  } finally { await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
