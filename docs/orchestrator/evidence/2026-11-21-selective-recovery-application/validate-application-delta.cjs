'use strict';
// Synthetic-only delta checks. No browser, runtime HTML, user profile or private input is opened.
// node validate-application-delta.cjs EXISTING_SYNTHETIC_FIXTURE_DIRECTORY
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm'),assert=require('node:assert/strict');
const helperPath=path.join(__dirname,'prepare-selective-application.cjs');
const helper=require(helperPath);
const dossier=path.dirname(__dirname);
const qualified=require(path.join(dossier,'2026-11-19-http-origin-p0-inventory','compare-origin-backups.cjs'));
const serializer=require(path.join(dossier,'2026-11-21-selective-recovery-roundtrip','prepare-selective-candidate.cjs'));
const shaSource=require(path.join(dossier,'2026-11-21-http-recovery-preparation','prepare-http-recovery.cjs')).SHA256_SOURCE;
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const results=[];
function check(name,fn){fn();results.push({name,status:'PASS'});}
function copy(filename){
  const envelope=JSON.parse(fs.readFileSync(filename,'utf8')),entries=new Map(envelope.entries);
  return {entries,main:{state:'OBJECT',node:qualified.parseLossless(entries.get('coordconv_v2'))}};
}
function fromRaw(raw,base){const entries=new Map(base.entries);entries.set('coordconv_v2',raw);return {entries,main:{state:'OBJECT',node:qualified.parseLossless(raw)}};}
function changed(base,fn){const object=JSON.parse(base.entries.get('coordconv_v2'));fn(object);return fromRaw(JSON.stringify(object),base);}
const fixtures=path.resolve(process.argv[2]||'');
assert.ok(process.argv[2]);
const source=copy(path.join(fixtures,'TMAR-GIS-P0-HTTP-localStorage-20261121T140000000Z.json'));
const base=copy(path.join(fixtures,'TMAR-GIS-P0-HTTPS-localStorage-20261121T140100000Z.json'));
let merged;
check('append_preserves_existing_records_and_unselected_properties',()=>{
  merged=helper.mergeSelection(source,source,base,qualified,serializer);
  assert.equal(merged.counts.savedTracks.added,1);assert.equal(merged.counts.mapWaypoints.added,200);
  assert.equal(merged.counts.savedTracks.after,6);assert.equal(merged.counts.mapWaypoints.after,200);
  assert.equal(merged.checks.otherMainPropertiesPreserved,true);
});
check('all_present_preserves_exact_raw_main_without_serializing',()=>{
  const raw=' '+merged.nextMain+'\n',already=fromRaw(raw,base);
  const result=helper.mergeSelection(source,source,already,qualified,serializer);
  assert.equal(result.additions,0);assert.equal(result.nextMain,raw);
});
check('same_id_different_content_stops',()=>{
  const sourceMain=JSON.parse(source.entries.get('coordconv_v2'));
  const collision=changed(base,x=>x.savedTracks.push({...sourceMain.savedTracks[0],name:'synthetic conflict'}));
  assert.throws(()=>helper.mergeSelection(source,source,collision,qualified,serializer),e=>e.code==='SAME_ID_DIFFERENT_CONTENT');
});
check('capacity_overflow_stops_without_truncation',()=>{
  const sourceMain=JSON.parse(source.entries.get('coordconv_v2'));
  const over=changed(base,x=>x.mapWaypoints.push({...sourceMain.mapWaypoints[0],id:'synthetic-unselected-waypoint'}));
  assert.throws(()=>helper.mergeSelection(source,source,over,qualified,serializer),e=>e.code==='COLLECTION_CAP_EXCEEDED');
});
check('changed_current_http_selection_stops',()=>{
  const different=changed(source,x=>x.savedTracks[0].name='synthetic changed source');
  assert.throws(()=>helper.mergeSelection(source,different,base,qualified,serializer),e=>e.code==='HTTP_SELECTION_CHANGED_SINCE_QUALIFICATION');
});
function planFor(entries,nextMain){
  const before=[...entries].sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:0);
  const after=before.map(([key,value])=>[key,key==='coordconv_v2'?nextMain:value]);
  return {formato:'TMAR-GIS-P0-SELECTIVE-APPLICATION-PLAN-V1',applicationAuthorized:true,
    origin:'https://ionos-n8n-new.tailc01234.ts.net',neutralPath:'/gis/__tmar_p0_inventory__',nextMain,
    pageMarker:'1'.repeat(32),
    expectedKeys:before.length,expectedContentSHA256:sha(Buffer.from(JSON.stringify(before))),
    expectedFinalContentSHA256:sha(Buffer.from(JSON.stringify(after))),
    writerControl:{status:'GIS_INSTANCES_NEUTRALIZED',remainingGisInstances:0},backupVerified:true,counts:merged.counts};
}
function run(plan,initial,options={}){
  const data=new Map(initial),state={writes:0,downloads:0,lengthReads:0,snapshot:null};
  const storage={get length(){state.lengthReads++;if(options.mutateAtLength===state.lengthReads)data.set('synthetic-concurrent','changed');return data.size;},
    key(i){return [...data.keys()][i]??null;},getItem(key){return data.has(key)?data.get(key):null;},
    setItem(key,value){state.writes++;if(options.quota)throw new Error('synthetic quota');data.set(key,value);
      if(options.afterWrite)data.set('synthetic-concurrent','changed');}};
  const window={};window.top=window;
  const context={window,location:{origin:plan.origin,pathname:options.wrongPath?'/gis/':plan.neutralPath,search:'',hash:''},
    localStorage:storage,Uint8Array,TextDecoder,TextEncoder,atob,Date,JSON,Set,Number,Error,
    Blob:class {constructor(parts){state.snapshot=Buffer.concat(parts.map(x=>Buffer.from(x)));}},
    URL:{createObjectURL(){return 'blob:synthetic';},revokeObjectURL(){}},
    document:{documentElement:{getAttribute(){return options.wrongMarker?'2'.repeat(32):plan.pageMarker;}},
      body:{appendChild(){}},createElement(){return {click(){if(options.downloadFailure)throw new Error('synthetic download');state.downloads++;},remove(){}};}},
    setTimeout(){}};
  const bytes=Buffer.from(JSON.stringify(plan)+'\n'),expected=options.badPlanHash?'0'.repeat(64):sha(bytes);
  context.packageBytes=new Uint8Array(bytes);
  const script='(()=>{'+shaSource+'\nreturn ('+helper.browserApply.toString()+')(packageBytes,'+JSON.stringify(expected)+',sha256);})()';
  const receipt=vm.runInNewContext(script,context,{timeout:3000});return {receipt,state,data};
}
const entries=new Map(base.entries),plan=planFor(entries,merged.nextMain);
check('one_main_write_full_readback_and_final_export',()=>{
  const result=run(plan,entries);
  assert.equal(result.receipt.status,'APPLIED_READBACK_IDENTICAL');assert.equal(result.state.writes,1);assert.equal(result.state.downloads,1);
  assert.equal(result.receipt.readbackVerified,true);assert.equal(result.receipt.exportInitiated,true);
  assert.equal(result.data.get('coordconv_v2'),merged.nextMain);
  for(const [key,value] of entries)if(key!=='coordconv_v2')assert.equal(result.data.get(key),value);
  assert.equal(sha(result.state.snapshot),result.receipt.sha256);
  assert.deepEqual(JSON.parse(result.state.snapshot).entries,[...result.data].sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:0));
});
check('repeat_command_is_zero_write_idempotent',()=>{
  const present=new Map(entries);present.set('coordconv_v2',merged.nextMain);
  const result=run(plan,present);assert.equal(result.receipt.status,'ALREADY_PRESENT_NO_WRITE');assert.equal(result.state.writes,0);
});
check('stale_main_stops_before_write',()=>{
  const stale=new Map(entries);stale.set('coordconv_v2',stale.get('coordconv_v2')+' ');
  const result=run(plan,stale);assert.equal(result.receipt.status,'STOP_NO_WRITE');assert.equal(result.state.writes,0);
});
check('unselected_storage_change_stops_before_write',()=>{
  const stale=new Map(entries);const other=[...stale.keys()].find(key=>key!=='coordconv_v2');stale.set(other,stale.get(other)+' ');
  const result=run(plan,stale);assert.equal(result.receipt.status,'STOP_NO_WRITE');assert.equal(result.state.writes,0);
});
check('change_between_final_compare_reads_stops_before_write',()=>{
  const result=run(plan,entries,{mutateAtLength:5});assert.equal(result.receipt.status,'STOP_NO_WRITE');assert.equal(result.state.writes,0);
});
check('quota_failure_retains_attempted_not_returned_evidence',()=>{
  const result=run(plan,entries,{quota:true});assert.equal(result.receipt.status,'APPLICATION_REQUIRES_RECONCILIATION');
  assert.equal(result.receipt.writeAttempted,true);assert.equal(result.receipt.writeReturned,false);assert.equal(result.receipt.readbackVerified,false);
});
check('post_write_interference_is_not_reported_as_no_write',()=>{
  const result=run(plan,entries,{afterWrite:true});assert.equal(result.receipt.status,'APPLICATION_REQUIRES_RECONCILIATION');
  assert.equal(result.receipt.writeReturned,true);assert.equal(result.receipt.readbackVerified,false);assert.equal(result.state.downloads,0);
});
check('download_failure_keeps_successful_write_and_readback_flags',()=>{
  const result=run(plan,entries,{downloadFailure:true});assert.equal(result.receipt.status,'APPLICATION_REQUIRES_RECONCILIATION');
  assert.equal(result.receipt.writeReturned,true);assert.equal(result.receipt.readbackVerified,true);assert.equal(result.receipt.exportInitiated,false);
});
check('wrong_page_stops_before_write',()=>{const result=run(plan,entries,{wrongPath:true});assert.equal(result.state.writes,0);assert.equal(result.receipt.reason,'WRONG_PAGE');});
check('plan_integrity_mismatch_stops_before_write',()=>{const result=run(plan,entries,{badPlanHash:true});assert.equal(result.state.writes,0);assert.equal(result.receipt.reason,'PLAN_HASH_MISMATCH');});
check('wrong_page_marker_stops_before_write',()=>{const result=run(plan,entries,{wrongMarker:true});assert.equal(result.state.writes,0);assert.equal(result.receipt.reason,'PAGE_MARKER_MISMATCH');});
function bootstrapHarness(options={}){
  const packageBytes=Buffer.from('{"synthetic":"PRIVATE_PAYLOAD_MUST_NOT_BE_LOGGED"}\n');
  const attributes=new Map(),elements=[],logs=[],state={applyCalls:0,pickerClicks:0,pending:null};
  const marker='3'.repeat(32),window={};window.top=window;
  const document={documentElement:{getAttribute:k=>attributes.get(k)??null,hasAttribute:k=>attributes.has(k),setAttribute:(k,v)=>attributes.set(k,v)},
    getElementById:id=>elements.find(e=>e.id===id)||null,body:{appendChild(){}},
    createElement(tag){const e={tag,style:{},children:[],appendChild(x){this.children.push(x);},click(){if(tag==='input')state.pickerClicks++;},remove(){}};elements.push(e);return e;}};
  class Reader{readAsArrayBuffer(file){this.result=file.bytes.buffer.slice(file.bytes.byteOffset,file.bytes.byteOffset+file.bytes.byteLength);state.pending=this;}}
  const context={window,location:{origin:options.wrongOrigin?'https://example.invalid':plan.origin,pathname:plan.neutralPath,search:'',hash:''},
    document,FileReader:Reader,Uint8Array,Number,Error,console:{log:text=>logs.push(JSON.parse(text))},
    applySpy(bytes,hash){state.applyCalls++;assert.equal(hash,sha(packageBytes));assert.ok(Buffer.from(bytes).equals(packageBytes));
      if(options.applyThrows)throw new Error('synthetic unknown application result');return {schema:1,status:'SYNTHETIC_METADATA_ONLY',writeAttempted:false};}};
  const config={filename:'application-plan-private.json',bytes:packageBytes.length,sha256:sha(packageBytes),marker};
  vm.runInNewContext('('+helper.browserBootstrap.toString()+')('+JSON.stringify(config)+',null,applySpy)',context,{timeout:3000});
  return {state,logs,attributes,elements,packageBytes,select(){const input=elements.find(e=>e.tag==='input');
    input.files=[{name:config.filename,size:options.wrongSize?config.bytes+1:config.bytes,bytes:packageBytes}];input.onchange();}};
}
check('public_bootstrap_requires_real_file_selection_and_never_logs_payload',()=>{
  const h=bootstrapHarness();assert.equal(h.logs[0].status,'READY_FOR_LOCAL_PACKAGE');assert.equal(h.state.applyCalls,0);
  h.elements.find(e=>e.tag==='button').onclick();assert.equal(h.state.pickerClicks,1);h.select();assert.equal(h.state.applyCalls,0);
  h.state.pending.onload();assert.equal(h.state.applyCalls,1);assert.ok(!JSON.stringify(h.logs).includes('PRIVATE_PAYLOAD_MUST_NOT_BE_LOGGED'));
  h.select();assert.equal(h.state.applyCalls,1);
});
check('public_bootstrap_wrong_origin_creates_no_picker',()=>{
  const h=bootstrapHarness({wrongOrigin:true});assert.equal(h.logs[0].status,'STOP_NO_WRITE');assert.equal(h.elements.length,0);assert.equal(h.state.applyCalls,0);
});
check('wrong_package_size_is_rejected_before_filereader',()=>{
  const h=bootstrapHarness({wrongSize:true});h.select();assert.equal(h.state.pending,null);assert.equal(h.state.applyCalls,0);assert.equal(h.logs.at(-1).status,'STOP_NO_WRITE');
});
check('marker_changed_during_filereader_stops_before_apply',()=>{
  const h=bootstrapHarness();h.select();h.attributes.set('data-tmar-p0-application','4'.repeat(32));h.state.pending.onload();
  assert.equal(h.state.applyCalls,0);assert.equal(h.logs.at(-1).status,'STOP_NO_WRITE');
});
check('unknown_apply_exception_reports_unknown_write_state',()=>{
  const h=bootstrapHarness({applyThrows:true});h.select();h.state.pending.onload();const result=h.logs.at(-1);
  assert.equal(result.status,'APPLICATION_REQUIRES_RECONCILIATION');assert.equal(result.writeAttempted,null);assert.equal(result.writeReturned,null);
});
process.stdout.write(JSON.stringify({schema:1,status:'PASS',scope:'SYNTHETIC_APPLICATION_DELTA_ONLY',cases:results,
  helperSHA256:sha(fs.readFileSync(helperPath)),runtimeRuns:0,browserRuns:0,privateDataAccess:false})+'\n');
