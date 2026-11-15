'use strict';

// App-handler tests for an EMPTY, isolated browser profile. Never use with user data.
// No runtime source is patched. Files are synthetic; DataTransfer selects the upper input.
const common = String.raw`
const out = {harnessRevision:'2-visible-save-action',checks:[], observations:[]};
const copy = x => JSON.parse(JSON.stringify(x));
const check = (name, ok, detail) => {out.checks.push({name,pass:!!ok,detail});};
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const until = async (fn,label) => {for(let k=0;k<100;k++){if(fn())return;await sleep(50);}throw new Error('Timeout: '+label);};
const eq = (a,b) => JSON.stringify(a)===JSON.stringify(b);
const saved = name => state.savedTracks.find(s=>s.name===name);
const fixtures = [
 {name:'QA305-complete',h:[100,110,105,108],closed:false},
 {name:'QA305-partial',h:[100,110,null,120,130,null],closed:false},
 {name:'QA305-single',h:[null,123,null],closed:false},
 {name:'QA305-legacy',h:[null,null,null],closed:false},
 {name:'QA305-polygon',h:[30,35,31],closed:true}
];
const gpx = h => '<?xml version="1.0"?><gpx version="1.1" creator="QA305 synthetic" xmlns="http://www.topografix.com/GPX/1/1"><trk><name>Synthetic QA305</name><trkseg>'+h.map((z,i)=>'<trkpt lat="'+(44.0+i*0.001).toFixed(6)+'" lon="'+(9.0+i*0.0004).toFixed(6)+'">'+(z===null?'':'<ele>'+z+'</ele>')+'</trkpt>').join('')+'</trkseg></trk></gpx>';
const inputFile = async (name,text,n) => {
 if(state.track.points.length)throw new Error('Refusing import with a nonempty draft');
 const inp=document.getElementById('trackFileInput');
 const dt=new DataTransfer();dt.items.add(new File([text],name+'.gpx',{type:'application/gpx+xml'}));
 inp.files=dt.files;inp.dispatchEvent(new Event('change',{bubbles:true}));
 await until(()=>state.track.points.length===n,'upper import '+name);
};
const currentSaveButton = async () => {
 let b=null;
 for(let k=0;k<100;k++){
   b=document.querySelector('#track-points-head [data-role="track-save-current"]');
   if(b&&!b.disabled&&!b.hidden&&b.getClientRects().length)return b;
   await sleep(50);
 }
 throw new Error('Visible current-track Save CTA not ready: '+JSON.stringify({
   points:state.track.points.length,promptOpen:!!state._trackPromptOpen,
   editingId:state._trackEditingSavedId||null,present:!!b,
   disabled:b?b.disabled:null,hidden:b?b.hidden:null,rects:b?b.getClientRects().length:0
 }));
};
const saveViaButton = async name => {
 const oldCount=state.savedTracks.length;
 const b=await currentSaveButton();
 b.click();
 await until(()=>document.getElementById('trackSaveNameDialog').open,'save dialog');
 const inp=document.getElementById('trackSaveNameDialogInput');inp.value=name;inp.dispatchEvent(new Event('input',{bubbles:true}));
 document.getElementById('trackSaveNameDialogSaveBtn').click();
 await until(()=>state.savedTracks.length===oldCount+1 && state.track.points.length===0,'saved '+name);
 return saved(name);
};
const openProfile = async name => {
 const st=saved(name);if(!st)throw new Error('Missing saved fixture '+name);
 const b=document.querySelector('[data-saved-profile="'+st.id+'"]');if(!b)throw new Error('Missing profile button');
 b.click();await sleep(100);
 const sec=document.getElementById('trackSavedElevationSection');
 const chart=document.getElementById('trackSavedElevationChart');
 const view=state._savedTrackElevationView;
 return {name,hidden:sec.hidden,classes:sec.className,status:document.getElementById('trackSavedElevationStatus').textContent,
   warning:document.getElementById('trackSavedElevationWarn').textContent,
   svgCount:chart.querySelectorAll('svg').length,paths:[...chart.querySelectorAll('path')].map(p=>p.getAttribute('d')),
   runtime:view.runtimeProfile?copy(view.runtimeProfile):null};
};
`;

const phase1 = `(async()=>{${common}
try {
 await until(()=>typeof state==='object'&&typeof importTrackFile==='function','app ready');
 ensureTrackState();ensureSavedTracksState();
 if(state.savedTracks.length || state.track.points.length)throw new Error('QA requires an EMPTY isolated profile; existing data found');
 openTrackModal();
 for(const f of fixtures){
   await inputFile(f.name,gpx(f.h),f.h.length);
   check(f.name+' upper import heights',eq(state.track.points.map(p=>Number.isFinite(p._importEle)?p._importEle:null),f.h));
   if(f.closed){const cb=document.getElementById('trackClosed');if(!cb.checked)cb.click();}
   const row=await saveViaButton(f.name);
   check(f.name+' saved geometry',row.points.length===f.h.length&&row.closed===f.closed);
   const hasExpected=!f.closed&&f.h.some(z=>z!==null);
   check(f.name+' saved addon',hasExpected?eq(row.importedElevations&&row.importedElevations.heights,f.h):!row.importedElevations,
      row.importedElevations?copy(row.importedElevations):null);
   check(f.name+' no leaked point elevation',row.points.every(p=>!Object.prototype.hasOwnProperty.call(p,'_importEle')));
 }
 const raw=JSON.parse(localStorage.getItem(STORAGE_KEY));
 out.persistedKey=STORAGE_KEY;
 out.saved=copy(state.savedTracks);
 out.persistedSavedTracks=copy(raw.savedTracks||[]);
 check('all fixture rows persisted',out.persistedSavedTracks.length===fixtures.length);
}catch(e){out.fatal={message:e.message,stack:e.stack};}
out.pass=!out.fatal&&out.checks.every(c=>c.pass);return out;
})()`;

const phase2 = `(async()=>{${common}
try {
 await until(()=>typeof state==='object'&&Array.isArray(state.savedTracks),'reloaded app ready');
 if(state.savedTracks.some(s=>!/^QA305-/.test(s.name)))throw new Error('Unexpected data in isolated profile');
 openTrackModal();
 for(const f of fixtures){
   const row=saved(f.name);const expected=!f.closed&&f.h.some(z=>z!==null);
   check(f.name+' reload addon',!!row&&(expected?eq(row.importedElevations&&row.importedElevations.heights,f.h):!row.importedElevations));
 }
 const complete=await openProfile('QA305-complete');out.observations.push(complete);
 check('complete profile rendered',!complete.hidden&&complete.classes.includes('is-valid')&&complete.svgCount===1);
 check('complete profile source and caution',complete.runtime&&complete.runtime.meta.source==='imported-gpx-kml'&&complete.status.length>0&&/DTM/.test(complete.warning));
 check('complete profile sample heights',eq(complete.runtime&&complete.runtime.samples.map(s=>s.ele),fixtures[0].h));
 const ch=document.getElementById('trackSavedElevationChart');
 ch.dispatchEvent(new KeyboardEvent('keydown',{key:'Home',bubbles:true}));
 await sleep(80);
 check('chart keyboard hover selects sample',state._savedTrackElevationView.hover&&state._savedTrackElevationView.hover.sampleIndex===0);
 out.observations.push({chartHover:copy(state._savedTrackElevationView.hover),markerCount:document.querySelectorAll('.saved-track-elevation-sync-marker').length});
 const partial=await openProfile('QA305-partial');out.observations.push(partial);
 check('partial profile rendered',partial.classes.includes('is-partial')&&partial.svgCount===1);
 check('partial gaps preserved',eq(partial.runtime&&partial.runtime.samples.map(s=>s.ele),fixtures[1].h));
 check('partial gap does not bridge grade',partial.runtime&&partial.runtime.samples[2].gradePct===null&&partial.runtime.samples[3].gradePct===null&&partial.runtime.samples[1].runIndex!==partial.runtime.samples[3].runIndex);
 for(const name of ['QA305-single','QA305-legacy','QA305-polygon']){
   const p=await openProfile(name);out.observations.push(p);
   check(name+' no fabricated profile',p.classes.includes('is-unavailable')&&p.svgCount===0&&p.runtime===null);
 }
 closeSavedTrackElevationProfile();
 // Invariant test through the real drag mutator (not a native pointer gesture).
 // Moving one imported point invalidates its height; an identical assignment keeps it.
 await inputFile('QA305-drag',gpx([70,80,90]),3);
 let moved=state.track.points[1];
 trackUpdatePointLatLon(moved.id,moved.lat,moved.lon);
 check('drag mutator unchanged point keeps height',moved._importEle===80);
 trackUpdatePointLatLon(moved.id,moved.lat+0.0003,moved.lon);
 check('drag mutator moved point drops height',!Object.prototype.hasOwnProperty.call(moved,'_importEle'));
 const dragSaved=await saveViaButton('QA305-drag');
 check('drag then first save retains only unchanged heights',eq(dragSaved.importedElevations&&dragSaved.importedElevations.heights,[70,null,90]));
 // Exercise native export serialization, then re-import through the same upper input/save UI.
 for(const f of fixtures.slice(0,3)){
   const row=saved(f.name);const xml=spatialGeoJSONToGpx(savedTrackToFeatureCollection(row));
   const doc=new DOMParser().parseFromString(xml,'application/xml');
   const exported=[...doc.getElementsByTagName('trkpt')].map(p=>{const z=p.getElementsByTagName('ele')[0];return z?Number(z.textContent):null;});
   check(f.name+' GPX export heights',eq(exported,f.h),exported);
   await inputFile(f.name+'-roundtrip',xml,f.h.length);
   const round=await saveViaButton(f.name+'-roundtrip');
   check(f.name+' GPX export/reimport/save',eq(round.importedElevations&&round.importedElevations.heights,f.h));
 }
 // Edit via the real row button. First preserve exact geometry; then inject one
 // synthetic coordinate change via the application drag mutator, then use the real save button.
 let row=saved('QA305-complete');const originalId=row.id;const originalHash=row.importedElevations.geometryHash;
 document.querySelector('[data-saved-edit="'+row.id+'"]').click();await sleep(30);
 check('edit loads legacy-shaped draft',state._trackEditingSavedId===originalId&&state.track.points.every(p=>!Object.prototype.hasOwnProperty.call(p,'_importEle')));
 (await currentSaveButton()).click();await until(()=>state.track.points.length===0,'same geometry replace');
 row=saved('QA305-complete');
 check('same geometry replacement preserves addon',row.id===originalId&&row.importedElevations&&row.importedElevations.geometryHash===originalHash&&eq(row.importedElevations.heights,fixtures[0].h));
 document.querySelector('[data-saved-edit="'+row.id+'"]').click();await sleep(30);
 const p=state.track.points[1];trackUpdatePointLatLon(p.id,p.lat+0.0002,p.lon);
 (await currentSaveButton()).click();await until(()=>state.track.points.length===0,'different geometry replace');
 row=saved('QA305-complete');
 check('changed geometry replacement invalidates addon',row.id===originalId&&!row.importedElevations&&savedTrackGeometryHash(row)!==originalHash);
 const raw=JSON.parse(localStorage.getItem(STORAGE_KEY));
 const stored=raw.savedTracks.find(s=>s.id===originalId);
 check('changed geometry invalidation persisted',stored&&!stored.importedElevations);
 out.finalSaved=copy(state.savedTracks);
}catch(e){out.fatal={message:e.message,stack:e.stack};}
out.pass=!out.fatal&&out.checks.every(c=>c.pass);return out;
})()`;

module.exports={phase1,phase2};
