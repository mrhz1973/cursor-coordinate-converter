const cdpPort = 19391;
const targetList = await (await fetch(`http://127.0.0.1:${cdpPort}/json/list`)).json();
const target = targetList.find((x) => x.type === 'page' && (x.url.includes('coordinate_converter') || x.url.includes('qa_import_candidate')));
if (!target) throw new Error('isolated app page was not found');
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let nextId = 0;
const pending = new Map();
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message);
    pending.delete(message.id);
  }
};
const command = (method, params = {}) => new Promise((resolve) => {
  const id = ++nextId;
  pending.set(id, resolve);
  ws.send(JSON.stringify({ id, method, params }));
});
const evaluate = async (expression) => {
  const message = await command('Runtime.evaluate', {
    expression, awaitPromise: true, returnByValue: true
  });
  if (message.error) throw new Error(JSON.stringify(message.error));
  if (message.result?.exceptionDetails) throw new Error(message.result.exceptionDetails.text);
  return message.result?.result?.value;
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
await command('Page.enable');
await evaluate(`location.href='http://127.0.0.1:18391/coordinate_converter%20Claude.html?qa_import_run=2026110301'`);
await sleep(1800);
const readiness = await evaluate(`JSON.stringify({title:document.title,ready:document.readyState,input:!!document.getElementById('wbImportHubFile'),state:gisImportHubEnsureState().phase})`);
const initial = JSON.parse(readiness);
if (!initial.input || initial.ready !== 'complete') throw new Error('candidate app did not become ready: ' + readiness);
const geoJson = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { name: 'QA waypoint' }, geometry: { type: 'Point', coordinates: [12.49, 41.89] } },
    { type: 'Feature', properties: { name: 'QA track' }, geometry: { type: 'LineString', coordinates: [[12.49, 41.89], [12.50, 41.90]] } },
    { type: 'Feature', properties: { name: 'QA polygon' }, geometry: { type: 'Polygon', coordinates: [[[12.49, 41.89], [12.50, 41.89], [12.50, 41.90], [12.49, 41.89]]] } }
  ]
};
const setFileExpr = (transport) => `(()=>{const input=document.getElementById('wbImportHubFile');const geo=${JSON.stringify(geoJson)};const file=new File([JSON.stringify(geo)],'qa-roundtrip.geojson',{type:'application/geo+json'});const dt=new DataTransfer();dt.items.add(file);if(${JSON.stringify(transport)}==='picker'){input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));return {before:1,immediate:input.files.length}}const drop=document.getElementById('wbImportHubDrop');drop.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:dt}));return {before:dt.files.length,immediate:dt.files.length}})()`;
const waitPreview = async () => JSON.parse(await evaluate(`(async()=>{for(let i=0;i<80;i++){const h=gisImportHubEnsureState();if(h.phase==='preview'||h.phase==='error')break;await new Promise(r=>setTimeout(r,25))}const h=gisImportHubEnsureState();return JSON.stringify({phase:h.phase,fileCount:h.files.length,totals:h.totals,firstError:h.files[0]?.error||'',status:h.status,applyDisabled:document.getElementById('wbImportHubApplyBtn').disabled})})()`));
const pickerEvent = await evaluate(setFileExpr('picker'));
await sleep(400);
const pickerPreview = await waitPreview();
if (pickerPreview.phase !== 'preview' || pickerPreview.totals.waypoints !== 1 || pickerPreview.totals.tracks !== 1 || pickerPreview.totals.polygons !== 1 || pickerPreview.applyDisabled) throw new Error('picker preview did not include all geometries: ' + JSON.stringify(pickerPreview));
await evaluate(`document.getElementById('wbImportHubApplyBtn').click()`);
await sleep(500);
const firstApply = JSON.parse(await evaluate(`JSON.stringify({phase:gisImportHubEnsureState().phase,status:gisImportHubEnsureState().status,statusKind:gisImportHubEnsureState().statusKind,persisted:gisImportHubReadPersistedCanonicalSnapshot().ok,counts:(()=>{const p=gisImportHubReadPersistedCanonicalSnapshot();return {waypoints:p.mapWaypoints.length,tracks:p.savedTracks.length,polygons:p.gisPolygons.length}})()})`));
if (firstApply.statusKind !== 'ok' || firstApply.counts.waypoints !== 1 || firstApply.counts.tracks !== 1 || firstApply.counts.polygons !== 1) throw new Error('first apply/persist did not preserve all categories: ' + JSON.stringify(firstApply));
await command('Page.reload', { ignoreCache: true });
await sleep(1800);
const afterReload = JSON.parse(await evaluate(`JSON.stringify({title:document.title,ready:document.readyState,counts:(()=>{const p=gisImportHubReadPersistedCanonicalSnapshot();return {ok:p.ok,waypoints:p.mapWaypoints.length,tracks:p.savedTracks.length,polygons:p.gisPolygons.length}})()})`));
if (!afterReload.counts.ok || afterReload.counts.waypoints !== 1 || afterReload.counts.tracks !== 1 || afterReload.counts.polygons !== 1) throw new Error('data changed or disappeared after reload: ' + JSON.stringify(afterReload));
const exported = JSON.parse(await evaluate(`JSON.stringify(gisExportHubBuildFeatureCollection({waypoints:true,savedTracks:true,polygons:true}))`));
const exportCounts = {
  features: exported.features.length,
  waypoints: exported.features.filter((f) => f.geometry?.type === 'Point').length,
  tracks: exported.features.filter((f) => f.geometry?.type === 'LineString').length,
  polygons: exported.features.filter((f) => f.geometry?.type === 'Polygon').length
};
if (exportCounts.waypoints < 1 || exportCounts.tracks < 1 || exportCounts.polygons < 1) throw new Error('export omitted a persisted category: ' + JSON.stringify(exportCounts));
const importExportExpr = `(()=>{const input=document.getElementById('wbImportHubFile');const fc=${JSON.stringify(exported)};const file=new File([JSON.stringify(fc)],'qa-export.geojson',{type:'application/geo+json'});const dt=new DataTransfer();dt.items.add(file);input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));return {initialFiles:1,afterDispatch:input.files.length}})()`;
const reimportEvent = await evaluate(importExportExpr);
await sleep(400);
const reimportPreview = await waitPreview();
if (reimportPreview.phase !== 'preview' || reimportPreview.totals.waypoints < 1 || reimportPreview.totals.tracks < 1 || reimportPreview.totals.polygons < 1) throw new Error('exported GeoJSON did not reimport with all geometry categories: ' + JSON.stringify(reimportPreview));
await evaluate(`document.getElementById('wbImportHubApplyBtn').click()`);
await sleep(500);
const secondApply = JSON.parse(await evaluate(`JSON.stringify({statusKind:gisImportHubEnsureState().statusKind,counts:(()=>{const p=gisImportHubReadPersistedCanonicalSnapshot();return {waypoints:p.mapWaypoints.length,tracks:p.savedTracks.length,polygons:p.gisPolygons.length}})()})`));
if (secondApply.statusKind !== 'ok' || secondApply.counts.waypoints !== 2 || secondApply.counts.tracks !== 2 || secondApply.counts.polygons !== 2) throw new Error('reimport was not applied as a complete second data set: ' + JSON.stringify(secondApply));
await evaluate(`gisImportHubClear();localStorage.clear()`);
console.log(JSON.stringify({result:'PASS',candidate:'coordinate_converter%20Claude.html?qa_import_run=2026110301',initial,pickerEvent,pickerPreview,firstApply,afterReload,exportCounts,reimportEvent,reimportPreview,secondApply}));
ws.close();
