const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { pathToFileURL } = require('node:url');
const assert = require('node:assert/strict');

const root = 'C:/Users/Utente/Documents/Codex/2026-10-28/gi/work/mart-gis';
const runtime = path.join(root, 'coordinate_converter Claude.html');
const bytes = fs.readFileSync(runtime);
const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const profile = path.join(root, 'work', 'mgrs-cell-validity', `edge-${process.pid}-${Date.now()}`);
fs.mkdirSync(profile, { recursive: true });
const portFile = path.join(profile, 'DevToolsActivePort');
const proc = spawn(edge, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--disable-background-networking', '--host-resolver-rules=MAP * ~NOTFOUND',
  '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'
], { windowsHide: true, stdio: 'ignore' });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main(){
  for (let i = 0; i < 300 && !fs.existsSync(portFile); i++) await sleep(100);
  assert(fs.existsSync(portFile), 'Edge DevTools did not start');
  const port = Number(fs.readFileSync(portFile, 'utf8').split(/\r?\n/)[0]);
  const pages = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  const ws = new WebSocket(pages.find((x) => x.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  let id = 0;
  const pending = new Map();
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const [resolve, reject] = pending.get(message.id);
    pending.delete(message.id);
    message.error ? reject(new Error(JSON.stringify(message.error))) : resolve(message.result);
  };
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const current = ++id;
    pending.set(current, [resolve, reject]);
    ws.send(JSON.stringify({ id: current, method, params }));
  });
  const evaluate = async (expression) => {
    const result = await call('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };
  await call('Runtime.enable');
  await call('Page.enable');
  await call('Network.enable');
  await call('Network.setBlockedURLs', { urls: ['http://*', 'https://*'] });
  await call('Page.navigate', { url: `${pathToFileURL(runtime).href}?mgrs_qa=${Date.now()}` });
  let ready = false;
  for (let i = 0; i < 300; i++) {
    await sleep(100);
    ready = await evaluate('document.readyState === "complete" && typeof parseMGRS === "function" && typeof doConvert === "function"');
    if (ready) break;
  }
  assert(ready, 'app did not become ready');

  const result = await evaluate(`(()=>{
    const check=(ok,msg)=>{if(!ok)throw Error(msg)};
    const input=document.getElementById('mgrs-input');
    const error=document.getElementById('errorBox');
    const paste=document.getElementById('pasteInput');
    const pasteStatus=document.getElementById('pasteStatus');
    document.querySelector('.tab[data-tab="mgrs"]').click();
    const invalid=['38VMS','38NPE','38MPF','32NNA0000000000','32MNF0000050000','32MNF0000000000'];
    for(const raw of invalid){
      const prior=state.lastResult;
      input.value=raw;doConvert();
      check(!error.hidden && error.textContent.trim(), 'Converti accepted invalid MGRS '+raw);
      check(state.lastResult===prior, 'failed Converti replaced result for '+raw);
      paste.value=raw;doPasteDetect();
      check(pasteStatus.className==='err', 'Paste accepted invalid MGRS '+raw);
      check(classifyGeoSearchInput('MGRS '+raw).kind==='coord_invalid', 'Cerca classified invalid MGRS as valid '+raw);
    }
    const valid=['38VLS','38WLS','38MPE','38NPF'];
    const converted=[];
    for(const raw of valid){
      input.value=raw;doConvert();
      check(error.hidden, 'Converti rejected valid boundary MGRS '+raw);
      check(Number.isFinite(state.lastResult.lat)&&Number.isFinite(state.lastResult.lon), 'invalid result coordinates '+raw);
      check(state.lastResult.mgrsSource&&state.lastResult.mgrsSource.raw===raw, 'source not preserved for '+raw);
      const searched=classifyGeoSearchInput('MGRS '+raw);
      check(searched.kind==='coord_valid'&&Number.isFinite(searched.det.lat), 'Cerca rejected valid MGRS '+raw);
      paste.value=raw;doPasteDetect();
      check(pasteStatus.className==='ok'&&state.lastResult.mgrsSource.raw===raw, 'Paste rejected valid MGRS '+raw);
      converted.push({raw,lat:state.lastResult.lat,lon:state.lastResult.lon});
    }
    return {result:'PASS',invalid,valid:converted,search:'all valid and invalid fixtures correctly classified',paste:'all valid and invalid fixtures correctly handled'};
  })()`);
  ws.close();
  console.log(JSON.stringify({runtimeSha256:sha256, browser:'Edge headless; HTTP/HTTPS blocked', ...result}, null, 2));
}

main().catch((error) => { console.error(error.stack || error); proc.kill(); process.exitCode = 1; }).finally(async () => {
  if (proc.exitCode !== 1) proc.kill();
});
