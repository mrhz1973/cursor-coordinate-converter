const fs = require('node:fs');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { chromium } = require('C:/goi-pw-probe/node_modules/playwright');

const appPath = 'C:/Users/Utente/Documents/Codex/2026-10-28/gi/work/mart-gis/coordinate_converter Claude.html';
const expectedSha256 = '32f2b7a65310d69e405d1102b753b10a7adcda4b7efad629d3042e25dc397b28';
const appUrl = 'http://100.99.54.93:8000/coordinate_converter%20Claude.html';
const appOrigin = 'http://100.99.54.93:8000';
const originHeader = `Origin: ${appOrigin}`;

const appBytes = fs.readFileSync(appPath);
const runtimeSha256 = crypto.createHash('sha256').update(appBytes).digest('hex');
if (runtimeSha256 !== expectedSha256) throw new Error('Runtime SHA mismatch; diagnostic stopped.');

function endpointFor(rawUrl, method) {
  try {
    const u = new URL(rawUrl);
    if (u.protocol === 'http:' && u.hostname === '100.99.54.93' && u.port === '8989') {
      if (u.pathname === '/info' && ['GET', 'OPTIONS'].includes(method)) return { provider: 'GraphHopper', endpoint: '/info' };
      if (u.pathname === '/route' && method === 'OPTIONS') return { provider: 'GraphHopper', endpoint: '/route' };
    }
    if (u.protocol === 'https:' && u.hostname === 'ionos-n8n-new.tailc01234.ts.net' && (u.port === '' || u.port === '443')) {
      if (u.pathname === '/ors/status' && ['GET', 'OPTIONS'].includes(method)) return { provider: 'ORS', endpoint: '/ors/status' };
      if (u.pathname === '/ors/v2/directions/foot-hiking/geojson' && method === 'OPTIONS') {
        return { provider: 'ORS', endpoint: '/ors/v2/directions/{profile}/geojson' };
      }
    }
  } catch { /* deny malformed URLs without retaining their contents */ }
  return null;
}

function safeFailureCode(value) {
  const s = String(value || '').toUpperCase();
  const m = s.match(/(?:NET::)?ERR_[A-Z0-9_]+/);
  return m ? `ERR_${m[0].replace(/^NET::ERR_/, '').replace(/^ERR_/, '')}` : 'UNCLASSIFIED_NETWORK_FAILURE';
}

function classifyConsole(text) {
  const s = String(text || '').toLowerCase();
  const code = s.match(/(?:net::)?err_[a-z0-9_]+/i)?.[0];
  let category = 'OTHER';
  let reason = null;
  if (s.includes('err_blocked_by_client')) category = 'HARNESS_BLOCKED';
  else if (s.includes('access-control-allow-private-network')) { category = 'PRIVATE_NETWORK_ACCESS'; reason = 'PRIVATE_NETWORK_ALLOW_HEADER'; }
  else if (s.includes('private network') || s.includes('private-network')) { category = 'PRIVATE_NETWORK_ACCESS'; reason = 'PRIVATE_NETWORK_POLICY'; }
  else if (s.includes('local network') || s.includes('local-network')) { category = 'LOCAL_NETWORK_ACCESS'; reason = 'LOCAL_NETWORK_POLICY'; }
  else if (s.includes('preflight') && s.includes('access-control')) { category = 'CORS'; reason = 'CORS_PREFLIGHT_REJECTED'; }
  else if (s.includes('no \'access-control-allow-origin\'') || s.includes('access-control-allow-origin header is missing')) { category = 'CORS'; reason = 'CORS_ALLOW_ORIGIN_MISSING'; }
  else if (s.includes('access-control-allow-origin') && s.includes('multiple values')) { category = 'CORS'; reason = 'CORS_ALLOW_ORIGIN_DUPLICATE'; }
  else if (s.includes('origin') && s.includes('not allowed by access-control-allow-origin')) { category = 'CORS'; reason = 'CORS_ORIGIN_NOT_ALLOWED'; }
  else if (s.includes('cors')) { category = 'CORS'; reason = 'CORS_POLICY'; }
  else if (s.includes('mixed content')) { category = 'MIXED_CONTENT'; reason = 'MIXED_CONTENT_POLICY'; }
  else if (s.includes('certificate') || s.includes('ssl') || s.includes('tls')) { category = 'TLS'; reason = 'TLS_OR_CERTIFICATE'; }
  return { category, reason, errorCode: code ? safeFailureCode(code) : null };
}

function curlProbe(label, method, url, preflightMethod = null, preflightHeaders = null, privateNetwork = false) {
  const args = [
    '--silent', '--show-error', '--max-time', '8', '--request', method,
    '--dump-header', '-', '--output', 'NUL', '--write-out', '\n__HTTP__:%{http_code}\n', url,
    '-H', originHeader,
  ];
  if (preflightMethod) args.push('-H', `Access-Control-Request-Method: ${preflightMethod}`);
  if (preflightHeaders) args.push('-H', `Access-Control-Request-Headers: ${preflightHeaders}`);
  if (privateNetwork) args.push('-H', 'Access-Control-Request-Private-Network: true');
  const run = spawnSync('curl.exe', args, { encoding: 'utf8', windowsHide: true, timeout: 10000 });
  const stdout = run.stdout || '';
  const statuses = [...stdout.matchAll(/^HTTP\/\S+\s+(\d{3})/gm)].map(m => Number(m[1]));
  const selected = {};
  for (const line of stdout.split(/\r?\n/)) {
    const m = line.match(/^(access-control-allow-origin|access-control-allow-methods|access-control-allow-headers|access-control-allow-private-network|access-control-max-age|vary):\s*(.*)$/i);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const val = m[2].trim();
    if (key === 'access-control-allow-origin') selected.allowOrigin = val;
    else if (key === 'access-control-allow-methods') selected.allowMethods = val;
    else if (key === 'access-control-allow-headers') selected.allowHeaders = val;
    else if (key === 'access-control-allow-private-network') selected.allowPrivateNetwork = val;
    else if (key === 'access-control-max-age') selected.maxAge = val;
    else if (key === 'vary') selected.vary = val;
  }
  const codeMatch = String(run.stderr || '').match(/(?:curl:\s*\(\d+\)\s*)?([A-Z][A-Z0-9 _-]*(?:CERTIFICATE|TLS|SSL|TIMEOUT|RESOLVE|CONNECT|NETWORK)[A-Z0-9 _-]*)/i);
  return {
    label,
    method,
    status: statuses.length ? statuses[statuses.length - 1] : null,
    curlExitCode: Number.isInteger(run.status) ? run.status : null,
    errorCode: run.status === 0 ? null : (codeMatch ? codeMatch[1].trim().replace(/\s+/g, '_').toUpperCase() : 'CURL_TRANSPORT_FAILURE'),
    cors: selected,
  };
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Users/Utente/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  const browserResult = {
    browserVersion: browser.version(),
    pageLoadedAtExpectedOrigin: false,
    calls: [],
    responses: [],
    failures: [],
    consoleErrors: [],
    harnessBlockedConsoleCount: 0,
    cdpFailures: [],
    blockedOtherCount: 0,
  };

  const cdp = await context.newCDPSession(page);
  const cdpRequests = new Map();
  await cdp.send('Network.enable');
  cdp.on('Network.requestWillBeSent', event => {
    const meta = endpointFor(event.request.url, event.request.method);
    if (meta) cdpRequests.set(event.requestId, { provider: meta.provider, method: event.request.method, endpoint: meta.endpoint });
  });
  cdp.on('Network.loadingFailed', event => {
    const meta = cdpRequests.get(event.requestId);
    if (!meta) return;
    browserResult.cdpFailures.push({ ...meta, errorCode: safeFailureCode(event.errorText),
      corsError: event.corsErrorStatus?.corsError || null,
      corsFailedParameter: event.corsErrorStatus?.failedParameter || null,
      blockedReason: event.blockedReason || null });
  });

  page.on('request', request => {
    const meta = endpointFor(request.url(), request.method());
    if (meta) browserResult.calls.push({ provider: meta.provider, method: request.method(), endpoint: meta.endpoint });
  });
  page.on('response', response => {
    const meta = endpointFor(response.url(), response.request().method());
    if (!meta) return;
    response.allHeaders().then(headers => {
      const cors = {};
      for (const [header, key] of [
        ['access-control-allow-origin', 'allowOrigin'],
        ['access-control-allow-methods', 'allowMethods'],
        ['access-control-allow-headers', 'allowHeaders'],
        ['access-control-allow-private-network', 'allowPrivateNetwork'],
        ['vary', 'vary'],
      ]) if (headers[header]) cors[key] = headers[header];
      browserResult.responses.push({ provider: meta.provider, method: response.request().method(), endpoint: meta.endpoint, status: response.status(), cors });
    }).catch(() => {});
  });
  page.on('requestfailed', request => {
    const meta = endpointFor(request.url(), request.method());
    if (!meta) return;
    browserResult.failures.push({ provider: meta.provider, method: request.method(), endpoint: meta.endpoint,
      errorCode: safeFailureCode(request.failure()?.errorText) });
  });
  page.on('console', message => {
    if (message.type() !== 'error') return;
    const classified = classifyConsole(message.text());
    if (classified.category === 'HARNESS_BLOCKED') browserResult.harnessBlockedConsoleCount++;
    else browserResult.consoleErrors.push(classified);
  });

  await context.route('**/*', async route => {
    const request = route.request();
    const u = new URL(request.url());
    if (u.origin === appOrigin && u.pathname === '/coordinate_converter%20Claude.html' && request.method() === 'GET') {
      return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: appBytes });
    }
    const meta = endpointFor(request.url(), request.method());
    if (meta) return route.continue();
    browserResult.blockedOtherCount++;
    return route.abort('blockedbyclient').catch(() => {});
  });

  let fetchChecks = [];
  try {
    await page.goto(appUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
    browserResult.pageLoadedAtExpectedOrigin = await page.evaluate(expected => location.origin === expected, appOrigin);
    fetchChecks = await page.evaluate(async () => {
      const probes = [
        { provider: 'GraphHopper', endpoint: '/info', url: 'http://100.99.54.93:8989/info', method: 'GET' },
        { provider: 'ORS', endpoint: '/ors/status', url: 'https://ionos-n8n-new.tailc01234.ts.net/ors/status', method: 'GET' },
        { provider: 'GraphHopper', endpoint: '/route', url: 'http://100.99.54.93:8989/route', method: 'OPTIONS' },
        { provider: 'ORS', endpoint: '/ors/v2/directions/{profile}/geojson', url: 'https://ionos-n8n-new.tailc01234.ts.net/ors/v2/directions/foot-hiking/geojson', method: 'OPTIONS' },
      ];
      const out = [];
      for (const p of probes) {
        try {
          const r = await fetch(p.url, { method: p.method, mode: 'cors', credentials: 'omit', cache: 'no-store' });
          out.push({ provider: p.provider, method: p.method, endpoint: p.endpoint, result: 'HTTP_RESPONSE', status: r.status, responseType: r.type });
        } catch (e) {
          out.push({ provider: p.provider, method: p.method, endpoint: p.endpoint, result: 'FETCH_REJECTED', errorName: e?.name || 'Error' });
        }
      }
      return out;
    });
  } catch (e) {
    browserResult.navigationFailure = e?.name === 'TimeoutError' ? 'NAVIGATION_TIMEOUT' : 'NAVIGATION_FAILED';
  }

  await new Promise(resolve => setTimeout(resolve, 500));
  await context.close();
  await browser.close();

  const curlResults = [
    curlProbe('GH /info', 'GET', 'http://100.99.54.93:8989/info'),
    curlProbe('GH /route CORS preflight only', 'OPTIONS', 'http://100.99.54.93:8989/route', 'POST', 'content-type'),
    curlProbe('GH /info private-network preflight only', 'OPTIONS', 'http://100.99.54.93:8989/info', 'GET', null, true),
    curlProbe('ORS /status', 'GET', 'https://ionos-n8n-new.tailc01234.ts.net/ors/status'),
    curlProbe('ORS foot-hiking CORS preflight only', 'OPTIONS', 'https://ionos-n8n-new.tailc01234.ts.net/ors/v2/directions/foot-hiking/geojson', 'POST', 'content-type'),
    curlProbe('ORS /status private-network preflight only', 'OPTIONS', 'https://ionos-n8n-new.tailc01234.ts.net/ors/status', 'GET', null, true),
  ];

  const report = {
    status: 'DIAGNOSTIC_ONLY_NO_ROUTE_POST',
    runtimeSha256,
    appOrigin,
    networkScope: 'Exact provider GET and OPTIONS only. No route POST, response body, query string, request header, credential or secret captured.',
    browser: { ...browserResult, fetchChecks },
    curl: curlResults,
    limits: [
      'A successful GET/OPTIONS does not prove a browser route POST or route response works.',
      'No browser security setting, TLS behavior, app, service, ACL, gateway or provider configuration was changed.',
    ],
  };
  fs.writeFileSync(__dirname + '/result.json', JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify({ status: report.status, browserVersion: browserResult.browserVersion, fetchChecks,
    responses: browserResult.responses, failures: browserResult.failures, consoleErrors: browserResult.consoleErrors, curl: curlResults }, null, 2));
}

main().catch(() => {
  console.error('Browser metadata diagnostic stopped; details redacted.');
  process.exitCode = 1;
});
