'use strict';
// Separate readonly classifier; no audit, round-trip, migration or candidate generation.
// node p0-classify-recovery-findings.cjs BASE64_TWO_INPUT_CONFIG ABSOLUTE_COMPARATOR
// Reader/pin/parser functions below are copied unchanged from the qualified audit.
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

const field=(node,key)=>node?.type==='object'?node.value.get(key):undefined;
function emptyDateCounts() {
  return {absent:0,null:0,finiteNumber:0,numericString:0,nonNumericString:0,otherTypes:0};
}
function dateCategory(node) {
  if(node===undefined) return 'absent';
  if(node.type==='null') return 'null';
  if(node.type==='number') {
    need(Number.isFinite(Number(node.value)),'UNEXPECTED_NONFINITE_NUMBER');
    return 'finiteNumber';
  }
  if(node.type==='string') return Number.isFinite(Number(node.value))?'numericString':'nonNumericString';
  // Objects, arrays and booleans are never coerced or materialized as runtime values.
  return 'otherTypes';
}
function classifyMain(main) {
  need(main.state==='OBJECT','MAIN_SCHEMA_NOT_INTERPRETABLE');
  const waypoints=field(main.node,'mapWaypoints'),tracks=field(main.node,'savedTracks');
  need(waypoints?.type==='array'&&tracks?.type==='array','COLLECTION_SCHEMA_NOT_INTERPRETABLE');
  const output={waypointRecords:waypoints.value.length,
    waypointDates:{createdAt:emptyDateCounts(),updatedAt:emptyDateCounts(),total:emptyDateCounts()},
    savedTracks:tracks.value.length,trackPoints:0,
    pointMetadata:{absent:0,null:0,object:0,otherTypes:0},
    pointIds:{missing:0,falsey:0,unsupportedTypes:0,duplicateOccurrencesWithinTracks:0}};
  for(const waypoint of waypoints.value) {
    need(waypoint.type==='object','WAYPOINT_RECORD_TYPE_UNSUPPORTED');
    for(const name of ['createdAt','updatedAt']) output.waypointDates[name][dateCategory(field(waypoint,name))]++;
  }
  for(const category of Object.keys(output.waypointDates.total))
    output.waypointDates.total[category]=output.waypointDates.createdAt[category]+output.waypointDates.updatedAt[category];
  for(const track of tracks.value) {
    need(track.type==='object','TRACK_RECORD_TYPE_UNSUPPORTED');
    const points=field(track,'points');
    need(points?.type==='array','TRACK_POINTS_SCHEMA_NOT_INTERPRETABLE');
    const ids=new Map();
    for(const point of points.value) {
      need(point.type==='object','TRACK_POINT_TYPE_UNSUPPORTED');
      output.trackPoints++;
      const meta=field(point,'meta');
      output.pointMetadata[meta===undefined?'absent':meta.type==='null'?'null':meta.type==='object'?'object':'otherTypes']++;
      const id=field(point,'id');
      if(id===undefined) {output.pointIds.missing++;continue;}
      if(!['string','number','boolean','null'].includes(id.type)) {output.pointIds.unsupportedTypes++;continue;}
      const value=id.type==='number'?Number(id.value):id.value;
      if(!value) {output.pointIds.falsey++;continue;}
      const text=String(value);ids.set(text,(ids.get(text)||0)+1);
    }
    for(const count of ids.values()) output.pointIds.duplicateOccurrencesWithinTracks+=count-1;
  }
  return output;
}
function classify(config,comparatorPath) {
  exactKeys(config,['schema','inputs'],'CONFIG_INVALID');need(config.schema===1,'CONFIG_INVALID');
  exactKeys(config.inputs,Object.keys(ORIGINS),'CONFIG_INVALID');
  const qualified=loadComparator(comparatorPath),opened=[],byOrigin={};
  for(const [slot,origin] of Object.entries(ORIGINS)) {
    const copy=readCopy(config.inputs[slot],origin,qualified,opened);
    byOrigin[slot==='httpLocalStorage'?'http':'https']=classifyMain(copy.main);
  }
  for(const input of opened) stableAgain(input);
  return {schema:1,status:'CLASSIFIED',byOrigin,sourceWrites:false,candidateDataCreated:false,
    roundTripProven:false,persistedChangeAssessment:'NOT_PERFORMED',currentBrowserStateVerified:false,
    stringClassification:'STRING_TYPE_RETAINED_FINITE_NUMBER_COERCION_ONLY',
    duplicateScope:'WITHIN_EACH_TRACK_THEN_AGGREGATED_SEPARATELY_BY_ORIGIN'};
}
function main(argv) {
  try {
    need(argv.length===2&&typeof argv[0]==='string'&&argv[0].length>0&&argv[0].length<=128*1024,'ARGUMENT_INVALID');
    const bytes=Buffer.from(argv[0],'base64');need(bytes.toString('base64')===argv[0],'ARGUMENT_INVALID');
    let config;try {config=JSON.parse(new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(bytes));}
    catch {throw new AuditFailure('CONFIG_JSON_INVALID');}
    process.stdout.write(JSON.stringify(classify(config,argv[1]))+'\n');return 0;
  } catch(error) {
    process.stdout.write(JSON.stringify({schema:1,status:'CLASSIFICATION_STOP',
      code:error instanceof AuditFailure?error.code:'LOCAL_OPERATION_FAILED',sourceWrites:false,
      candidateDataCreated:false,roundTripProven:false})+'\n');return 1;
  }
}
module.exports={classify,classifyMain,dateCategory,emptyDateCounts,loadComparator,parseMain,COMPARATOR_SHA,main};
if(require.main===module) process.exitCode=main(process.argv.slice(2));
