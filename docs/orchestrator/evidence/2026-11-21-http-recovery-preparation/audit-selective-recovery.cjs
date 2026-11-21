'use strict';
// Scratch candidate: anonymous, read-only audit of two pinned LocalStorage copies.
// This is neither a data candidate generator nor a runtime round-trip simulation.
// node p0-audit-selective-recovery.cjs BASE64_CONFIG ABSOLUTE_COMPARATOR [ABSOLUTE_FINGERPRINT_HELPER]
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const Module = require('node:module'), { TextDecoder } = require('node:util');
const COMPARATOR_SHA = '2b52af8981bcc76927a2129faea8daceeb539f38222930633afde94222a56f3a';
const FINGERPRINT_HELPER_SHA = '5e18766164d836a64a6008d483543c0f804908367905aecc6ba70be3424d9beb';
const MiB = 1024 * 1024;
const ORIGINS = { httpLocalStorage: 'http://100.99.54.93:8000', httpsLocalStorage: 'https://ionos-n8n-new.tailc01234.ts.net' };
const RECEIPT_CHECKS = ['sourceSize', 'sourceStableDuringRead', 'sourceSHA256MatchesBrowser', 'schema',
  'uniqueStringPairs', 'copyByteForByte', 'copySHA256MatchesBrowser'];
const TRACK_KEYS = ['id','name','savedAt','closed','visible','points','color','lineWidth','lineOpacity','lineStyle',
  'importedElevations','terrainFill','elevationProfile'];
const POINT_KEYS = ['id','name','lat','lon','meta'];
const WAYPOINT_KEYS = ['id','name','lat','lon','meta','createdAt','updatedAt'];
const POINT_META_KEYS = ['from','icon','color'];
const WAYPOINT_META_KEYS = ['from','icon','color','notes','cotUid','cotType','cotHow','cotTime','cotStale','cotImportFp'];
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
const numeric=node=>node?.type==='number' && Number.isFinite(Number(node.value));
function section(node,key) {
  const value=field(node,key);
  return value===undefined?{state:'ABSENT'}:value.type==='null'?{state:'NULL'}:
    value.type==='array'?{state:'ARRAY',count:value.value.length,node:value}:{state:'INVALID_TYPE'};
}
function shapeOnly(value) { const {node,...output}=value; return output; }
function countExtra(node,allowed) { return node?.type==='object'?[...node.value.keys()].filter(key=>!allowed.includes(key)).length:0; }
function numericReencodings(node) {
  if(!node) return 0;
  if(node.type==='number') return JSON.stringify(Number(node.value))===node.value?0:1;
  if(node.type==='array') return node.value.reduce((n,item)=>n+numericReencodings(item),0);
  if(node.type==='object') return [...node.value.values()].reduce((n,item)=>n+numericReencodings(item),0);
  return 0;
}
function ids(records) {
  const result={records:records.length,missing:0,falsey:0,unsupportedType:0,stringConversions:0,duplicateOccurrences:0,complete:false};
  const counts=new Map();
  for(const record of records) {
    const node=field(record,'id');
    if(!node) {result.missing++;continue;}
    if(!['string','number','boolean','null'].includes(node.type)) {result.unsupportedType++;continue;}
    const value=node.type==='number'?Number(node.value):node.value;
    if(!value) {result.falsey++;continue;}
    if(node.type!=='string') result.stringConversions++;
    const key=String(value); counts.set(key,(counts.get(key)||0)+1);
  }
  for(const count of counts.values()) result.duplicateOccurrences+=count-1;
  result.complete=result.missing===0 && result.falsey===0 && result.unsupportedType===0;
  return {summary:result,counts};
}
function compareIds(source,destination) {
  const a=ids(source),b=ids(destination);
  let collisionKeys=0,sourceRecordsColliding=0;
  for(const [key,count] of a.counts) if(b.counts.has(key)) {collisionKeys++;sourceRecordsColliding+=count;}
  return {source:a.summary,destination:b.summary,crossOriginCollisionKeys:collisionKeys,sourceRecordsColliding,
    comparisonComplete:a.summary.complete&&b.summary.complete,domains:'THIS_COLLECTION_ONLY'};
}
function coordinateCounts(records,waypointRange) {
  const result={records:records.length,invalidRecordType:0,missingCoordinateFields:0,nonNumericCoordinateFields:0,
    recordsFailingFiniteFilter:0,recordsPassingFiniteFilter:0};
  if(waypointRange) result.recordsOutsideWaypointAddRange=0;
  for(const node of records) {
    if(node.type!=='object') {result.invalidRecordType++;result.recordsFailingFiniteFilter++;continue;}
    const lat=field(node,'lat'),lon=field(node,'lon');
    for(const value of [lat,lon]) { if(value===undefined) result.missingCoordinateFields++; else if(!numeric(value)) result.nonNumericCoordinateFields++; }
    if(!numeric(lat)||!numeric(lon)) {result.recordsFailingFiniteFilter++;continue;}
    result.recordsPassingFiniteFilter++;
    if(waypointRange && (Math.abs(Number(lat.value))>90 || Math.abs(Number(lon.value))>180)) result.recordsOutsideWaypointAddRange++;
  }
  result.coordinateNames='lat/lon';
  result.loadFilter='NUMBER_IS_FINITE_WITHOUT_COERCION';
  result.geographicRangeAssessment=waypointRange?'WAYPOINT_ADD_ONLY_LAT90_LON180':'NOT_ASSESSED_FOR_TRACK_LOAD';
  return result;
}
function fieldLosses(records,kind) {
  const result={extraRecordPropertiesOmitted:0,extraMetadataPropertiesOmitted:0,nameTypeOrLengthChanges:0,
    dateTypeOrFallbackChanges:0,booleanTypeChanges:0,knownMetadataTruncations:0,metadataIconCaseChanges:0,
    metadataFieldsRequiringUnacquiredSanitizers:0,metadataInvalidType:0,styleFieldsNotAssessed:0};
  const keys=kind==='tracks'?TRACK_KEYS:kind==='points'?POINT_KEYS:WAYPOINT_KEYS;
  for(const record of records) {
    if(record.type!=='object') continue;
    result.extraRecordPropertiesOmitted+=countExtra(record,keys);
    const name=field(record,'name'),max=kind==='tracks'?80:60;
    if(!name || name.type!=='string' || name.value.length>max || (kind==='tracks' && name.value==='')) result.nameTypeOrLengthChanges++;
    if(kind==='tracks') {
      if(!numeric(field(record,'savedAt'))) result.dateTypeOrFallbackChanges++;
      for(const key of ['closed','visible']) if(field(record,key)?.type!=='boolean') result.booleanTypeChanges++;
      for(const key of ['color','lineWidth','lineOpacity','lineStyle']) if(field(record,key)) result.styleFieldsNotAssessed++;
    } else if(kind==='waypoints') {
      for(const key of ['createdAt','updatedAt']) if(!numeric(field(record,key))) result.dateTypeOrFallbackChanges++;
    }
    if(kind!=='tracks') {
      const meta=field(record,'meta');
      if(meta && meta.type!=='object') result.metadataInvalidType++;
      if(meta?.type==='object') {
        const allowed=kind==='points'?POINT_META_KEYS:WAYPOINT_META_KEYS;
        result.extraMetadataPropertiesOmitted+=countExtra(meta,allowed);
        for(const [key,value] of meta.value) {
          if(!allowed.includes(key)) continue;
          if(kind==='points' && key==='from' && value.type==='string' && value.value.length>40) result.knownMetadataTruncations++;
          if(kind==='points' && key==='icon' && value.type==='string' && value.value!==value.value.toLowerCase()) result.metadataIconCaseChanges++;
          result.metadataFieldsRequiringUnacquiredSanitizers++;
        }
      }
    }
  }
  return result;
}
function addonSummary(tracks) {
  const result={importedElevations:{absent:0,null:0,object:0,unexpectedType:0,closedTracks:0,
    heightsAbsent:0,heightsUnexpectedType:0,lengthMismatches:0,allNullArrays:0,otherHeightElementTypes:0},
    terrainFill:{absent:0,null:0,object:0,unexpectedType:0,withoutImportedObject:0,
      heightsAbsent:0,heightsUnexpectedType:0,lengthMismatches:0,pointCountMismatches:0,
      slotsOverNonNullOriginals:0,originalArraysWithoutNullGaps:0},
    elevationProfile:{absent:0,null:0,object:0,unexpectedType:0},
    schemaSourceAndHashValidation:'NOT_ASSESSED_CONTRACT_INCOMPLETE',validity:'NOT_ATTESTED'};
  for(const track of tracks) {
    if(track.type!=='object') continue;
    const points=field(track,'points'),count=points?.type==='array'?points.value.length:null;
    for(const name of ['importedElevations','terrainFill','elevationProfile']) {
      const value=field(track,name),out=result[name];
      if(!value) {out.absent++;continue;}
      if(value.type==='null') {out.null++;continue;}
      if(value.type!=='object') {out.unexpectedType++;continue;}
      out.object++;
      if(name==='elevationProfile') continue;
      const heights=field(value,'heights');
      if(!heights) out.heightsAbsent++;
      else if(heights.type!=='array') out.heightsUnexpectedType++;
      else if(count!==null && heights.value.length!==count) out.lengthMismatches++;
      if(name==='importedElevations') {
        if(field(track,'closed')?.type==='boolean' && field(track,'closed').value) out.closedTracks++;
        if(heights?.type==='array') {
          if(heights.value.every(item=>item.type==='null')) out.allNullArrays++;
          out.otherHeightElementTypes+=heights.value.filter(item=>item.type!=='null' && item.type!=='number').length;
        }
      } else {
        const original=field(track,'importedElevations'),originalHeights=field(original,'heights');
        if(original?.type!=='object') out.withoutImportedObject++;
        const pointCount=field(value,'pointCount');
        if(count!==null && (!numeric(pointCount) || Number(pointCount.value)!==count)) out.pointCountMismatches++;
        if(originalHeights?.type==='array') {
          if(!originalHeights.value.some(item=>item.type==='null')) out.originalArraysWithoutNullGaps++;
          if(heights?.type==='array' && heights.value.length===originalHeights.value.length)
            for(let i=0;i<heights.value.length;i++) if(originalHeights.value[i].type!=='null' && heights.value[i].type!=='null') out.slotsOverNonNullOriginals++;
        }
      }
    }
  }
  return result;
}
function auditNodes(httpMain,httpsMain) {
  const reasons=new Set();
  const summary={status:'AUDIT_COMPLETED',scope:'SELECTED_COLLECTIONS_STATIC_PREFLIGHT_ONLY',
    mainSchema:{http:shapeOnly(httpMain),https:shapeOnly(httpsMain)},selection:null,capacity:null,
    roundTripProven:false,completeOriginBackup:false,currentBrowserStateVerified:false,
    candidateDataCreated:false,sourceWrites:false,applicationPerformed:false,
    compatibility:{completeLoadSave:'NOT_ATTESTED',unselectedHttpsSections:'NOT_ATTESTED',
      addonHashesAndSources:'NOT_ASSESSED',referenceIntegrity:'NOT_ASSESSED_CONTRACT_NOT_ACQUIRED',
      styleAndMetadataSanitizers:'NOT_ASSESSED_CONTRACT_INCOMPLETE'}};
  if(httpMain.state!=='OBJECT'||httpsMain.state!=='OBJECT') {
    summary.status='AUDIT_STOP'; summary.candidateReadiness='BLOCKED'; summary.blockingReasons=['MAIN_SCHEMA_NOT_INTERPRETABLE']; return summary;
  }
  const hs=section(httpMain.node,'savedTracks'),ds=section(httpsMain.node,'savedTracks');
  const hw=section(httpMain.node,'mapWaypoints'),dw=section(httpsMain.node,'mapWaypoints');
  summary.selection={mode:'ALL_HTTP_SAVEDTRACKS_AND_MAPWAYPOINTS',expectedHttpTracks:1,expectedHttpWaypoints:200,
    httpTracks:shapeOnly(hs),httpsTracks:shapeOnly(ds),httpWaypoints:shapeOnly(hw),httpsWaypoints:shapeOnly(dw)};
  if([hs,ds,hw,dw].some(value=>value.state!=='ARRAY')) {
    summary.status='AUDIT_STOP';summary.candidateReadiness='BLOCKED';summary.blockingReasons=['SELECTED_COLLECTION_SCHEMA_ABSENT_NULL_OR_INVALID'];return summary;
  }
  const hTracks=hs.node.value,dTracks=ds.node.value,hWp=hw.node.value,dWp=dw.node.value;
  if(hTracks.length!==1||hWp.length!==200) reasons.add('SOURCE_SELECTION_COUNT_DIFFERS_FROM_CONTRACT');
  const tracks=[...dTracks,...hTracks],waypoints=[...dWp,...hWp];
  const pointRecords=[]; let missingPoints=0,invalidPoints=0,tooManyPoints=0,invalidTracks=0;
  const pointIds={missing:0,falsey:0,unsupportedType:0,stringConversions:0,duplicateOccurrencesWithinTracks:0,
    collisionScope:'WITHIN_EACH_TRACK_ONLY',crossTrackIdentityRules:'NOT_ASSESSED'};
  for(const track of tracks) {
    if(track.type!=='object') {invalidTracks++;continue;}
    const points=field(track,'points');
    if(!points) {missingPoints++;continue;}
    if(points.type!=='array') {invalidPoints++;continue;}
    if(points.value.length>2000) tooManyPoints++;
    for(const point of points.value) pointRecords.push(point);
    const observed=ids(points.value).summary;
    for(const key of ['missing','falsey','unsupportedType','stringConversions']) pointIds[key]+=observed[key];
    pointIds.duplicateOccurrencesWithinTracks+=observed.duplicateOccurrences;
  }
  summary.capacity={maxSavedTracks:50,maxPointsPerTrack:2000,maxWaypoints:200,
    projectedSavedTracks:tracks.length,projectedWaypoints:waypoints.length,
    trackLimitExceeded:tracks.length>50,waypointLimitExceeded:waypoints.length>200,tracksOverPointLimit:tooManyPoints};
  summary.structure={invalidTrackRecords:invalidTracks,tracksMissingPoints:missingPoints,tracksWithInvalidPointsType:invalidPoints,
    trackPoints:coordinateCounts(pointRecords,false),mapWaypoints:coordinateCounts(waypoints,true)};
  summary.identifiers={savedTracks:compareIds(hTracks,dTracks),mapWaypoints:compareIds(hWp,dWp),trackPoints:pointIds};
  summary.knownFieldTransformations={tracks:fieldLosses(tracks,'tracks'),trackPoints:fieldLosses(pointRecords,'points'),
    mapWaypoints:fieldLosses(waypoints,'waypoints'),numericTokensChangedByJsonReserialization:{
      selectedHttpTracks:hTracks.reduce((n,node)=>n+numericReencodings(node),0),
      selectedHttpWaypoints:hWp.reduce((n,node)=>n+numericReencodings(node),0),httpsMain:numericReencodings(httpsMain.node)}};
  summary.addons=addonSummary(tracks);
  if(tracks.length>50||waypoints.length>200||tooManyPoints) reasons.add('CAPACITY_EXCEEDED_NO_TRUNCATION_ALLOWED');
  if(invalidTracks||missingPoints||invalidPoints||summary.structure.trackPoints.recordsFailingFiniteFilter||
    summary.structure.mapWaypoints.recordsFailingFiniteFilter) reasons.add('RECORD_OR_COORDINATE_WOULD_FAIL_KNOWN_FILTER');
  if(summary.structure.mapWaypoints.recordsOutsideWaypointAddRange) reasons.add('WAYPOINT_RANGE_REQUIRES_DECISION');
  for(const item of [summary.identifiers.savedTracks,summary.identifiers.mapWaypoints]) {
    if(!item.comparisonComplete) reasons.add('ID_MISSING_FALSEY_OR_UNSUPPORTED');
    if(item.source.duplicateOccurrences||item.destination.duplicateOccurrences||item.crossOriginCollisionKeys) reasons.add('ID_COLLISION_AFTER_STRING');
    if(item.source.stringConversions||item.destination.stringConversions) reasons.add('ID_TYPE_WOULD_CHANGE');
  }
  if(pointIds.missing||pointIds.falsey||pointIds.unsupportedType) reasons.add('POINT_ID_REGENERATION_OR_UNSUPPORTED_TYPE');
  if(pointIds.stringConversions) reasons.add('POINT_ID_TYPE_WOULD_CHANGE');
  if(pointIds.duplicateOccurrencesWithinTracks) reasons.add('POINT_ID_DUPLICATES_REQUIRE_REVIEW');
  for(const value of Object.values(summary.knownFieldTransformations)) {
    if(Object.values(value).some(number=>typeof number==='number'&&number>0) &&
      (value.extraRecordPropertiesOmitted||value.extraMetadataPropertiesOmitted||value.nameTypeOrLengthChanges||
       value.dateTypeOrFallbackChanges||value.booleanTypeChanges||value.knownMetadataTruncations||value.metadataIconCaseChanges))
      reasons.add('KNOWN_NORMALIZATION_WOULD_CHANGE_SELECTED_RECORDS');
  }
  if(Object.values(summary.knownFieldTransformations.numericTokensChangedByJsonReserialization).some(value=>value>0))
    reasons.add('JSON_RESERIALIZATION_WOULD_CHANGE_NUMERIC_TOKENS');
  const imported=summary.addons.importedElevations,fill=summary.addons.terrainFill;
  if(imported.closedTracks||imported.lengthMismatches||imported.allNullArrays||fill.withoutImportedObject||fill.lengthMismatches||fill.pointCountMismatches)
    reasons.add('KNOWN_ADDON_PREREQUISITE_OR_SHAPE_CONFLICT');
  summary.blockingReasons=[...reasons];
  summary.candidateReadiness=reasons.size?'BLOCKED':'NOT_ESTABLISHED';
  summary.nextGate='COMPLETE_LOSSLESS_ROUNDTRIP_AND_APPLICATION_SCOPE_NOT_ATTESTED';
  return summary;
}
function compareHttpCopies(previous,current,qualified) {
  const oldEntries=previous.entries,newEntries=current.entries;
  const output={previousKeys:oldEntries.size,currentKeys:newEntries.size,addedKeys:0,removedKeys:0,
    commonRawIdentical:0,commonRawDifferent:0};
  for(const [key,value] of oldEntries) {
    if(!newEntries.has(key)) output.removedKeys++;
    else if(value===newEntries.get(key)) output.commonRawIdentical++;
    else output.commonRawDifferent++;
  }
  for(const key of newEntries.keys()) if(!oldEntries.has(key)) output.addedKeys++;
  const rawComparison=key=>!oldEntries.has(key)?(!newEntries.has(key)?'BOTH_ABSENT':'ADDED'):
    !newEntries.has(key)?'REMOVED':oldEntries.get(key)===newEntries.get(key)?'IDENTICAL':'DIFFERENT';
  output.mainRawComparison=rawComparison('coordconv_v2');
  output.uiRawComparison=rawComparison('coordconv_ui_v1');
  output.mainStructuralComparison='NOT_COMPARABLE_MAIN_SCHEMA';
  output.knownSections={savedTracks:'NOT_COMPARABLE_MAIN_SCHEMA',mapWaypoints:'NOT_COMPARABLE_MAIN_SCHEMA',settings:'NOT_COMPARABLE_MAIN_SCHEMA'};
  if(previous.main.state==='OBJECT'&&current.main.state==='OBJECT') {
    const oldMain=previous.main.node,newMain=current.main.node;
    output.mainStructuralComparison=qualified.equalNodes(oldMain,newMain)?'IDENTICAL':'DIFFERENT';
    const counts={previousProperties:oldMain.value.size,currentProperties:newMain.value.size,
      added:0,removed:0,commonStructuralIdentical:0,commonStructuralDifferent:0};
    for(const [key,value] of oldMain.value) {
      if(!newMain.value.has(key)) counts.removed++;
      else if(qualified.equalNodes(value,newMain.value.get(key))) counts.commonStructuralIdentical++;
      else counts.commonStructuralDifferent++;
    }
    for(const key of newMain.value.keys()) if(!oldMain.value.has(key)) counts.added++;
    output.topLevelProperties=counts;
    for(const key of Object.keys(output.knownSections)) {
      const a=oldMain.value.get(key),b=newMain.value.get(key);
      output.knownSections[key]=a===undefined?(b===undefined?'BOTH_ABSENT':'ADDED'):
        b===undefined?'REMOVED':qualified.equalNodes(a,b)?'IDENTICAL':'DIFFERENT';
    }
  }
  output.structuralSemantics='ALL_PROPERTIES_INCLUDED_ARRAY_ORDER_PRESERVED_NUMERIC_TOKENS_EXACT';
  return output;
}
function audit(config,comparatorPath,fingerprintHelperPath) {
  const hasProbePin=isObject(config)&&Object.prototype.hasOwnProperty.call(config,'expectedCurrentHttpFingerprintSHA256');
  exactKeys(config,hasProbePin?['schema','inputs','expectedCurrentHttpFingerprintSHA256']:['schema','inputs'],'CONFIG_INVALID');
  need(config.schema===1,'CONFIG_INVALID');
  const hasPrevious=isObject(config.inputs)&&Object.prototype.hasOwnProperty.call(config.inputs,'previousHttpLocalStorage');
  exactKeys(config.inputs,hasPrevious?[...Object.keys(ORIGINS),'previousHttpLocalStorage']:Object.keys(ORIGINS),'CONFIG_INVALID');
  if(hasProbePin) need(isHash(config.expectedCurrentHttpFingerprintSHA256)&&typeof fingerprintHelperPath==='string','FINGERPRINT_CONTRACT_INVALID');
  else need(fingerprintHelperPath===undefined,'FINGERPRINT_CONTRACT_INVALID');
  const qualified=loadComparator(comparatorPath),opened=[],copies={};
  for(const [slot,origin] of Object.entries(ORIGINS)) copies[slot]=readCopy(config.inputs[slot],origin,qualified,opened);
  if(hasPrevious) copies.previousHttpLocalStorage=readCopy(config.inputs.previousHttpLocalStorage,ORIGINS.httpLocalStorage,qualified,opened);
  const result=auditNodes(copies.httpLocalStorage.main,copies.httpsLocalStorage.main);
  result.schema=1;result.auditedUTC=new Date().toISOString();result.qualifiedComparatorSHA256=COMPARATOR_SHA;
  result.sources={httpLocalStorage:copies.httpLocalStorage.source,httpsLocalStorage:copies.httpsLocalStorage.source};
  if(hasPrevious) {
    result.sources.previousHttpLocalStorage=copies.previousHttpLocalStorage.source;
    result.previousToCurrentHttp=compareHttpCopies(copies.previousHttpLocalStorage,copies.httpLocalStorage,qualified);
  }
  if(hasProbePin) {
    const fingerprints=loadPinnedModule(fingerprintHelperPath,FINGERPRINT_HELPER_SHA);
    need(typeof fingerprints.fingerprint==='function','QUALIFIED_MODULE_INVALID');
    const snapshotFingerprintSHA256=fingerprints.fingerprint('LOCALSTORAGE',ORIGINS.httpLocalStorage,[...copies.httpLocalStorage.entries]);
    const matchesReportedProbe=snapshotFingerprintSHA256===config.expectedCurrentHttpFingerprintSHA256;
    result.httpSnapshotProbeBinding={qualifiedFingerprintHelperSHA256:FINGERPRINT_HELPER_SHA,
      snapshotFingerprintSHA256,expectedProbeFingerprintSHA256:config.expectedCurrentHttpFingerprintSHA256,matchesReportedProbe,
      provenance:'COMPARISON_WITH_CALLER_SUPPLIED_PROBE_FINGERPRINT',newBrowserReadPerformed:false};
    if(!matchesReportedProbe) {
      result.candidateReadiness='BLOCKED';result.blockingReasons.push('HTTP_SNAPSHOT_DIFFERS_FROM_REPORTED_PROBE');
    }
  }
  for(const input of opened) stableAgain(input);
  result.inputChecks={artifactHashes:true,receiptHashes:true,receiptContracts:true,uniqueRawStorageKeys:true,sourceStability:true};
  return result;
}
function main(argv) {
  try {
    need((argv.length===2||argv.length===3)&&typeof argv[0]==='string'&&argv[0].length>0&&argv[0].length<=128*1024,'ARGUMENT_INVALID');
    const bytes=Buffer.from(argv[0],'base64');need(bytes.toString('base64')===argv[0],'ARGUMENT_INVALID');
    let config;try {config=JSON.parse(new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(bytes));} catch {throw new AuditFailure('CONFIG_JSON_INVALID');}
    process.stdout.write(JSON.stringify(audit(config,argv[1],argv[2]))+'\n');return 0;
  } catch(error) {
    process.stdout.write(JSON.stringify({schema:1,status:'AUDIT_STOP',code:error instanceof AuditFailure?error.code:'LOCAL_OPERATION_FAILED',
      candidateReadiness:'BLOCKED',roundTripProven:false,candidateDataCreated:false,sourceWrites:false})+'\n');return 1;
  }
}
module.exports={audit,auditNodes,parseMain,loadComparator,compareHttpCopies,AuditFailure,COMPARATOR_SHA,FINGERPRINT_HELPER_SHA,main};
if(require.main===module) process.exitCode=main(process.argv.slice(2));
