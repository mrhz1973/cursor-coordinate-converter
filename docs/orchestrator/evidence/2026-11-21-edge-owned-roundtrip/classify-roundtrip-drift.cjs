'use strict';
// Offline classification of already preserved roundtrip artifacts. No browser/runtime execution.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), Module = require('module');
const COMPARATOR_SHA = '2b52af8981bcc76927a2129faea8daceeb539f38222930633afde94222a56f3a';
const RECEIPT_SHA = '62ee2ca63078314e4e68df07228f49c034055b5ae1c2077b787734de0519d259';
const RECEIPT_BYTES = 18662;
const SOURCE_PINS = {
  baseline: { bytes: 388370, sha256: '9ed07e750fb110484a0a6c0417dedd129773759dde12b4e5f24abfc926905578' },
  candidate: { bytes: 417285, sha256: '2cbf48cea7f6baef931018185f031d244f56ba9223924f0cda567c0c983bf865' }
};
const MAIN_KEYS = ['settings','history','favorites','namedAreas','track','mapWaypoints','savedTracks',
  'gisTracks','gisPolygons','gisLayers','cartoArchiveRecords','lastBatchRows','batchInputText','rangeRingSets'];
const SETTINGS_KEYS = ["persist","theme","lang","primary","batchClosed","forceOffline","mapZoom","mapLayer","mapSize","showGrid","showSeamarks","showSonarChart","showWaymarkedHiking","showStravaRunHeatmap","showHillshadeOverlay","showCoverage","mapMeasureUnit","trackDisplayUnit","savedTracksColumnWidths","savedTracksSort","wpTableColumnWidths","wpTableSort","polygonPanelColumnWidths","polygonPanelSort","offlineAreaColumnWidths","offlineAreaSort","rrTableWidths","rrTableSort","favTableWidths","favTableSort","astroWpTableWidths","astroFavTableWidths","astroWpTableSort","astroFavTableSort","batchTableWidths","batchTableSort","mapMeasureKind","mapPolyClosed","gisMeasureFlow","geocodeEnabled","geocodeReverseAuto","geocodeEndpoint","geocodeBatchLoc","opsecStrict","showExtraFormats","showDatumExtras","exportDatumExtras","compositeTab","tilePackHints","favNamePattern","favExTag","favCatTag","reportTitle","reportClass","gisMode","activeTab","waypointMapNameDisplay","rangeRingsLastStyle"];
const TABLE_SETTINGS = SETTINGS_KEYS.slice(SETTINGS_KEYS.indexOf('savedTracksColumnWidths'), SETTINGS_KEYS.indexOf('batchTableSort') + 1);
const LAYER_KEYS = ['id','name','type','visible','locked','color','featureIds'];
const PHASES = ['boot','save1','reload','save2'];
const CODE = new Set();
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
function stop(code) { CODE.add(code); const e = new Error(code); e.safeCode = code; throw e; }
function need(ok, code) { if (!ok) stop(code); }
function safe(e) { return e && CODE.has(e.safeCode) ? e.safeCode : 'LOCAL_OPERATION_FAILED'; }
function inside(child, parent) { const r = path.relative(parent,child); return r === '' || (!path.isAbsolute(r) && r !== '..' && !r.startsWith('..' + path.sep)); }
function localPath(p) { need(typeof p === 'string' && path.isAbsolute(p) && !p.startsWith('\\\\') && !p.startsWith('//'), 'LOCAL_ABSOLUTE_PATH_REQUIRED'); }
function readStable(file, pin) {
  localPath(file); const a = fs.statSync(file), bytes = fs.readFileSync(file), b = fs.statSync(file);
  need(a.isFile() && a.size === b.size && a.mtimeMs === b.mtimeMs && a.ino === b.ino, 'INPUT_UNSTABLE');
  const identity = { bytes: bytes.length, sha256: hash(bytes) };
  if (pin) need((pin.bytes === undefined || identity.bytes === pin.bytes) && identity.sha256 === pin.sha256, 'INPUT_PIN_MISMATCH');
  return { bytes, identity };
}
function json(bytes) { try { return JSON.parse(bytes.toString('utf8')); } catch (_) { stop('INPUT_JSON'); } }
function writeNew(file, value) {
  const bytes = Buffer.from(JSON.stringify(value, null, 2) + '\n');
  fs.writeFileSync(file, bytes, { flag: 'wx', mode: 0o600 }); need(fs.readFileSync(file).equals(bytes), 'OUTPUT_READBACK');
  return { file: path.basename(file), bytes: bytes.length, sha256: hash(bytes) };
}
function compilePinned(bytes, filename) {
  const m = new Module(filename, module); m.filename = filename; m.paths = Module._nodeModulePaths(path.dirname(filename));
  m._compile(bytes.toString('utf8'), filename); return m.exports;
}
function main(configPath, runPath) {
  const checked = [];
  function acquire(label, file, pin) { const r = readStable(file,pin); checked.push({label,file,...r.identity}); return r.bytes; }
  const config = json(acquire('config',configPath));
  localPath(config.outputDirectory); localPath(runPath);
  const outputRoot = fs.realpathSync.native(config.outputDirectory), runDirectory = fs.realpathSync.native(runPath);
  need(inside(runDirectory,outputRoot), 'RUN_OUTPUT_SCOPE');
  const receipt = json(acquire('roundtripReceipt',path.join(runDirectory,'receipt.json'),{bytes:RECEIPT_BYTES,sha256:RECEIPT_SHA}));
  need(receipt.formato === 'TMAR-GIS-P0-ISOLATED-ROUNDTRIP-RECEIPT-V2' && receipt.purpose === 'PRIVATE_QUALIFICATION' &&
    receipt.status === 'PROCEDURE_COMPLETED_REQUIRES_ASSESSMENT', 'ROUNDTRIP_RECEIPT_SCOPE');
  const comparatorBytes = acquire('comparator',config.comparatorPath,{sha256:COMPARATOR_SHA});
  const {parseLossless,equalNodes} = compilePinned(comparatorBytes,config.comparatorPath);
  need(typeof parseLossless === 'function' && typeof equalNodes === 'function', 'COMPARATOR_API');
  const field = (node,key) => node && node.type === 'object' ? node.value.get(key) : undefined;
  const same = (a,b) => a === undefined || b === undefined ? a === b : equalNodes(a,b);
  const kind = node => node === undefined ? 'ABSENT' : node.type;
  function store(envelope) {
    need(envelope && Array.isArray(envelope.entries), 'ENTRIES_SCHEMA'); const entries = new Map();
    for (const pair of envelope.entries) {
      need(Array.isArray(pair) && pair.length === 2 && pair.every(x=>typeof x==='string') && !entries.has(pair[0]), 'ENTRIES_SCHEMA');
      entries.set(pair[0],pair[1]);
    }
    need(entries.has('coordconv_v2'), 'MAIN_MISSING');
    let node; try { node = parseLossless(entries.get('coordconv_v2')); } catch (_) { stop('MAIN_LOSSLESS_PARSE'); }
    need(node.type === 'object', 'MAIN_SCHEMA'); return node;
  }
  function objectDiff(a,b,whitelist) {
    need(a && b && a.type === 'object' && b.type === 'object', 'OBJECT_DIFF_SCHEMA');
    const allowed = new Set(whitelist), result = { added:[], removed:[], changed:[], unchanged:[],
      changedTypes:[], unknown:{input:0,output:0,added:0,removed:0,changed:0} };
    for (const key of whitelist) {
      const x=a.value.get(key), y=b.value.get(key);
      if (x === undefined && y === undefined) continue;
      const bucket=x===undefined?'added':y===undefined?'removed':same(x,y)?'unchanged':'changed';
      result[bucket].push(key);
      if(bucket!=='unchanged') result.changedTypes.push({field:key,input:kind(x),output:kind(y)});
    }
    for(const key of a.value.keys()) if(!allowed.has(key)) result.unknown.input++;
    for(const key of b.value.keys()) if(!allowed.has(key)) result.unknown.output++;
    for(const key of new Set([...a.value.keys(),...b.value.keys()])) if(!allowed.has(key)) {
      const x=a.value.get(key),y=b.value.get(key);
      if(x===undefined) result.unknown.added++; else if(y===undefined) result.unknown.removed++; else if(!same(x,y)) result.unknown.changed++;
    }
    return result;
  }
  const noUnknownDrift = diff => diff.unknown.added===0 && diff.unknown.removed===0 && diff.unknown.changed===0;
  const exactSet = (a,b) => a.length===b.length && a.every(key=>b.includes(key));
  function settingsDiff(a,b) {
    const diff=objectDiff(field(a,'settings'),field(b,'settings'),SETTINGS_KEYS);
    return { ...diff,
      preexistingSettingsPreserved:diff.changed.length===0&&diff.removed.length===0&&noUnknownDrift(diff),
      exactDocumentedTableSettingsMaterialized:exactSet(diff.added,TABLE_SETTINGS)&&diff.changed.length===0&&diff.removed.length===0&&noUnknownDrift(diff) };
  }
  function layersDiff(a,b) {
    const x=field(a,'gisLayers'),y=field(b,'gisLayers'),wps=field(b,'mapWaypoints');
    need(x?.type==='array'&&y?.type==='array'&&wps?.type==='array', 'LAYERS_SCHEMA');
    const strip = node => { need(node.type==='object','LAYER_RECORD_SCHEMA'); return {type:'object',value:new Map([...node.value].filter(([key])=>key!=='featureIds'))}; };
    const strippedEqual=equalNodes({type:'array',value:x.value.map(strip)},{type:'array',value:y.value.map(strip)});
    const changedNames=new Set();let unknownChanged=0,changedRows=0,onlyWaypointLayer=true;
    for(let i=0;i<Math.min(x.value.length,y.value.length);i++) {
      const diff=objectDiff(x.value[i],y.value[i],LAYER_KEYS);
      for(const key of [...diff.added,...diff.removed,...diff.changed]) changedNames.add(key);
      unknownChanged+=diff.unknown.added+diff.unknown.removed+diff.unknown.changed;
      if(!same(field(x.value[i],'featureIds'),field(y.value[i],'featureIds'))) {
        changedRows++;
        // Fixed selector from the public runtime, never emitted as an identifier.
        const id=field(y.value[i],'id'); if(id?.type!=='string'||id.value!=='lay-seed-waypoints') onlyWaypointLayer=false;
      }
    }
    const waypointLayers=y.value.filter(row=>field(row,'id')?.type==='string'&&field(row,'id').value==='lay-seed-waypoints');
    const ids=wps.value.map(row=>field(row,'id'));
    const stringIds=ids.every(id=>id?.type==='string');
    const expected={type:'array',value:ids.slice(0,500)};
    const actual=waypointLayers.length===1?field(waypointLayers[0],'featureIds'):undefined;
    const indexMatches=stringIds&&actual?.type==='array'&&equalNodes(expected,actual);
    return { layerArrayLengthPreserved:x.value.length===y.value.length,
      allLayerPropertiesExceptFeatureIdsPreserved:strippedEqual, changedLayerFieldNames:[...changedNames].sort(),
      unknownLayerFieldDifferences:unknownChanged, featureIdArraysChanged:changedRows,
      changedFeatureIdsOnlyOnWaypointSeedLayer:onlyWaypointLayer,
      canonicalWaypointStringIdsEligible:stringIds, uniqueWaypointSeedLayer:waypointLayers.length===1,
      waypointFeatureIdsExactlyMatchCanonicalIds:indexMatches,
      documentedIndexRebuildExplainsDifference:strippedEqual&&unknownChanged===0&&onlyWaypointLayer&&indexMatches };
  }
  const originals={};
  for(const arm of ['baseline','candidate']) {
    need(config[arm] && config[arm].sha256===SOURCE_PINS[arm].sha256 && config[arm].bytes===SOURCE_PINS[arm].bytes,'SOURCE_CONFIG_PIN');
    originals[arm]=store(json(acquire(arm+'Original',config[arm].path,SOURCE_PINS[arm])));
  }
  const snapshots={};
  for(const [arm,label] of [['baseline','baseline-https'],['candidate','candidate']]) {
    const rows=receipt.arms.filter(x=>x.label===label);need(rows.length===1,'RECEIPT_ARM');snapshots[arm]={};
    for(const phase of PHASES) {
      const matches=rows[0].snapshots.filter(x=>x.phase===phase);need(matches.length===1&&matches[0].file===phase+'.json','SNAPSHOT_METADATA');
      const meta=matches[0],file=path.join(runDirectory,label,meta.file);
      need(inside(fs.realpathSync.native(file),runDirectory),'SNAPSHOT_PHYSICAL_SCOPE');
      const envelope=json(acquire(arm+'_'+phase,file,meta));
      need(envelope.formato==='TMAR-GIS-P0-ISOLATED-ROUNDTRIP-SNAPSHOT-V1'&&envelope.arm===label&&envelope.phase===phase,'SNAPSHOT_SCOPE');
      snapshots[arm][phase]=store(envelope);
    }
  }
  const results=[];
  for(const phase of PHASES) {
    const output={phase};
    for(const arm of ['baseline','candidate']) {
      const before=originals[arm],after=snapshots[arm][phase];
      output[arm]={main:objectDiff(before,after,MAIN_KEYS),settings:settingsDiff(before,after),layers:layersDiff(before,after)};
    }
    const b=snapshots.baseline[phase],c=snapshots.candidate[phase];
    const bs=field(b,'settings'),cs=field(c,'settings');
    output.betweenArms={settingsEqualInFull:equalNodes(bs,cs),
      addedTableSettingsEqual:TABLE_SETTINGS.every(key=>same(field(bs,key),field(cs,key))),
      main:objectDiff(b,c,MAIN_KEYS),layers:layersDiff(b,c)};
    results.push(output);
  }
  // Deduplicate identical phase classifications; the compared private values are never serialized.
  const grouped=new Map();
  for(const {phase,...value} of results) {
    const key=JSON.stringify(value); const group=grouped.get(key)||{phases:[],...value};group.phases.push(phase);grouped.set(key,group);
  }
  const mainExplained = diff => diff.added.length===0&&diff.removed.length===0&&noUnknownDrift(diff)&&diff.changed.every(key=>['settings','gisLayers'].includes(key));
  const settingsExplained=results.every(r=>r.baseline.settings.exactDocumentedTableSettingsMaterialized&&r.candidate.settings.exactDocumentedTableSettingsMaterialized&&r.betweenArms.settingsEqualInFull);
  const layersExplained=results.every(r=>r.baseline.layers.documentedIndexRebuildExplainsDifference&&r.candidate.layers.documentedIndexRebuildExplainsDifference&&r.betweenArms.layers.documentedIndexRebuildExplainsDifference);
  const otherFieldsPreserved=results.every(r=>mainExplained(r.baseline.main)&&mainExplained(r.candidate.main));
  const output={schema:'TMAR-GIS-P0-ROUNDTRIP-DRIFT-CLASSIFICATION-V1',status:'CLASSIFICATION_COMPLETED',acquiredUTC:new Date().toISOString(),
    runtimeRerun:false,browserStarted:false,sourceWrites:false,operatorOriginStorageModified:false,applicationAuthorized:false,
    runtimeRules:{saveStore:'29035-29144',tableSettingsLoad:'106711-106728',layerFeatureIndexSync:'69284-69297',layerSanitizer:'69237-69254'},
    mainWhitelistCount:MAIN_KEYS.length,settingsWhitelistCount:SETTINGS_KEYS.length,documentedTableSettingsCount:TABLE_SETTINGS.length,
    sourceSettingsIdentical:equalNodes(field(originals.baseline,'settings'),field(originals.candidate,'settings')),
    classifications:[...grouped.values()],
    conclusions:{settingsMaterializationConfirmed:settingsExplained,canonicalLayerIndexRebuildConfirmed:layersExplained,
      allOtherMainFieldsPreserved:otherFieldsPreserved,allObservedDriftExplained:settingsExplained&&layersExplained&&otherFieldsPreserved},
    inputs:checked.map(({label,bytes,sha256})=>({label,bytes,sha256}))};
  for(const entry of checked) readStable(entry.file,entry);
  output.inputsUnchanged=true;
  const destination=fs.mkdtempSync(path.join(runDirectory,'drift-classification-'));
  const artifact=writeNew(path.join(destination,'receipt.json'),output);
  process.stdout.write(JSON.stringify({status:output.status,runDirectory:destination,receipt:artifact,
    allObservedDriftExplained:output.conclusions.allObservedDriftExplained,applicationAuthorized:false})+'\n');
  return 0;
}
if(require.main===module) {
  try { process.exitCode=main(process.argv[2],process.argv[3]); }
  catch(e) { process.stdout.write(JSON.stringify({status:'STOP',reason:safe(e),browserStarted:false,runtimeRerun:false})+'\n');process.exitCode=2; }
}
