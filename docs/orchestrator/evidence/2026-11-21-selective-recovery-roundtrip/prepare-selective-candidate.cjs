'use strict';
// Private CANDIDATE_ONLY assembler, never a browser/storage writer or a backup verifier.
// node p0-prepare-selective-candidate.cjs BASE64_TWO_INPUT_CONFIG ABSOLUTE_COMPARATOR NEW_PRIVATE_DIRECTORY
// Reader/pin/parser functions below are reused unchanged from the qualified classifier.
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

const MAX_CANDIDATE_BYTES=128*MiB;
const field=(node,key)=>node?.type==='object'?node.value.get(key):undefined;
const finite=node=>node?.type==='number'&&Number.isFinite(Number(node.value));
function serializeLossless(node) {
  if(node.type==='object') return '{'+[...node.value].map(([key,value])=>JSON.stringify(key)+':'+serializeLossless(value)).join(',')+'}';
  if(node.type==='array') return '['+node.value.map(serializeLossless).join(',')+']';
  if(node.type==='number') return node.value;
  need(['string','boolean','null'].includes(node.type),'LOSSLESS_NODE_UNSUPPORTED');
  return JSON.stringify(node.value);
}
function samePropertyOrder(a,b) {
  if(a.type!==b.type) return false;
  if(a.type==='object') {
    const left=[...a.value],right=[...b.value];
    return left.length===right.length&&left.every(([key,value],index)=>key===right[index][0]&&samePropertyOrder(value,right[index][1]));
  }
  if(a.type==='array') return a.value.length===b.value.length&&a.value.every((value,index)=>samePropertyOrder(value,b.value[index]));
  return true;
}
function idString(record) {
  need(record?.type==='object','RECORD_SCHEMA_UNSUPPORTED');
  const id=field(record,'id');
  need(id&&['string','number','boolean'].includes(id.type),'ID_SCHEMA_UNSUPPORTED');
  const value=id.type==='number'?Number(id.value):id.value;
  need(Boolean(value),'ID_WOULD_REQUIRE_GENERATION');
  return String(value);
}
function assertUniqueIds(records) {
  const ids=new Set();
  for(const record of records) {const id=idString(record);need(!ids.has(id),'ID_COLLISION_AFTER_STRING');ids.add(id);}
}
function collections(copy) {
  need(copy.main.state==='OBJECT','MAIN_SCHEMA_NOT_INTERPRETABLE');
  const tracks=field(copy.main.node,'savedTracks'),waypoints=field(copy.main.node,'mapWaypoints');
  need(tracks?.type==='array'&&waypoints?.type==='array','COLLECTION_SCHEMA_NOT_INTERPRETABLE');
  let pointCount=0,pointDuplicateOccurrences=0;
  for(const track of tracks.value) {
    need(track.type==='object','TRACK_SCHEMA_UNSUPPORTED');
    const points=field(track,'points');
    need(points?.type==='array','TRACK_POINTS_SCHEMA_UNSUPPORTED');
    need(points.value.length<=2000,'POINT_CAP_EXCEEDED');
    const ids=new Map();
    for(const point of points.value) {
      need(point.type==='object'&&finite(field(point,'lat'))&&finite(field(point,'lon')),'POINT_COORDINATE_SCHEMA_UNSUPPORTED');
      const id=idString(point);ids.set(id,(ids.get(id)||0)+1);pointCount++;
    }
    for(const count of ids.values()) pointDuplicateOccurrences+=count-1;
  }
  for(const waypoint of waypoints.value) {
    need(waypoint.type==='object'&&finite(field(waypoint,'lat'))&&finite(field(waypoint,'lon')),'WAYPOINT_COORDINATE_SCHEMA_UNSUPPORTED');
    need(Math.abs(Number(field(waypoint,'lat').value))<=90&&Math.abs(Number(field(waypoint,'lon').value))<=180,'WAYPOINT_RANGE_UNSUPPORTED');
  }
  return {tracks:tracks.value,waypoints:waypoints.value,pointCount,pointDuplicateOccurrences};
}
function assemble(http,https,qualified,preparedUTC) {
  const source=collections(http),base=collections(https);
  need(source.tracks.length===1&&source.pointCount===11&&source.waypoints.length===200&&
    base.tracks.length===5&&base.waypoints.length===0,'AUTHORIZED_SELECTION_SCOPE_CHANGED');
  need(source.tracks.length+base.tracks.length<=50&&source.waypoints.length+base.waypoints.length<=200,'COLLECTION_CAP_EXCEEDED');
  need(source.pointDuplicateOccurrences===0&&base.pointDuplicateOccurrences===1,'KNOWN_POINT_ID_DUPLICATE_SCOPE_CHANGED');
  assertUniqueIds([...base.tracks,...source.tracks]);
  assertUniqueIds([...base.waypoints,...source.waypoints]);
  const candidateMain={type:'object',value:new Map(https.main.node.value)};
  candidateMain.value.set('savedTracks',{type:'array',value:[...base.tracks,...source.tracks]});
  candidateMain.value.set('mapWaypoints',{type:'array',value:[...base.waypoints,...source.waypoints]});
  const mainText=serializeLossless(candidateMain);
  let reparsed;
  try {reparsed=qualified.parseLossless(mainText,32*MiB);} catch {throw new AuditFailure('CANDIDATE_MAIN_NOT_INTERPRETABLE');}
  need(qualified.equalNodes(candidateMain,reparsed)&&samePropertyOrder(candidateMain,reparsed),'LOSSLESS_SERIALIZATION_PROOF_FAILED');
  need(reparsed.value.size===https.main.node.value.size,'MAIN_PROPERTY_SET_CHANGED');
  let unselectedProperties=0;
  for(const [key,value] of https.main.node.value) {
    if(key==='savedTracks'||key==='mapWaypoints') continue;
    need(reparsed.value.has(key)&&qualified.equalNodes(value,reparsed.value.get(key)),'UNSELECTED_MAIN_PROPERTY_CHANGED');
    unselectedProperties++;
  }
  for(const [key,oldRecords,newRecords] of [['savedTracks',base.tracks,source.tracks],['mapWaypoints',base.waypoints,source.waypoints]]) {
    const combined=reparsed.value.get(key).value;
    need(combined.length===oldRecords.length+newRecords.length&&
      oldRecords.every((record,index)=>qualified.equalNodes(record,combined[index]))&&
      newRecords.every((record,index)=>qualified.equalNodes(record,combined[oldRecords.length+index])),
      'APPEND_IDENTITY_OR_ORDER_PROOF_FAILED');
  }
  const baseEntries=[...https.entries];
  const entries=baseEntries.map(([key,value])=>[key,key==='coordconv_v2'?mainText:value]);
  need(entries.length===https.entries.size&&entries.every(([key,value],index)=>
    key===baseEntries[index][0]&&(key==='coordconv_v2'||value===https.entries.get(key))),'OTHER_STORAGE_KEY_CHANGED');
  const inputIdentities={};
  for(const [slot,copy] of [['httpLocalStorage',http],['httpsLocalStorage',https]])
    inputIdentities[slot]={artifactSHA256:copy.source.artifactSHA256,receiptSHA256:copy.source.receiptSHA256};
  const envelope={formato:'TMAR-GIS-P0-SELECTIVE-CANDIDATE-V1',status:'PREPARED_NOT_APPLIED',
    coverage:'LOCALSTORAGE_CANDIDATE_ONLY',origin:ORIGINS.httpsLocalStorage,preparedUTC,
    roundTrip:'NOT_TESTED',inputIdentities,entries};
  const bytes=Buffer.from(JSON.stringify(envelope)+'\n','utf8');
  need(bytes.length<=MAX_CANDIDATE_BYTES,'CANDIDATE_SIZE_LIMIT');
  return {bytes,inputIdentities,counts:{sourceSavedTracks:source.tracks.length,sourceTrackPoints:source.pointCount,
    sourceMapWaypoints:source.waypoints.length,httpsSavedTracks:base.tracks.length,httpsMapWaypoints:base.waypoints.length,
    candidateSavedTracks:base.tracks.length+source.tracks.length,candidateMapWaypoints:base.waypoints.length+source.waypoints.length,
    httpsPointDuplicateOccurrences:base.pointDuplicateOccurrences,addedHttpPointDuplicateOccurrences:source.pointDuplicateOccurrences,
    candidatePointDuplicateOccurrences:base.pointDuplicateOccurrences+source.pointDuplicateOccurrences,
    unchangedOtherStorageKeys:https.entries.size-1,unchangedOtherMainProperties:unselectedProperties},
    checks:{authorizedSelection:true,capacity:true,trackAndWaypointIdsCollisionFree:true,
      knownHttpsPointDuplicatesPreserved:true,httpsExistingRecordsStructuralIdentical:true,httpAddedRecordsStructuralIdentical:true,
      arrayAndPropertyOrderPreserved:true,numericTokensValuesTypesAndAbsencesPreserved:true,
      mainOutsideSelectedArraysStructuralIdentical:true,otherLocalStorageKeyValueStringsRawIdentical:true},
    mainSerialization:{rawWhitespaceAndEscapeEncoding:'MAY_DIFFER',rawMainBytesIdentical:false,newParserIntroduced:false}};
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
function prepare(config,comparatorPath,directory,state) {
  exactKeys(config,['schema','inputs'],'CONFIG_INVALID');need(config.schema===1,'CONFIG_INVALID');
  exactKeys(config.inputs,Object.keys(ORIGINS),'CONFIG_INVALID');
  const target=outputTarget(directory),qualified=loadComparator(comparatorPath),opened=[],copies={};
  for(const [slot,origin] of Object.entries(ORIGINS)) copies[slot]=readCopy(config.inputs[slot],origin,qualified,opened);
  state.stage='ASSEMBLY_AND_PROOF';
  const preparedUTC=new Date().toISOString();
  const candidate=assemble(copies.httpLocalStorage,copies.httpsLocalStorage,qualified,preparedUTC);
  const candidateSHA256=hash(candidate.bytes);
  for(const input of opened) stableAgain(input);
  state.stage='NEW_DIRECTORY';
  try {fs.mkdirSync(target.directory,{mode:0o700});state.directoryCreated=true;}
  catch(error) {throw new AuditFailure(error?.code==='EEXIST'?'OUTPUT_DIRECTORY_EXISTS':'OUTPUT_DIRECTORY_CREATE_FAILED');}
  const physical=fs.realpathSync(target.directory);
  need(process.platform==='win32'?physical.toLowerCase()===target.physical.toLowerCase():physical===target.physical,'OUTPUT_DIRECTORY_CHANGED');
  const candidatePath=path.join(target.directory,'candidate.json'),receiptPath=path.join(target.directory,'candidate-receipt.json');
  state.stage='CANDIDATE_WRITE';
  writeNew(candidatePath,candidate.bytes,()=>{state.candidateFileCreated=true;});
  state.stage='CANDIDATE_READBACK';
  const candidateRead=readPinned(candidatePath,candidateSHA256,MAX_CANDIDATE_BYTES,candidate.bytes.length);
  need(candidateRead.bytes.equals(candidate.bytes),'CANDIDATE_READBACK_DIFFERS');
  state.candidateVerified=true;state.candidateSHA256=candidateSHA256;
  state.stage='SOURCE_REREAD_AFTER_CANDIDATE';
  for(const input of opened) {
    const again=readPinned(input.filename,hash(input.bytes),input.bytes.length,input.bytes.length);
    need(again.bytes.equals(input.bytes),'SOURCE_REREAD_DIFFERS');stableAgain(input);
  }
  const receipt={schema:1,formato:'TMAR-GIS-P0-SELECTIVE-CANDIDATE-RECEIPT-V1',status:'PREPARED_NOT_APPLIED',
    coverage:'LOCALSTORAGE_CANDIDATE_ONLY',preparedUTC,roundTrip:'NOT_TESTED',
    candidate:{file:'candidate.json',bytes:candidate.bytes.length,sha256:candidateSHA256},
    inputIdentities:candidate.inputIdentities,qualifiedComparatorSHA256:COMPARATOR_SHA,counts:candidate.counts,
    checks:{...candidate.checks,candidateWriteFsyncReadback:true,sourceBytesIdenticalBeforeAndAfter:true},
    mainSerialization:candidate.mainSerialization,sourceWrites:false,browserWrites:false,
    candidateDataCreated:true,completeOriginBackup:false,currentBrowserStateVerified:false,
    application:'NOT_PERFORMED',candidateReadiness:'NOT_ESTABLISHED'};
  const receiptBytes=Buffer.from(JSON.stringify(receipt)+'\n','utf8'),receiptSHA256=hash(receiptBytes);
  state.stage='RECEIPT_WRITE';
  writeNew(receiptPath,receiptBytes,()=>{state.receiptFileCreated=true;});
  state.stage='RECEIPT_READBACK';
  const receiptRead=readPinned(receiptPath,receiptSHA256,MiB,receiptBytes.length);
  need(receiptRead.bytes.equals(receiptBytes),'RECEIPT_READBACK_DIFFERS');
  state.receiptVerified=true;state.receiptSHA256=receiptSHA256;
  for(const input of opened) stableAgain(input);
  stableAgain(candidateRead);stableAgain(receiptRead);
  state.stage='COMPLETE';
  return {...receipt,receipt:{file:'candidate-receipt.json',bytes:receiptBytes.length,sha256:receiptSHA256},
    preparationFiles:{scope:'THIS_INVOCATION',directoryCreated:true,candidateFileCreated:true,candidateVerified:true,receiptFileCreated:true,receiptVerified:true}};
}
function main(argv) {
  const state={scope:'THIS_INVOCATION',stage:'INPUT_BINDING',directoryCreated:false,candidateFileCreated:false,candidateVerified:false,
    receiptFileCreated:false,receiptVerified:false,candidateSHA256:null,receiptSHA256:null};
  try {
    need(argv.length===3&&typeof argv[0]==='string'&&argv[0].length>0&&argv[0].length<=128*1024,'ARGUMENT_INVALID');
    const bytes=Buffer.from(argv[0],'base64');need(bytes.toString('base64')===argv[0],'ARGUMENT_INVALID');
    let config;try {config=JSON.parse(new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(bytes));}
    catch {throw new AuditFailure('CONFIG_JSON_INVALID');}
    process.stdout.write(JSON.stringify(prepare(config,argv[1],argv[2],state))+'\n');return 0;
  } catch(error) {
    process.stdout.write(JSON.stringify({schema:1,status:state.candidateFileCreated||state.receiptFileCreated?'PREPARATION_INCOMPLETE':'STOP',
      code:error instanceof AuditFailure?error.code:'LOCAL_OPERATION_FAILED',preparationFiles:state,
      sourceWrites:false,browserWrites:false,candidateDataCreated:state.candidateFileCreated,
      roundTrip:'NOT_TESTED',application:'NOT_PERFORMED',candidateReadiness:'NOT_ESTABLISHED',mustNotApply:true})+'\n');return 1;
  }
}
module.exports={assemble,serializeLossless,samePropertyOrder,prepare,loadComparator,parseMain,COMPARATOR_SHA,main};
if(require.main===module) process.exitCode=main(process.argv.slice(2));
