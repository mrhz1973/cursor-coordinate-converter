'use strict';
// Authorized selective application: preparation only; generated command writes one HTTPS LS key.
// node prepare-selective-application.cjs CONFIG_JSON
// Pinned readers, receipt checks and CreateNew helpers reused from qualified assembler c1625f8d.
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const Module = require('node:module'), { TextDecoder } = require('node:util');
const COMPARATOR_SHA = '2b52af8981bcc76927a2129faea8daceeb539f38222930633afde94222a56f3a';
const MiB = 1024 * 1024;
const ORIGINS = { httpLocalStorage: 'http://100.99.54.93:8000', httpsLocalStorage: 'https://ionos-n8n-new.tailc01234.ts.net' };
const RECEIPT_CHECKS = ['sourceSize', 'sourceStableDuringRead', 'sourceSHA256MatchesBrowser', 'schema',
  'uniqueStringPairs', 'copyByteForByte', 'copySHA256MatchesBrowser'];
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const isHash = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const isCount = value => Number.isSafeInteger(value) && value >= 0;
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const isISO = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) &&
  Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
class AuditFailure extends Error { constructor(code) { super(code); this.code = code; } }
function need(condition, code) { if (!condition) throw new AuditFailure(code); }
function exactKeys(value, keys, code) {
  need(isObject(value) && Object.keys(value).length === keys.length && keys.every(key => Object.prototype.hasOwnProperty.call(value,key)), code);
}
function sameStamp(a,b) { return ['dev','ino','size','mtimeNs','ctimeNs'].every(key => a[key] === b[key]); }
function readPinned(filename, sha, maximum, expectedBytes) {
  need(typeof filename === 'string' && path.isAbsolute(filename) && isHash(sha), 'INPUT_CONTRACT_INVALID');
  let fd;
  try {
    const realpath = fs.realpathSync(filename);
    fd = fs.openSync(filename,'r');
    const before = fs.fstatSync(fd,{bigint:true});
    need(before.isFile() && before.size > 0n && before.size <= BigInt(maximum), 'INPUT_SIZE_INVALID');
    if (expectedBytes !== undefined) need(before.size === BigInt(expectedBytes),'INPUT_SIZE_MISMATCH');
    const bytes = Buffer.alloc(Number(before.size));
    let offset = 0;
    while (offset < bytes.length) {
      const count = fs.readSync(fd,bytes,offset,bytes.length-offset,offset);
      need(count > 0,'INPUT_CHANGED'); offset += count;
    }
    need(fs.readSync(fd,Buffer.alloc(1),0,1,bytes.length) === 0,'INPUT_CHANGED');
    const after = fs.fstatSync(fd,{bigint:true});
    need(sameStamp(before,after) && sameStamp(after,fs.statSync(filename,{bigint:true})) &&
      realpath === fs.realpathSync(filename),'INPUT_CHANGED');
    need(hash(bytes) === sha,'INPUT_HASH_MISMATCH');
    return {bytes,filename,realpath,stamp:after};
  } catch(error) {
    if (error instanceof AuditFailure) throw error;
    throw new AuditFailure('INPUT_READ_FAILED');
  } finally { if(fd !== undefined) fs.closeSync(fd); }
}
function stableAgain(input) {
  try { need(input.realpath === fs.realpathSync(input.filename) &&
    sameStamp(input.stamp,fs.statSync(input.filename,{bigint:true})),'INPUT_CHANGED'); }
  catch(error) { if(error instanceof AuditFailure) throw error; throw new AuditFailure('INPUT_CHANGED'); }
}
function loadPinnedModule(filename,expectedSHA) {
  const pinned = readPinned(filename,expectedSHA,256*1024);
  const qualified = new Module(filename,module);
  qualified.filename=filename; qualified.paths=Module._nodeModulePaths(path.dirname(filename));
  qualified._compile(pinned.bytes.toString('utf8'),filename); qualified.loaded=true;
  return qualified.exports;
}
function loadComparator(filename) {
  const qualified={exports:loadPinnedModule(filename,COMPARATOR_SHA)};
  need(typeof qualified.exports.parseLossless === 'function' && typeof qualified.exports.equalNodes === 'function','QUALIFIED_MODULE_INVALID');
  return qualified.exports;
}
function materialize(node) {
  if(node.type === 'number') return Number(node.value);
  if(node.type === 'array') return node.value.map(materialize);
  if(node.type === 'object') { const output=Object.create(null); for(const [key,value] of node.value) output[key]=materialize(value); return output; }
  return node.value;
}
function decodeQualified(bytes,qualified,code) {
  try { return materialize(qualified.parseLossless(new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(bytes),bytes.length)); }
  catch { throw new AuditFailure(code); }
}
function parseMain(raw,qualified) {
  if(raw === undefined) return {state:'ABSENT'};
  if(raw === '') return {state:'EMPTY_STRING'};
  try {
    const node=qualified.parseLossless(raw);
    if(node.type === 'null') return {state:'NULL'};
    if(node.type !== 'object') return {state:'INVALID_ROOT_TYPE'};
    return {state:'OBJECT',node};
  } catch(error) {
    const allowed=['DUPLICATE_KEY','UNSAFE_NUMBER','SYNTAX','LIMIT'];
    return {state:'UNINTERPRETABLE',reason:allowed.includes(error?.code)?error.code:'UNSPECIFIED'};
  }
}
function readCopy(pair,origin,qualified,opened) {
  exactKeys(pair,['backupPath','receiptPath','expectedArtifactBytes','expectedArtifactSHA256','expectedReceiptSHA256'],'CONFIG_INVALID');
  need(isCount(pair.expectedArtifactBytes) && pair.expectedArtifactBytes > 0 && pair.expectedArtifactBytes <= 64*MiB &&
    isHash(pair.expectedArtifactSHA256) && isHash(pair.expectedReceiptSHA256),'CONFIG_INVALID');
  const receiptInput=readPinned(pair.receiptPath,pair.expectedReceiptSHA256,MiB); opened.push(receiptInput);
  const receipt=decodeQualified(receiptInput.bytes,qualified,'RECEIPT_JSON_INVALID');
  exactKeys(receipt,['schema','status','coverage','origin','capturedUTC','verifiedUTC','filename','sourcePath','backupPath',
    'bytes','sha256','keys','counts','checks','completeOriginBackup','httpsComparison','sourceWrites'],'RECEIPT_SCHEMA_INVALID');
  need(receipt.schema===1 && receipt.status==='VERIFIED' && receipt.coverage==='LOCALSTORAGE_ONLY' && receipt.origin===origin &&
    receipt.bytes===pair.expectedArtifactBytes && receipt.sha256===pair.expectedArtifactSHA256 &&
    isISO(receipt.capturedUTC) && isISO(receipt.verifiedUTC) && receipt.verifiedUTC>=receipt.capturedUTC &&
    typeof receipt.sourcePath==='string' && typeof receipt.backupPath==='string' && isCount(receipt.keys) && isObject(receipt.counts) &&
    receipt.completeOriginBackup===false && receipt.httpsComparison==='NOT_PERFORMED' && receipt.sourceWrites===false,'RECEIPT_CONTRACT_INVALID');
  const protocol=origin.startsWith('http:')?'HTTP':'HTTPS';
  need(receipt.filename==='TMAR-GIS-P0-'+protocol+'-localStorage-'+receipt.capturedUTC.replace(/[-:.]/g,'')+'.json','RECEIPT_FILENAME_INVALID');
  exactKeys(receipt.checks,RECEIPT_CHECKS,'RECEIPT_CHECKS_INVALID');
  need(RECEIPT_CHECKS.every(key=>receipt.checks[key]===true),'RECEIPT_CHECKS_INVALID');
  const artifact=readPinned(pair.backupPath,pair.expectedArtifactSHA256,64*MiB,pair.expectedArtifactBytes); opened.push(artifact);
  const data=decodeQualified(artifact.bytes,qualified,'ARTIFACT_JSON_INVALID');
  exactKeys(data,['formato','origine','acquisitoUTC','copertura','stabilita','numeroChiavi','unitaUTF16ChiaviValori','entries'],'ARTIFACT_SCHEMA_INVALID');
  need(data.formato==='TMAR-GIS-P0-LOCALSTORAGE-V1' && data.origine===origin && data.acquisitoUTC===receipt.capturedUTC &&
    data.copertura==='LOCALSTORAGE_ONLY' && data.stabilita==='DUE_LETTURE_COINCIDENTI' && Array.isArray(data.entries) &&
    data.numeroChiavi===data.entries.length && data.numeroChiavi===receipt.keys && isCount(data.unitaUTF16ChiaviValori),'ARTIFACT_CONTRACT_INVALID');
  const entries=new Map(); let units=0;
  for(const pair of data.entries) {
    need(Array.isArray(pair) && pair.length===2 && pair.every(value=>typeof value==='string') && !entries.has(pair[0]),'ARTIFACT_PAIR_INVALID');
    entries.set(pair[0],pair[1]); units+=pair[0].length+pair[1].length;
  }
  need(units===data.unitaUTF16ChiaviValori,'ARTIFACT_TOTAL_INVALID');
  return {entries,main:parseMain(entries.get('coordconv_v2'),qualified),source:{origin,capturedUTC:receipt.capturedUTC,
    verifiedUTC:receipt.verifiedUTC,artifactBytes:artifact.bytes.length,artifactSHA256:pair.expectedArtifactSHA256,
    receiptSHA256:pair.expectedReceiptSHA256,storageKeys:entries.size}};
}

function inside(root,child) {
  const relative=path.relative(root,child);
  return relative===''||(!relative.startsWith('..'+path.sep)&&relative!=='..'&&!path.isAbsolute(relative));
}
function outputTarget(directory) {
  need(typeof directory==='string'&&path.isAbsolute(directory),'OUTPUT_DIRECTORY_INVALID');
  const output=path.resolve(directory);
  let parent;
  try {
    parent=fs.realpathSync(path.dirname(output));
    need(fs.statSync(parent).isDirectory(),'OUTPUT_PARENT_INVALID');
    try {fs.lstatSync(output);throw new AuditFailure('OUTPUT_DIRECTORY_EXISTS');}
    catch(error) {if(error instanceof AuditFailure) throw error;need(error.code==='ENOENT','OUTPUT_DIRECTORY_CHECK_FAILED');}
  } catch(error) {if(error instanceof AuditFailure) throw error;throw new AuditFailure('OUTPUT_PARENT_UNAVAILABLE');}
  if(process.platform==='win32') {
    const local=process.env.LOCALAPPDATA;
    need(typeof local==='string'&&path.isAbsolute(local)&&!output.startsWith('\\\\')&&!parent.startsWith('\\\\'),'OUTPUT_LOCAL_PATH_REQUIRED');
    const allowed=['Backups','Recovery'].some(name=>{
      try {return inside(fs.realpathSync(path.join(local,'TMAR-GIS',name)),parent);} catch {return false;}
    });
    need(allowed,'OUTPUT_OUTSIDE_PRIVATE_RECOVERY_ROOT');
  }
  return {directory:output,physical:path.join(parent,path.basename(output))};
}
function writeNew(filename,bytes,onCreated) {
  let fd;
  try {
    fd=fs.openSync(filename,'wx',0o600);onCreated();
    let offset=0;
    while(offset<bytes.length) {
      const count=fs.writeSync(fd,bytes,offset,bytes.length-offset);
      need(count>0,'OUTPUT_WRITE_INCOMPLETE');offset+=count;
    }
    fs.fsyncSync(fd);
  } catch(error) {
    if(error instanceof AuditFailure) throw error;
    throw new AuditFailure(error?.code==='EEXIST'?'OUTPUT_FILE_EXISTS':'OUTPUT_WRITE_FAILED');
  } finally {if(fd!==undefined) fs.closeSync(fd);}
}

const ASSEMBLER_SHA = 'c1625f8da7fe2d4c25dd645a56964ee907559e8ca7d56e69ca1b85047f6574bc';
const SHA_HELPER_SHA = '5e18766164d836a64a6008d483543c0f804908367905aecc6ba70be3424d9beb';
const SHA_SOURCE_SHA = '615504f07e6ef979eb9129007de145e14d91fa40d9c9178aae47364d37c67cb1';
const NEUTRAL_PATH = '/gis/__tmar_p0_inventory__';
const field = (node,key) => node?.type === 'object' ? node.value.get(key) : undefined;
function recordId(record) {
  need(record?.type === 'object','RECORD_SCHEMA_UNSUPPORTED');
  const id = field(record,'id');
  need(id && ['string','number','boolean'].includes(id.type),'ID_SCHEMA_UNSUPPORTED');
  const value = id.type === 'number' ? Number(id.value) : id.value;
  need(Boolean(value),'ID_WOULD_REQUIRE_GENERATION');
  return String(value);
}
function uniqueRecords(records) {
  const indexed = new Map();
  for (const record of records) {
    const id = recordId(record);
    need(!indexed.has(id),'DUPLICATE_RECORD_ID');
    indexed.set(id,record);
  }
  return indexed;
}
function arrays(copy) {
  need(copy.main.state === 'OBJECT','MAIN_SCHEMA_NOT_INTERPRETABLE');
  const tracks = field(copy.main.node,'savedTracks'), waypoints = field(copy.main.node,'mapWaypoints');
  need(tracks?.type === 'array' && waypoints?.type === 'array','COLLECTION_SCHEMA_UNSUPPORTED');
  return {savedTracks:tracks.value,mapWaypoints:waypoints.value};
}
function mergeSelection(qualifiedHttp,currentHttp,currentHttps,qualified,serializer) {
  const source=arrays(qualifiedHttp), currentSource=arrays(currentHttp), base=arrays(currentHttps);
  need(source.savedTracks.length===1 && source.mapWaypoints.length===200 &&
    field(source.savedTracks[0],'points')?.type==='array' && field(source.savedTracks[0],'points').value.length===11,
    'AUTHORIZED_SELECTION_SCOPE_CHANGED');
  for (const key of ['savedTracks','mapWaypoints']) {
    need(qualified.equalNodes(field(qualifiedHttp.main.node,key),field(currentHttp.main.node,key)),
      'HTTP_SELECTION_CHANGED_SINCE_QUALIFICATION');
  }
  const next={type:'object',value:new Map(currentHttps.main.node.value)}, counts={};
  let additions=0;
  for (const [key,cap] of [['savedTracks',50],['mapWaypoints',200]]) {
    uniqueRecords(source[key]);
    const indexed=uniqueRecords(base[key]), result=base[key].slice();
    let alreadyPresent=0, added=0;
    for (const record of source[key]) {
      const id=recordId(record);
      if (indexed.has(id)) {
        need(qualified.equalNodes(indexed.get(id),record),'SAME_ID_DIFFERENT_CONTENT');
        alreadyPresent++;
      } else { result.push(record); indexed.set(id,record); added++; }
    }
    need(result.length<=cap,'COLLECTION_CAP_EXCEEDED');
    next.value.set(key,{type:'array',value:result}); additions+=added;
    counts[key]={before:base[key].length,selected:source[key].length,alreadyPresent,added,after:result.length};
  }
  const rawBefore=currentHttps.entries.get('coordconv_v2');
  const nextMain=additions===0 ? rawBefore : serializer.serializeLossless(next);
  const parsed=qualified.parseLossless(nextMain,32*MiB);
  need(qualified.equalNodes(next,parsed) && serializer.samePropertyOrder(next,parsed),'SERIALIZATION_PROOF_FAILED');
  need(parsed.value.size===currentHttps.main.node.value.size,'MAIN_PROPERTY_SET_CHANGED');
  let untouched=0;
  for (const [key,value] of currentHttps.main.node.value) {
    if (key==='savedTracks'||key==='mapWaypoints') continue;
    need(qualified.equalNodes(value,field(parsed,key)),'UNSELECTED_MAIN_PROPERTY_CHANGED');untouched++;
  }
  for (const key of ['savedTracks','mapWaypoints']) {
    const merged=field(parsed,key).value;
    need(base[key].every((record,index)=>qualified.equalNodes(record,merged[index])),'EXISTING_RECORD_CHANGED');
    const byId=uniqueRecords(merged);
    need(source[key].every(record=>qualified.equalNodes(record,byId.get(recordId(record)))),'SELECTED_RECORD_CHANGED');
  }
  return {nextMain,counts,additions,untouched,
    checks:{currentHttpSelectionMatchesQualified:true,existingRecordsPreserved:true,selectedRecordsPreserved:true,
      collisionPolicy:'IDENTICAL_SKIP_DIFFERENT_STOP',arrayAndPropertyOrderPreserved:true,
      numericTokensValuesTypesAndAbsencesPreserved:true,otherMainPropertiesPreserved:true,
      otherLocalStoragePairsPreserved:true,idempotentNoWriteWhenAllPresent:additions===0}};
}

// Executes only when the private generated command is deliberately run in the neutral HTTPS tab.
// The immediate compare/write is synchronous, but localStorage has no cross-tab CAS transaction.
function browserApply(bytes,expectedPlanHash,sha256) {
  const evidence={writeAttempted:false,writeReturned:false,readbackVerified:false,exportInitiated:false};
  let stage='PRECONDITIONS';
  const fail=code=>{const error=new Error(code);error.code=code;throw error;};
  const insist=(value,code)=>{if(!value)fail(code);};
  const same=(a,b)=>a.length===b.length&&a.every((p,i)=>p[0]===b[i][0]&&p[1]===b[i][1]);
  const wholeStoreHash=rows=>sha256(new TextEncoder().encode(JSON.stringify(rows)));
  const read=()=>{
    const count=localStorage.length,keys=[];
    insist(count<=1024,'STORAGE_SIZE_LIMIT');
    for(let i=0;i<count;i++){const key=localStorage.key(i);insist(typeof key==='string','STORAGE_CHANGED');keys.push(key);}
    insist(new Set(keys).size===count,'STORAGE_CHANGED');keys.sort();
    const rows=keys.map(key=>{const value=localStorage.getItem(key);insist(typeof value==='string','STORAGE_CHANGED');return [key,value];});
    insist(localStorage.length===count,'STORAGE_CHANGED');return rows;
  };
  try {
    insist(window===window.top && location.origin==='https://ionos-n8n-new.tailc01234.ts.net' &&
      location.pathname==='/gis/__tmar_p0_inventory__' && location.search==='' && location.hash==='', 'WRONG_PAGE');
    insist(typeof state==='undefined' && typeof saveStoreReported==='undefined','RUNTIME_PAGE_NOT_NEUTRAL');
    insist(bytes instanceof Uint8Array && bytes.length>0 && bytes.length<=128*1024*1024,'PACKAGE_BYTES_INVALID');
    insist(sha256(bytes)===expectedPlanHash,'PLAN_HASH_MISMATCH');
    const plan=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
    insist(plan.formato==='TMAR-GIS-P0-SELECTIVE-APPLICATION-PLAN-V1' && plan.applicationAuthorized===true &&
      plan.origin===location.origin && plan.neutralPath===location.pathname && typeof plan.nextMain==='string' &&
      /^[a-f0-9]{64}$/.test(plan.expectedContentSHA256) && /^[a-f0-9]{64}$/.test(plan.expectedFinalContentSHA256) &&
      Number.isSafeInteger(plan.expectedKeys) && plan.expectedKeys>0 && plan.expectedKeys<=1024 &&
      plan.writerControl?.status==='GIS_INSTANCES_NEUTRALIZED' && plan.writerControl.remainingGisInstances===0 &&
      plan.backupVerified===true,'PLAN_CONTRACT_INVALID');
    insist(typeof plan.pageMarker==='string' && /^[a-f0-9]{32}$/.test(plan.pageMarker) &&
      document.documentElement.getAttribute('data-tmar-p0-application')===plan.pageMarker,'PAGE_MARKER_MISMATCH');
    stage='COMPARE_BEFORE_WRITE';
    const observed=read();insist(same(observed,read()),'STORAGE_CHANGED');
    insist(observed.length===plan.expectedKeys && observed.some(p=>p[0]==='coordconv_v2'),'CURRENT_KEYS_DIFFER');
    const observedHash=wholeStoreHash(observed),after=observed.map(([key,value])=>[key,key==='coordconv_v2'?plan.nextMain:value]);
    insist(wholeStoreHash(after)===plan.expectedFinalContentSHA256,'UNSELECTED_STORAGE_DIFFERS');
    let status;
    if(observedHash===plan.expectedFinalContentSHA256 && same(observed,after)){status='ALREADY_PRESENT_NO_WRITE';}
    else {
      insist(observedHash===plan.expectedContentSHA256,'CURRENT_STATE_DIFFERS_FROM_VERIFIED_BACKUP');
      // There is intentionally no await between this final read/compare, setItem, and readback.
      insist(same(read(),observed),'CURRENT_STATE_CHANGED_BEFORE_WRITE');
      stage='SINGLE_MAIN_WRITE';evidence.writeAttempted=true;
      localStorage.setItem('coordconv_v2',plan.nextMain);evidence.writeReturned=true;
      status='APPLIED_READBACK_IDENTICAL';
    }
    stage='READBACK';
    const final=read();insist(same(final,after)&&same(final,read()),'FINAL_READBACK_DIFFERS');
    evidence.readbackVerified=true;
    stage='FINAL_SNAPSHOT';
    const acquired=new Date().toISOString();
    const snapshot={formato:'TMAR-GIS-P0-LOCALSTORAGE-V1',origine:location.origin,acquisitoUTC:acquired,
      copertura:'LOCALSTORAGE_ONLY',stabilita:'DUE_LETTURE_COINCIDENTI',numeroChiavi:final.length,
      unitaUTF16ChiaviValori:final.reduce((n,p)=>n+p[0].length+p[1].length,0),entries:final};
    const snapshotBytes=new TextEncoder().encode(JSON.stringify(snapshot)+'\n');
    const filename='TMAR-GIS-P0-HTTPS-localStorage-'+acquired.replace(/[-:.]/g,'')+'.json';
    const digest=sha256(snapshotBytes);
    insist(same(read(),after),'CURRENT_STATE_CHANGED_AFTER_READBACK');
    const url=URL.createObjectURL(new Blob([snapshotBytes],{type:'application/json;charset=utf-8'}));
    const anchor=document.createElement('a');anchor.href=url;anchor.download=filename;
    document.body.appendChild(anchor);anchor.click();evidence.exportInitiated=true;anchor.remove();
    setTimeout(()=>URL.revokeObjectURL(url),30000);
    return {schema:1,status,stage:'COMPLETED',origin:location.origin,acquiredUTC:acquired,planSHA256:expectedPlanHash,
      plannedCounts:plan.counts,actualLocalStorageWrites:evidence.writeReturned?1:0,
      keys:final.length,filename,bytes:snapshotBytes.length,sha256:digest,...evidence,
      comparisonTransaction:'SYNCHRONOUS_CHECK_NOT_ATOMIC_ACROSS_TABS',snapshotDownloadVerified:false,
      httpWrites:false,otherLocalStorageWrites:false,indexedDBWrites:false,completeOriginBackup:false};
  } catch(error) {
    const allowed=/^[A-Z][A-Z0-9_]{1,80}$/;
    return {schema:1,status:evidence.writeAttempted?'APPLICATION_REQUIRES_RECONCILIATION':'STOP_NO_WRITE',stage,
      reason:allowed.test(error?.code||'')?error.code:'LOCAL_OPERATION_FAILED',...evidence,
      automaticRollback:false,httpWrites:false,otherLocalStorageWrites:false,indexedDBWrites:false};
  }
}

// Public bootstrap: only code, a whole-package hash/size, and a public page marker.
// The package is JSON data read locally by FileReader; it is never evaluated as code.
function browserBootstrap(options,sha256,apply) {
  const prewriteFailure=reason=>({schema:1,status:'STOP_NO_WRITE',stage:'PACKAGE_SELECTION',reason,
    writeAttempted:false,writeReturned:false,readbackVerified:false,exportInitiated:false});
  const guard=marker=>{
    if(window!==window.top || location.origin!=='https://ionos-n8n-new.tailc01234.ts.net' ||
      location.pathname!=='/gis/__tmar_p0_inventory__' || location.search!=='' || location.hash!=='' ||
      typeof state!=='undefined' || typeof saveStoreReported!=='undefined')throw new Error('WRONG_PAGE');
    if(marker && document.documentElement.getAttribute('data-tmar-p0-application')!==marker)throw new Error('PAGE_MARKER_MISMATCH');
  };
  try {
    guard(null);
    if(!/^[a-f0-9]{64}$/.test(options.sha256) || !/^[a-f0-9]{32}$/.test(options.marker) ||
      !Number.isSafeInteger(options.bytes) || options.bytes<=0 || options.bytes>128*1024*1024)throw new Error('BOOTSTRAP_CONTRACT_INVALID');
    if(document.getElementById('tmar-p0-recovery-controls') || document.documentElement.hasAttribute('data-tmar-p0-application'))
      throw new Error('BOOTSTRAP_ALREADY_PRESENT');
    document.documentElement.setAttribute('data-tmar-p0-application',options.marker);
    const panel=document.createElement('section');panel.id='tmar-p0-recovery-controls';
    const text=document.createElement('p');text.textContent='TMAR GIS — origine HTTPS verificata. Selezionare il pacchetto locale di recupero.';
    const button=document.createElement('button');button.type='button';button.textContent='Seleziona pacchetto di recupero';
    const input=document.createElement('input');input.type='file';input.accept='.json,application/json';input.multiple=false;input.style.display='none';
    panel.appendChild(text);panel.appendChild(button);panel.appendChild(input);document.body.appendChild(panel);
    let used=false;
    const finish=result=>{console.log(JSON.stringify(result));try{text.textContent='TMAR GIS — '+result.status;}catch{}};
    button.onclick=()=>{
      if(used)return;
      try{guard(options.marker);input.value='';input.click();}
      catch{finish(prewriteFailure('PAGE_OR_FILE_PICKER_UNAVAILABLE'));}
    };
    input.onchange=()=>{
      if(used)return;
      try {
        guard(options.marker);
        if(!input.files || input.files.length!==1)throw new Error('ONE_PACKAGE_REQUIRED');
        const file=input.files[0];
        if(file.name!==options.filename || file.size!==options.bytes)throw new Error('PACKAGE_IDENTITY_MISMATCH');
        used=true;button.disabled=true;
        const reader=new FileReader();
        reader.onerror=()=>finish(prewriteFailure('PACKAGE_READ_FAILED'));
        reader.onabort=()=>finish(prewriteFailure('PACKAGE_READ_ABORTED'));
        reader.onload=()=>{
          let result,applyInvoked=false;
          try {
            guard(options.marker);
            const bytes=new Uint8Array(reader.result);
            if(bytes.length!==options.bytes)throw new Error('PACKAGE_SIZE_MISMATCH');
            applyInvoked=true;result=apply(bytes,options.sha256,sha256);
          } catch {result=applyInvoked?{schema:1,status:'APPLICATION_REQUIRES_RECONCILIATION',stage:'APPLICATION_RESULT',
            reason:'APPLICATION_RESULT_UNAVAILABLE',writeAttempted:null,writeReturned:null,readbackVerified:null,
            exportInitiated:null,automaticRollback:false}:prewriteFailure('PAGE_OR_PACKAGE_CHANGED');}
          finish(result);
        };
        reader.readAsArrayBuffer(file);
      } catch {finish(prewriteFailure('PAGE_OR_PACKAGE_SELECTION_INVALID'));}
    };
    console.log(JSON.stringify({schema:1,status:'READY_FOR_LOCAL_PACKAGE',origin:location.origin,
      packageBytes:options.bytes,packageSHA256:options.sha256,pageMarker:options.marker,storageWrites:0}));
  } catch {console.log(JSON.stringify(prewriteFailure('BOOTSTRAP_GUARD_FAILED')));}
}

function prepare(config) {
  exactKeys(config,['comparatorPath','assemblerPath','shaHelperPath','inputs','writerControl','outputDirectory'],'CONFIG_INVALID');
  exactKeys(config.inputs,['qualifiedHttp','currentHttp','currentHttps'],'CONFIG_INVALID');
  exactKeys(config.writerControl,['status','observedUTC','remainingGisInstances'],'WRITER_CONTROL_INVALID');
  need(config.writerControl.status==='GIS_INSTANCES_NEUTRALIZED' && config.writerControl.remainingGisInstances===0 &&
    isISO(config.writerControl.observedUTC) && config.writerControl.observedUTC<=new Date().toISOString(),'WRITER_CONTROL_INVALID');
  const qualified=loadComparator(config.comparatorPath), serializer=loadPinnedModule(config.assemblerPath,ASSEMBLER_SHA);
  const shaHelper=loadPinnedModule(config.shaHelperPath,SHA_HELPER_SHA);
  need(typeof serializer.serializeLossless==='function'&&typeof serializer.samePropertyOrder==='function'&&
    typeof shaHelper.SHA256_SOURCE==='string'&&hash(Buffer.from(shaHelper.SHA256_SOURCE,'utf8'))===SHA_SOURCE_SHA,
    'QUALIFIED_HELPER_INVALID');
  const opened=[];
  const source=readCopy(config.inputs.qualifiedHttp,ORIGINS.httpLocalStorage,qualified,opened);
  const currentHttp=readCopy(config.inputs.currentHttp,ORIGINS.httpLocalStorage,qualified,opened);
  const currentHttps=readCopy(config.inputs.currentHttps,ORIGINS.httpsLocalStorage,qualified,opened);
  need(source.source.artifactBytes===36618 &&
    source.source.artifactSHA256==='7811e2250e1b18e9651f0cd4467b79eb5a4f0511c8fc1e1602f144081db56a95' &&
    source.source.receiptSHA256==='2307c79a3e81b32f88fa36e38014df5306cd2dcf24e23b3fc966bf11b07fa6e7',
    'QUALIFIED_HTTP_IDENTITY_MISMATCH');
  need(currentHttps.source.capturedUTC>=config.writerControl.observedUTC &&
    currentHttp.source.capturedUTC>=config.writerControl.observedUTC,'CURRENT_BACKUP_PRECEDES_WRITER_CONTROL');
  const merged=mergeSelection(source,currentHttp,currentHttps,qualified,serializer);
  const target=outputTarget(config.outputDirectory);fs.mkdirSync(target.directory,{mode:0o700});
  need(fs.realpathSync(target.directory)===target.physical,'OUTPUT_DIRECTORY_REBOUND');
  const artifacts={};
  const store=(name,bytes)=>{
    const filename=path.join(target.directory,name),digest=hash(bytes);
    writeNew(filename,bytes,()=>{});
    const checked=readPinned(filename,digest,128*MiB,bytes.length);
    need(checked.bytes.equals(bytes),'OUTPUT_READBACK_DIFFERS');
    artifacts[name]={bytes:bytes.length,sha256:digest};return {filename,digest};
  };
  // A fresh, immutable, fully reread copy exists before the executable command is created.
  const backup=readPinned(config.inputs.currentHttps.backupPath,config.inputs.currentHttps.expectedArtifactSHA256,
    64*MiB,config.inputs.currentHttps.expectedArtifactBytes);
  store('before-localStorage.json',backup.bytes);
  store('before-verification.json',readPinned(config.inputs.currentHttps.receiptPath,
    config.inputs.currentHttps.expectedReceiptSHA256,MiB).bytes);
  const sortedEntries=[...currentHttps.entries].sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:0);
  const afterEntries=sortedEntries.map(([key,value])=>[key,key==='coordconv_v2'?merged.nextMain:value]);
  const plan={formato:'TMAR-GIS-P0-SELECTIVE-APPLICATION-PLAN-V1',applicationAuthorized:true,
    preparedUTC:new Date().toISOString(),origin:ORIGINS.httpsLocalStorage,neutralPath:NEUTRAL_PATH,
    pageMarker:crypto.randomBytes(16).toString('hex'),
    writerControl:config.writerControl,backupVerified:true,
    sourceIdentities:{qualifiedHttp:source.source,currentHttp:currentHttp.source,currentHttps:currentHttps.source},
    contentHashAlgorithm:'SHA256_OF_UTF8_JSON_SORTED_RAW_STRING_PAIRS_V1',expectedKeys:sortedEntries.length,
    expectedContentSHA256:hash(Buffer.from(JSON.stringify(sortedEntries),'utf8')),
    expectedFinalContentSHA256:hash(Buffer.from(JSON.stringify(afterEntries),'utf8')),
    nextMain:merged.nextMain,counts:merged.counts};
  const planBytes=Buffer.from(JSON.stringify(plan)+'\n','utf8');
  const storedPlan=store('application-plan-private.json',planBytes);
  for(const input of opened){stableAgain(input);readPinned(input.filename,hash(input.bytes),64*MiB,input.bytes.length);}
  const options={filename:'application-plan-private.json',bytes:planBytes.length,sha256:storedPlan.digest,marker:plan.pageMarker};
  const command='(()=>{\n'+shaHelper.SHA256_SOURCE+'\n('+browserBootstrap.toString()+')('+JSON.stringify(options)+',sha256,('+browserApply.toString()+'));return undefined;})();\n';
  store('apply-bootstrap-public.js',Buffer.from(command,'utf8'));
  const receipt={schema:1,status:'PREPARED_AUTHORIZED_NOT_APPLIED',preparedUTC:plan.preparedUTC,directory:target.directory,
    counts:merged.counts,checks:merged.checks,unchangedOtherMainProperties:merged.untouched,
    unchangedOtherStorageKeys:currentHttps.entries.size-1,artifacts,sourceIdentities:plan.sourceIdentities,
    browserWritesPerformed:false,httpWrites:false,completeOriginBackup:false,
    writerControl:config.writerControl,concurrency:'IMMEDIATE_COMPARE_REQUIRES_CONTINUED_WRITER_QUIESCENCE',
    subsequentRuntimeBoot:'EXISTING_QUALIFIED_BUILD317_PATH_ONLY',derivedFieldsManuallyChanged:false};
  const receiptBytes=Buffer.from(JSON.stringify(receipt)+'\n','utf8');
  const final=store('preparation-receipt.json',receiptBytes);
  return {schema:1,status:receipt.status,directory:target.directory,counts:merged.counts,
    bootstrap:artifacts['apply-bootstrap-public.js'],package:artifacts['application-plan-private.json'],pageMarker:plan.pageMarker,
    receipt:{file:'preparation-receipt.json',bytes:receiptBytes.length,sha256:final.digest},
    browserWritesPerformed:false,httpWrites:false};
}
function main(argv) {
  try {
    need(argv.length===1 && path.isAbsolute(argv[0]),'CLI_INVALID');
    const config=JSON.parse(fs.readFileSync(argv[0],'utf8'));
    process.stdout.write(JSON.stringify(prepare(config))+'\n');return 0;
  } catch(error) {
    const code=/^[A-Z][A-Z0-9_]{1,80}$/.test(error?.code||'')?error.code:'LOCAL_OPERATION_FAILED';
    process.stdout.write(JSON.stringify({schema:1,status:'PREPARATION_STOP',reason:code,
      browserWritesPerformed:false,httpWrites:false})+'\n');return 2;
  }
}
module.exports={mergeSelection,browserApply,browserBootstrap,prepare,main};
if(require.main===module)process.exitCode=main(process.argv.slice(2));
