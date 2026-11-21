'use strict';

// Local, read-only comparison of four already verified private backup copies.
// No browser/profile access, network, source writes, migration or deduplication.
// CLI: node compare-origin-backups.cjs BASE64_UTF8_CONFIG
// Successful stdout and all failures contain metadata only. The caller saves stdout.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { TextDecoder } = require('node:util');

const MiB = 1024 * 1024;
const LIMITS = Object.freeze({
  receiptBytes: MiB, localStorageBytes: 64 * MiB, indexedDBBytes: 200 * MiB,
  totalInputBytes: 512 * MiB, mainCharacters: 16 * MiB, jsonNodes: 1500000,
  jsonDepth: 128, records: 150000, binaryBytes: 64 * MiB, textUtf16Bytes: 4 * MiB
});
const HTTP = 'http://100.99.54.93:8000';
const HTTPS = 'https://ionos-n8n-new.tailc01234.ts.net';
const SLOTS = Object.freeze({
  httpLocalStorage: { origin: HTTP, kind: 'localStorage', protocol: 'HTTP' },
  httpsLocalStorage: { origin: HTTPS, kind: 'localStorage', protocol: 'HTTPS' },
  httpIndexedDB: { origin: HTTP, kind: 'indexedDB', protocol: 'HTTP' },
  httpsIndexedDB: { origin: HTTPS, kind: 'indexedDB', protocol: 'HTTPS' }
});
const LS_CHECKS = ['sourceSize', 'sourceStableDuringRead', 'sourceSHA256MatchesBrowser',
  'schema', 'uniqueStringPairs', 'copyByteForByte', 'copySHA256MatchesBrowser'];
const IDB_CHECKS = ['sourceSize', 'sourceStableDuringRead', 'sourceSHA256MatchesBrowser',
  'exactSchema', 'uniqueKeys', 'canonicalBase64', 'allBinarySHA256', 'binaryTotal',
  'copyByteForByte', 'copySHA256MatchesBrowser'];
const KNOWN_SECTIONS = ['settings', 'history', 'favorites', 'namedAreas', 'track',
  'mapWaypoints', 'savedTracks', 'gisTracks', 'gisPolygons', 'gisLayers',
  'cartoArchiveRecords', 'lastBatchRows', 'batchInputText', 'rangeRingSets'];
const OVERLAP_SECTIONS = ['savedTracks', 'mapWaypoints', 'gisPolygons'];
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const isHash = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const isCount = value => Number.isSafeInteger(value) && value >= 0;
const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
class ComparisonFailure extends Error { constructor(code) { super(code); this.code = code; } }
function need(condition, code) { if (!condition) throw new ComparisonFailure(code); }
function exactKeys(value, keys, code) {
  need(isObject(value) && Object.keys(value).length === keys.length &&
    keys.every(key => own(value, key)), code);
}
function isISO(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) &&
    Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
}

// Decode JSON without silently overwriting duplicate names or rounding numbers.
// Numbers remain exact lexical tokens. A decimal-to-Number round trip is used
// only to reject unsafe/ambiguous input; it never supplies comparison content.
class JsonFailure extends Error { constructor(code) { super(code); this.code = code; } }
function decimalIdentity(token) {
  const match = /^(-?)(\d+)(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/.exec(token);
  let digits = (match[2] + (match[3] || '')).replace(/^0+/, '');
  if (!digits) return match[1] + '0';
  let exponent = BigInt(match[4] || '0') - BigInt((match[3] || '').length);
  const trailing = /0+$/.exec(digits);
  if (trailing) { digits = digits.slice(0, -trailing[0].length); exponent += BigInt(trailing[0].length); }
  return match[1] + digits + 'e' + exponent.toString();
}
function safeNumberToken(token) {
  if (token.length > 1024) return false;
  const number = Number(token);
  if (!Number.isFinite(number) || (Number.isInteger(number) && !Number.isSafeInteger(number))) return false;
  return decimalIdentity(token) === decimalIdentity(Object.is(number, -0) ? '-0' : String(number));
}
function parseLossless(text, maxCharacters = LIMITS.mainCharacters) {
  if (typeof text !== 'string' || text.length > maxCharacters) throw new JsonFailure('LIMIT');
  let position = 0, nodes = 0;
  const numeric = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/y;
  const bad = code => { throw new JsonFailure(code); };
  const whitespace = () => { while (position < text.length && /[\x20\x09\x0a\x0d]/.test(text[position])) position++; };
  function string() {
    const start = position++;
    while (position < text.length) {
      const character = text[position++];
      if (character === '"') {
        try { return JSON.parse(text.slice(start, position)); } catch { return bad('SYNTAX'); }
      }
      if (character.charCodeAt(0) < 32) bad('SYNTAX');
      if (character === '\\') {
        if (position >= text.length) bad('SYNTAX');
        const escaped = text[position++];
        if (escaped === 'u') {
          if (!/^[a-fA-F0-9]{4}$/.test(text.slice(position, position + 4))) bad('SYNTAX');
          position += 4;
        } else if (!'"\\/bfnrt'.includes(escaped)) bad('SYNTAX');
      }
    }
    return bad('SYNTAX');
  }
  function value(depth) {
    if (depth > LIMITS.jsonDepth || ++nodes > LIMITS.jsonNodes) bad('LIMIT');
    whitespace();
    const character = text[position];
    if (character === '"') return { type: 'string', value: string() };
    if (character === '{') {
      position++; whitespace();
      const properties = new Map();
      if (text[position] === '}') { position++; return { type: 'object', value: properties }; }
      for (;;) {
        if (text[position] !== '"') bad('SYNTAX');
        const key = string();
        if (properties.has(key)) bad('DUPLICATE_KEY');
        whitespace(); if (text[position++] !== ':') bad('SYNTAX');
        properties.set(key, value(depth + 1)); whitespace();
        if (text[position] === '}') { position++; break; }
        if (text[position++] !== ',') bad('SYNTAX');
        whitespace();
      }
      return { type: 'object', value: properties };
    }
    if (character === '[') {
      position++; whitespace();
      const items = [];
      if (text[position] === ']') { position++; return { type: 'array', value: items }; }
      for (;;) {
        items.push(value(depth + 1)); whitespace();
        if (text[position] === ']') { position++; break; }
        if (text[position++] !== ',') bad('SYNTAX');
      }
      return { type: 'array', value: items };
    }
    for (const [token, type, literal] of [['true', 'boolean', true], ['false', 'boolean', false], ['null', 'null', null]]) {
      if (text.startsWith(token, position)) { position += token.length; return { type, value: literal }; }
    }
    numeric.lastIndex = position;
    const match = numeric.exec(text);
    if (!match) return bad('SYNTAX');
    position = numeric.lastIndex;
    if (!safeNumberToken(match[0])) bad('UNSAFE_NUMBER');
    return { type: 'number', value: match[0] };
  }
  const root = value(0); whitespace();
  if (position !== text.length) bad('SYNTAX');
  return root;
}
function materialize(node) {
  if (node.type === 'number') return Number(node.value);
  if (node.type === 'array') return node.value.map(materialize);
  if (node.type === 'object') {
    const output = Object.create(null);
    for (const [key, value] of node.value) output[key] = materialize(value);
    return output;
  }
  return node.value;
}
function readJSON(bytes, code) {
  try {
    const text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes);
    return materialize(parseLossless(text, bytes.length));
  } catch { throw new ComparisonFailure(code); }
}

function sameStamp(a, b) {
  return ['dev', 'ino', 'size', 'mtimeNs', 'ctimeNs'].every(key => a[key] === b[key]);
}
function readStable(filename, maximum, expectedBytes) {
  need(typeof filename === 'string' && path.isAbsolute(filename), 'INPUT_PATH_INVALID');
  let fd;
  try {
    const realpath = fs.realpathSync(filename);
    fd = fs.openSync(filename, 'r');
    const before = fs.fstatSync(fd, { bigint: true });
    need(before.isFile() && before.size > 0n && before.size <= BigInt(maximum), 'INPUT_SIZE_INVALID');
    if (expectedBytes !== undefined) need(before.size === BigInt(expectedBytes), 'INPUT_SIZE_MISMATCH');
    const bytes = Buffer.alloc(Number(before.size));
    let offset = 0;
    while (offset < bytes.length) {
      const count = fs.readSync(fd, bytes, offset, bytes.length - offset, offset);
      need(count > 0, 'INPUT_CHANGED'); offset += count;
    }
    need(fs.readSync(fd, Buffer.alloc(1), 0, 1, bytes.length) === 0, 'INPUT_CHANGED');
    const after = fs.fstatSync(fd, { bigint: true });
    need(sameStamp(before, after) && sameStamp(after, fs.statSync(filename, { bigint: true })) &&
      realpath === fs.realpathSync(filename), 'INPUT_CHANGED');
    return { bytes, filename, realpath, stamp: after };
  } catch (error) {
    if (error instanceof ComparisonFailure) throw error;
    throw new ComparisonFailure('INPUT_READ_FAILED');
  } finally { if (fd !== undefined) fs.closeSync(fd); }
}
function stillStable(input) {
  try {
    need(input.realpath === fs.realpathSync(input.filename) &&
      sameStamp(input.stamp, fs.statSync(input.filename, { bigint: true })), 'INPUT_CHANGED');
  } catch (error) {
    if (error instanceof ComparisonFailure) throw error;
    throw new ComparisonFailure('INPUT_CHANGED');
  }
}
function validateConfig(config) {
  exactKeys(config, ['schema', 'inputs'], 'CONFIG_INVALID');
  need(config.schema === 1, 'CONFIG_INVALID');
  exactKeys(config.inputs, Object.keys(SLOTS), 'CONFIG_INVALID');
  let total = 4 * LIMITS.receiptBytes;
  for (const [slot, contract] of Object.entries(SLOTS)) {
    const pair = config.inputs[slot];
    exactKeys(pair, ['backupPath', 'receiptPath', 'expectedArtifactBytes',
      'expectedArtifactSHA256', 'expectedReceiptSHA256'], 'CONFIG_INVALID');
    need(typeof pair.backupPath === 'string' && path.isAbsolute(pair.backupPath) &&
      typeof pair.receiptPath === 'string' && path.isAbsolute(pair.receiptPath) &&
      isHash(pair.expectedArtifactSHA256) && isHash(pair.expectedReceiptSHA256) &&
      isCount(pair.expectedArtifactBytes) && pair.expectedArtifactBytes > 0, 'CONFIG_INVALID');
    need(pair.expectedArtifactBytes <= LIMITS[contract.kind + 'Bytes'], 'INPUT_SIZE_INVALID');
    total += pair.expectedArtifactBytes;
  }
  need(total <= LIMITS.totalInputBytes, 'INPUT_TOTAL_LIMIT');
}
function validateReceipt(receipt, pair, contract) {
  const isLS = contract.kind === 'localStorage';
  const common = ['schema', 'status', 'coverage', 'origin', 'capturedUTC', 'verifiedUTC',
    'filename', 'sourcePath', 'backupPath', 'bytes', 'sha256', 'checks',
    'completeOriginBackup', 'httpsComparison', 'sourceWrites'];
  const extra = isLS ? ['keys', 'counts'] : ['database', 'databaseVersion', 'store',
    'records', 'binaryBytes', 'textUtf16CodeUnits', 'textUtf16Bytes'];
  exactKeys(receipt, common.concat(extra), 'RECEIPT_SCHEMA_INVALID');
  need(receipt.schema === 1 && receipt.status === 'VERIFIED' && receipt.origin === contract.origin &&
    receipt.coverage === (isLS ? 'LOCALSTORAGE_ONLY' : 'INDEXEDDB_TILES_ONLY') &&
    isISO(receipt.capturedUTC) && isISO(receipt.verifiedUTC) &&
    receipt.verifiedUTC >= receipt.capturedUTC && receipt.bytes === pair.expectedArtifactBytes &&
    receipt.sha256 === pair.expectedArtifactSHA256 && receipt.sourceWrites === false &&
    receipt.completeOriginBackup === false && receipt.httpsComparison === 'NOT_PERFORMED' &&
    typeof receipt.sourcePath === 'string' && typeof receipt.backupPath === 'string', 'RECEIPT_CONTRACT_INVALID');
  const expectedFilename = 'TMAR-GIS-P0-' + contract.protocol + '-' +
    (isLS ? 'localStorage' : 'IndexedDB') + '-' + receipt.capturedUTC.replace(/[-:.]/g, '') + '.json';
  need(receipt.filename === expectedFilename, 'RECEIPT_FILENAME_INVALID');
  const checks = isLS ? LS_CHECKS : IDB_CHECKS;
  exactKeys(receipt.checks, checks, 'RECEIPT_CHECKS_INVALID');
  need(checks.every(key => receipt.checks[key] === true), 'RECEIPT_CHECKS_INVALID');
  if (isLS) need(isCount(receipt.keys) && isObject(receipt.counts), 'RECEIPT_COUNTS_INVALID');
  else need(receipt.database === 'CoordConvMapTiles' && receipt.databaseVersion === 1 &&
    receipt.store === 'tiles' && ['records', 'binaryBytes', 'textUtf16CodeUnits', 'textUtf16Bytes']
      .every(key => isCount(receipt[key])), 'RECEIPT_COUNTS_INVALID');
}
function validateLocalStorage(data, receipt) {
  exactKeys(data, ['formato', 'origine', 'acquisitoUTC', 'copertura', 'stabilita',
    'numeroChiavi', 'unitaUTF16ChiaviValori', 'entries'], 'LOCALSTORAGE_SCHEMA_INVALID');
  need(data.formato === 'TMAR-GIS-P0-LOCALSTORAGE-V1' && data.origine === receipt.origin &&
    data.acquisitoUTC === receipt.capturedUTC && data.copertura === 'LOCALSTORAGE_ONLY' &&
    data.stabilita === 'DUE_LETTURE_COINCIDENTI' && Array.isArray(data.entries) &&
    data.numeroChiavi === data.entries.length && data.numeroChiavi === receipt.keys &&
    isCount(data.unitaUTF16ChiaviValori), 'LOCALSTORAGE_CONTRACT_INVALID');
  const entries = new Map();
  let units = 0;
  for (const pair of data.entries) {
    need(Array.isArray(pair) && pair.length === 2 && pair.every(value => typeof value === 'string') &&
      !entries.has(pair[0]), 'LOCALSTORAGE_PAIR_INVALID');
    entries.set(pair[0], pair[1]); units += pair[0].length + pair[1].length;
  }
  need(units === data.unitaUTF16ChiaviValori, 'LOCALSTORAGE_TOTAL_INVALID');
  return entries;
}
function validateIndexedDB(data, receipt) {
  exactKeys(data, ['formato', 'origine', 'acquisitoUTC', 'copertura', 'database', 'store',
    'transactionMode', 'numeroRecords', 'byteBinari', 'records'], 'INDEXEDDB_SCHEMA_INVALID');
  exactKeys(data.database, ['name', 'version'], 'INDEXEDDB_SCHEMA_INVALID');
  exactKeys(data.store, ['name', 'keyPath', 'autoIncrement', 'indexes'], 'INDEXEDDB_SCHEMA_INVALID');
  need(data.formato === 'TMAR-GIS-P0-IDB-TILES-V1' && data.origine === receipt.origin &&
    data.acquisitoUTC === receipt.capturedUTC && data.copertura === 'INDEXEDDB_TILES_ONLY' &&
    data.database.name === 'CoordConvMapTiles' && data.database.version === 1 &&
    data.store.name === 'tiles' && data.store.keyPath === null && data.store.autoIncrement === false &&
    Array.isArray(data.store.indexes) && data.store.indexes.length === 0 && data.transactionMode === 'readonly' &&
    Array.isArray(data.records) && data.records.length <= LIMITS.records &&
    data.numeroRecords === data.records.length && data.numeroRecords === receipt.records &&
    isCount(data.byteBinari) && data.byteBinari <= LIMITS.binaryBytes, 'INDEXEDDB_CONTRACT_INVALID');
  const records = new Map();
  let binaryBytes = 0, units = 0;
  for (const record of data.records) {
    exactKeys(record, ['key', 'ct', 'bBase64', 'byteLength', 'sha256'], 'INDEXEDDB_RECORD_INVALID');
    need(typeof record.key === 'string' && typeof record.ct === 'string' &&
      typeof record.bBase64 === 'string' && isCount(record.byteLength) &&
      record.byteLength <= LIMITS.binaryBytes && isHash(record.sha256) &&
      !records.has(record.key), 'INDEXEDDB_RECORD_INVALID');
    units += record.key.length + record.ct.length;
    binaryBytes += record.byteLength;
    need(units * 2 <= LIMITS.textUtf16Bytes && binaryBytes <= LIMITS.binaryBytes, 'INDEXEDDB_TOTAL_LIMIT');
    need(record.bBase64.length === 4 * Math.ceil(record.byteLength / 3), 'INDEXEDDB_BASE64_INVALID');
    const bytes = Buffer.from(record.bBase64, 'base64');
    need(bytes.length === record.byteLength && bytes.toString('base64') === record.bBase64,
      'INDEXEDDB_BASE64_INVALID');
    need(digest(bytes) === record.sha256, 'INDEXEDDB_BINARY_HASH_MISMATCH');
    records.set(record.key, { mime: record.ct, bytes });
  }
  need(binaryBytes === data.byteBinari && binaryBytes === receipt.binaryBytes &&
    units === receipt.textUtf16CodeUnits && units * 2 === receipt.textUtf16Bytes, 'INDEXEDDB_TOTAL_INVALID');
  return records;
}

function equalNodes(a, b) {
  if (a.type !== b.type) return false;
  if (a.type === 'array') return a.value.length === b.value.length &&
    a.value.every((node, index) => equalNodes(node, b.value[index]));
  if (a.type === 'object') return a.value.size === b.value.size &&
    [...a.value].every(([key, node]) => b.value.has(key) && equalNodes(node, b.value.get(key)));
  return a.value === b.value;
}
function structuralKey(node) {
  if (node.type === 'array') return '[' + node.value.map(structuralKey).join(',') + ']';
  if (node.type === 'object') return '{' + [...node.value.keys()].sort().map(key =>
    JSON.stringify(key) + ':' + structuralKey(node.value.get(key))).join(',') + '}';
  if (node.type === 'number') return 'n:' + node.value;
  return node.type + ':' + JSON.stringify(node.value);
}
function summarizeNode(node) {
  const summary = { type: node.type };
  if (node.type === 'array') summary.items = node.value.length;
  if (node.type === 'object') summary.properties = node.value.size;
  if (node.type === 'string') summary.empty = node.value.length === 0;
  return summary;
}
function mainSnapshot(entries) {
  if (!entries.has('coordconv_v2')) return { summary: { presence: 'ABSENT', interpretation: 'NOT_APPLICABLE' } };
  const raw = entries.get('coordconv_v2');
  const summary = { presence: 'PRESENT', rawEmpty: raw.length === 0 };
  let node;
  try { node = parseLossless(raw); }
  catch (error) {
    if (!(error instanceof JsonFailure)) throw error;
    summary.interpretation = 'UNINTERPRETABLE_' + error.code;
    return { raw, summary };
  }
  summary.interpretation = 'LOSSLESS_JSON';
  summary.root = summarizeNode(node);
  if (node.type === 'object') {
    summary.knownSections = Object.fromEntries(KNOWN_SECTIONS.map(key => [key,
      node.value.has(key) ? summarizeNode(node.value.get(key)) : { type: 'absent' }]));
    summary.unknownTopLevelProperties = [...node.value.keys()].filter(key => !KNOWN_SECTIONS.includes(key)).length;
  }
  return { raw, node, summary };
}
function exactContentOverlap(httpNode, httpsNode) {
  if (!httpNode || !httpsNode || httpNode.type !== 'array' || httpsNode.type !== 'array') {
    return { status: 'NOT_PERFORMED_NON_ARRAY_OR_UNINTERPRETABLE' };
  }
  const counts = new Map();
  for (const node of httpNode.value) {
    const key = structuralKey(node); counts.set(key, (counts.get(key) || 0) + 1);
  }
  let commonExact = 0;
  for (const node of httpsNode.value) {
    const key = structuralKey(node), count = counts.get(key) || 0;
    if (count > 0) { commonExact++; counts.set(key, count - 1); }
  }
  return { status: 'EXACT_STRUCTURAL_CONTENT_OVERLAP', semantics: 'MULTISET_OCCURRENCES',
    httpItems: httpNode.value.length, httpsItems: httpsNode.value.length, commonExact,
    onlyHTTP: httpNode.value.length - commonExact, onlyHTTPS: httpsNode.value.length - commonExact };
}
function compareLocalStorage(httpEntries, httpsEntries) {
  let onlyHTTP = 0, onlyHTTPS = 0, commonRawIdentical = 0, commonRawDifferent = 0;
  for (const [key, value] of httpEntries) {
    if (!httpsEntries.has(key)) onlyHTTP++;
    else if (value === httpsEntries.get(key)) commonRawIdentical++;
    else commonRawDifferent++;
  }
  for (const key of httpsEntries.keys()) if (!httpEntries.has(key)) onlyHTTPS++;
  const http = mainSnapshot(httpEntries), https = mainSnapshot(httpsEntries);
  const main = {
    http: http.summary, https: https.summary,
    rawComparison: http.raw === undefined ? (https.raw === undefined ? 'BOTH_ABSENT' : 'HTTPS_ONLY') :
      https.raw === undefined ? 'HTTP_ONLY' : http.raw === https.raw ? 'IDENTICAL' : 'DIFFERENT',
    structuralComparison: http.node && https.node ? (equalNodes(http.node, https.node) ? 'IDENTICAL' : 'DIFFERENT') :
      'NOT_PERFORMED_ABSENT_OR_UNINTERPRETABLE',
    objectPropertyOrder: 'IGNORED', arrayOrder: 'PRESERVED', numericComparison: 'EXACT_SAFE_JSON_TOKENS',
    unknownProperties: 'INCLUDED', recordIdentityAnalysis: 'NOT_PERFORMED_SCHEMA_NOT_ACQUIRED'
  };
  if (http.node?.type === 'object' && https.node?.type === 'object') {
    const counts = { onlyHTTP: 0, onlyHTTPS: 0, commonIdentical: 0, commonDifferent: 0 };
    for (const [key, node] of http.node.value) {
      if (!https.node.value.has(key)) counts.onlyHTTP++;
      else if (equalNodes(node, https.node.value.get(key))) counts.commonIdentical++;
      else counts.commonDifferent++;
    }
    for (const key of https.node.value.keys()) if (!http.node.value.has(key)) counts.onlyHTTPS++;
    main.topLevelProperties = counts;
  }
  main.contentOverlap = Object.fromEntries(OVERLAP_SECTIONS.map(key => [key,
    exactContentOverlap(http.node?.type === 'object' ? http.node.value.get(key) : undefined,
      https.node?.type === 'object' ? https.node.value.get(key) : undefined)]));
  return { httpKeys: httpEntries.size, httpsKeys: httpsEntries.size,
    unionKeys: onlyHTTP + onlyHTTPS + commonRawIdentical + commonRawDifferent,
    onlyHTTP, onlyHTTPS, commonRawIdentical, commonRawDifferent, main };
}
function compareIndexedDB(httpRecords, httpsRecords) {
  const counts = { httpRecords: httpRecords.size, httpsRecords: httpsRecords.size, unionKeys: 0,
    onlyHTTP: 0, onlyHTTPS: 0, commonIdentical: 0, commonDivergent: 0,
    divergence: { mimeOnly: 0, bytesOnly: 0, mimeAndBytes: 0 },
    httpBinaryBytes: 0, httpsBinaryBytes: 0 };
  for (const [key, record] of httpRecords) {
    counts.httpBinaryBytes += record.bytes.length;
    if (!httpsRecords.has(key)) { counts.onlyHTTP++; continue; }
    const other = httpsRecords.get(key);
    const sameMime = record.mime === other.mime, sameBytes = record.bytes.equals(other.bytes);
    if (sameMime && sameBytes) counts.commonIdentical++;
    else {
      counts.commonDivergent++;
      counts.divergence[sameMime ? 'bytesOnly' : sameBytes ? 'mimeOnly' : 'mimeAndBytes']++;
    }
  }
  for (const [key, record] of httpsRecords) {
    counts.httpsBinaryBytes += record.bytes.length;
    if (!httpRecords.has(key)) counts.onlyHTTPS++;
  }
  counts.unionKeys = counts.onlyHTTP + counts.onlyHTTPS + counts.commonIdentical + counts.commonDivergent;
  return counts;
}
function compare(config) {
  validateConfig(config);
  const opened = [], inputs = Object.create(null), sources = Object.create(null);
  for (const [slot, contract] of Object.entries(SLOTS)) {
    const pair = config.inputs[slot];
    const receiptInput = readStable(pair.receiptPath, LIMITS.receiptBytes); opened.push(receiptInput);
    need(digest(receiptInput.bytes) === pair.expectedReceiptSHA256, 'RECEIPT_HASH_MISMATCH');
    const receipt = readJSON(receiptInput.bytes, 'RECEIPT_JSON_INVALID');
    validateReceipt(receipt, pair, contract);
    const artifact = readStable(pair.backupPath, LIMITS[contract.kind + 'Bytes'], pair.expectedArtifactBytes);
    opened.push(artifact);
    need(digest(artifact.bytes) === pair.expectedArtifactSHA256, 'ARTIFACT_HASH_MISMATCH');
    const data = readJSON(artifact.bytes, 'ARTIFACT_JSON_INVALID');
    inputs[slot] = contract.kind === 'localStorage' ? validateLocalStorage(data, receipt) : validateIndexedDB(data, receipt);
    sources[slot] = { origin: receipt.origin, coverage: receipt.coverage, capturedUTC: receipt.capturedUTC,
      verifiedUTC: receipt.verifiedUTC, artifactBytes: artifact.bytes.length,
      artifactSHA256: pair.expectedArtifactSHA256, receiptSHA256: pair.expectedReceiptSHA256 };
  }
  const result = {
    schema: 1, status: 'COMPARED', comparedUTC: new Date().toISOString(),
    coverage: 'FOUR_VERIFIED_LOCALSTORAGE_AND_INDEXEDDB_EXPORTS_ONLY', sources,
    localStorage: compareLocalStorage(inputs.httpLocalStorage, inputs.httpsLocalStorage),
    indexedDB: compareIndexedDB(inputs.httpIndexedDB, inputs.httpsIndexedDB),
    checks: { artifactHashes: true, receiptHashes: true, receiptContracts: true,
      exactExportSchemas: true, uniqueStorageKeys: true, canonicalBase64: true,
      allBinaryHashes: true, inputStableDuringReadAndComparison: true },
    snapshots: { atomicAcrossStoresOrOrigins: false, currentBrowserStateVerified: false,
      allCaptureTimesIdentical: new Set(Object.values(sources).map(source => source.capturedUTC)).size === 1 },
    completeOriginBackup: false, sourceWrites: false, migration: 'NOT_PERFORMED', cleanup: 'NOT_PERFORMED',
    comparisonAuthorizesMigrationOrDeduplication: false
  };
  for (const input of opened) stillStable(input);
  return result;
}
function decodeConfig(encoded) {
  need(typeof encoded === 'string' && encoded.length > 0 && encoded.length <= 64 * 1024, 'CONFIG_INVALID');
  const bytes = Buffer.from(encoded, 'base64');
  need(bytes.toString('base64') === encoded, 'CONFIG_INVALID');
  return readJSON(bytes, 'CONFIG_INVALID');
}
async function browserResidualProbe() {
  "use strict";
  const expected = ["http://100.99.54.93:8000", "https://ionos-n8n-new.tailc01234.ts.net"];
  const origin = location.origin;
  const pathAllowed = location.pathname === "/__tmar_p0_inventory__" || location.pathname === "/gis/__tmar_p0_inventory__";
  if (!expected.includes(origin) || window.top !== window || !pathAllowed) {
    console.log(JSON.stringify({schema:1, kind:"TMAR_P0_RESIDUAL_INVENTORY", status:"STOP_CONTEXT", storageMutationCalls:0}));
    return;
  }
  const beganUTC = new Date().toISOString();
  const fail = e => ({status:e && (e.name === "SecurityError" || e.name === "NotAllowedError") ? "DENIED" : "ERROR", count:null});
  const sync = fn => { try { return fn(); } catch(e) { return fail(e); } };
  const timed = async fn => {
    let timer;
    try {
      return await Promise.race([
        Promise.resolve().then(fn),
        new Promise(resolve => { timer = setTimeout(() => resolve({status:"TIMEOUT",count:null}),15000); })
      ]);
    } catch(e) { return fail(e); }
    finally { if(timer !== undefined) clearTimeout(timer); }
  };
  const count = n => {
    if (!Number.isSafeInteger(n) || n < 0) throw new Error("COUNT");
    return {status:"OK",count:n};
  };
  const localStorageCatalog = sync(() => count(localStorage.length));
  const sessionStorageCatalog = sync(() => ({...count(sessionStorage.length),coverage:"CURRENT_TAB_SESSION_ONLY",valuesBackedUp:false}));
  const visibleCookies = sync(() => {
    const raw = document.cookie;
    if (raw.length > 1048576) return {status:"LIMIT",count:null};
    return {...count(raw === "" ? 0 : raw.split(";").filter(x => x.trim() !== "").length),coverage:"DOCUMENT_VISIBLE_ONLY",httpOnlyExcluded:true,otherPathsExcluded:true,valuesBackedUp:false};
  });
  const opfs = sync(() => ({
    status:"NOT_INSPECTED",count:null,
    apiAvailable:!!(navigator.storage && typeof navigator.storage.getDirectory === "function"),
    rootOpened:false
  }));
  const legacyFileSystem = sync(() => ({
    status:"NOT_INSPECTED",count:null,
    apiAvailable:typeof window.webkitRequestFileSystem === "function" || typeof window.requestFileSystem === "function",
    rootOpened:false
  }));
  const webSQL = sync(() => ({
    status:"NOT_INSPECTED",count:null,
    apiAvailable:typeof window.openDatabase === "function",
    databasesOpened:0
  }));
  const [indexedDBCatalog,cacheStorageCatalog,serviceWorkers] = await Promise.all([
    timed(async () => {
      if (!window.indexedDB || typeof indexedDB.databases !== "function") return {status:"UNAVAILABLE",count:null};
      const entries = await indexedDB.databases();
      if (!Array.isArray(entries)) throw new Error("CATALOG");
      const known = entries.filter(x => x && x.name === "CoordConvMapTiles");
      return {...count(entries.length),expectedPresent:known.length === 1,expectedVersion:known.length === 1 && Number.isSafeInteger(known[0].version) ? known[0].version : null,otherDatabases:entries.length-known.length,databasesOpened:0};
    }),
    timed(async () => {
      if (!("caches" in window) || !window.caches || typeof caches.keys !== "function") return {status:"UNAVAILABLE",count:null};
      const names = await caches.keys();
      if (!Array.isArray(names)) throw new Error("CATALOG");
      return {...count(names.length),cachesOpened:0};
    }),
    timed(async () => {
      if (!("serviceWorker" in navigator) || !navigator.serviceWorker || typeof navigator.serviceWorker.getRegistrations !== "function") return {status:"UNAVAILABLE",count:null,controlled:null};
      const entries = await navigator.serviceWorker.getRegistrations();
      if (!Array.isArray(entries)) throw new Error("CATALOG");
      return {...count(entries.length),controlled:navigator.serviceWorker.controller !== null};
    })
  ]);
  const result = {
    schema:1,kind:"TMAR_P0_RESIDUAL_INVENTORY",status:"READ_ONLY_PARTIAL",
    origin,neutralPath:location.pathname,secureContext:window.isSecureContext,
    beganUTC,finishedUTC:new Date().toISOString(),coverage:"METADATA_CATALOG_ONLY",
    localStorageCatalog,sessionStorageCatalog,visibleCookies,indexedDBCatalog,
    cacheStorageCatalog,serviceWorkers,opfs,legacyFileSystem,webSQL,
    storageMutationCalls:0,explicitNetworkRequests:0,atomicSnapshot:false,completeOriginBackup:false
  };
  console.log(JSON.stringify(result));
  return undefined;
}

function makeResidualProbeSource() {
  return '(' + browserResidualProbe.toString() + ')();\n';
}
function main(argv) {
  try {
    if (argv.length === 1 && argv[0] === '--probe-source') {
      process.stdout.write(makeResidualProbeSource());
      return 0;
    }
    need(argv.length === 1, 'CONFIG_INVALID');
    process.stdout.write(JSON.stringify(compare(decodeConfig(argv[0]))) + '\n');
    return 0;
  } catch (error) {
    process.stdout.write(JSON.stringify({ schema: 1, status: 'STOP',
      code: error instanceof ComparisonFailure ? error.code : 'LOCAL_OPERATION_FAILED',
      completeOriginBackup: false, sourceWrites: false }) + '\n');
    return 1;
  }
}

module.exports = { compare, compareLocalStorage, compareIndexedDB, parseLossless, equalNodes,
  ComparisonFailure, LIMITS, main, browserResidualProbe, makeResidualProbeSource };
if (require.main === module) process.exitCode = main(process.argv.slice(2));
