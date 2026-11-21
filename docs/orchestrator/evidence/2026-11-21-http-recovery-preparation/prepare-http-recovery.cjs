'use strict';

// Read-only preparation of current-content checks. No recovery/migration writes.
// --baseline BASE64_FOUR_INPUT_CONFIG ABSOLUTE_QUALIFIED_COMPARATOR_PATH
// --probe-source BASE64_BASELINE_ENVELOPE
// stdout is metadata, or browser code containing metadata only. No file is saved.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const Module = require('node:module');
const { TextDecoder } = require('node:util');
const QUALIFIED_COMPARATOR_SHA256 = '2b52af8981bcc76927a2129faea8daceeb539f38222930633afde94222a56f3a';
const QUALIFIED_SHA256_SOURCE_SHA256 = '615504f07e6ef979eb9129007de145e14d91fa40d9c9178aae47364d37c67cb1';
const SHA256_SOURCE = "  function sha256(bytes) {\n    const K = [\n      0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,\n      0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,\n      0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,\n      0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,\n      0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,\n      0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,\n      0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,\n      0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2\n    ];\n    const h = new Uint32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]);\n    const padded = new Uint8Array(Math.ceil((bytes.length + 9) / 64) * 64);\n    padded.set(bytes);\n    padded[bytes.length] = 0x80;\n    const view = new DataView(padded.buffer);\n    view.setUint32(padded.length - 8, Math.floor(bytes.length / 0x20000000));\n    view.setUint32(padded.length - 4, (bytes.length * 8) >>> 0);\n    const w = new Uint32Array(64);\n    const r = (x, n) => (x >>> n) | (x << (32 - n));\n    for (let offset = 0; offset < padded.length; offset += 64) {\n      for (let t = 0; t < 16; t++) w[t] = view.getUint32(offset + t * 4);\n      for (let t = 16; t < 64; t++) {\n        const x = w[t - 15], y = w[t - 2];\n        w[t] = w[t - 16] + (r(x,7)^r(x,18)^(x>>>3)) + w[t - 7] + (r(y,17)^r(y,19)^(y>>>10));\n      }\n      let [a,b,c,d,e,f,g,z] = h;\n      for (let t = 0; t < 64; t++) {\n        const t1 = (z + (r(e,6)^r(e,11)^r(e,25)) + ((e&f)^((~e)&g)) + K[t] + w[t]) >>> 0;\n        const t2 = ((r(a,2)^r(a,13)^r(a,22)) + ((a&b)^(a&c)^(b&c))) >>> 0;\n        z=g; g=f; f=e; e=(d+t1)>>>0; d=c; c=b; b=a; a=(t1+t2)>>>0;\n      }\n      [a,b,c,d,e,f,g,z].forEach((v,i) => { h[i] = h[i] + v; });\n    }\n    return Array.from(h, v => v.toString(16).padStart(8,\"0\")).join(\"\");\n  }";
const HTTP = 'http://100.99.54.93:8000';
const HTTPS = 'https://ionos-n8n-new.tailc01234.ts.net';
const SLOTS = Object.freeze({
  httpLocalStorage: { origin: HTTP, side: 'http', kind: 'LOCALSTORAGE', maxBytes: 64 * 1024 * 1024 },
  httpsLocalStorage: { origin: HTTPS, side: 'https', kind: 'LOCALSTORAGE', maxBytes: 64 * 1024 * 1024 },
  httpIndexedDB: { origin: HTTP, side: 'http', kind: 'INDEXEDDB_TILES', maxBytes: 200 * 1024 * 1024 },
  httpsIndexedDB: { origin: HTTPS, side: 'https', kind: 'INDEXEDDB_TILES', maxBytes: 200 * 1024 * 1024 }
});
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const isHash = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const isCount = value => Number.isSafeInteger(value) && value >= 0;
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const isISO = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) &&
  Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
class PreparationFailure extends Error { constructor(code) { super(code); this.code = code; } }
function need(condition, code) { if (!condition) throw new PreparationFailure(code); }
function exactKeys(value, keys, code) {
  need(isObject(value) && Object.keys(value).length === keys.length &&
    keys.every(key => Object.prototype.hasOwnProperty.call(value, key)), code);
}

// Identical serializer is embedded in the browser probe. Sorting never changes
// input records. UTF-16 string ordering and JSON string escaping are explicit.
function contentPreimage(kind, origin, tuples) {
  const ordered = tuples.slice().sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
  return 'TMAR-GIS-P0-CONTENT-FINGERPRINT-V1\n' + kind + '\n' + origin + '\n' +
    JSON.stringify(ordered) + '\n';
}
function fingerprint(kind, origin, tuples) {
  const bytes = Buffer.from(contentPreimage(kind, origin, tuples), 'utf8');
  need(bytes.length <= (kind === 'LOCALSTORAGE' ? 64 : 32) * 1024 * 1024, 'FINGERPRINT_SIZE_LIMIT');
  return hash(bytes);
}
function sameStamp(a, b) {
  return ['dev', 'ino', 'size', 'mtimeNs', 'ctimeNs'].every(key => a[key] === b[key]);
}
function readPinned(filename, expectedSHA256, maxBytes, expectedBytes) {
  need(typeof filename === 'string' && path.isAbsolute(filename) && isHash(expectedSHA256), 'INPUT_CONTRACT_INVALID');
  let descriptor;
  try {
    const realpath = fs.realpathSync(filename);
    descriptor = fs.openSync(filename, 'r');
    const before = fs.fstatSync(descriptor, { bigint: true });
    need(before.isFile() && before.size > 0n && before.size <= BigInt(maxBytes), 'INPUT_SIZE_INVALID');
    if (expectedBytes !== undefined) need(before.size === BigInt(expectedBytes), 'INPUT_SIZE_MISMATCH');
    const bytes = Buffer.alloc(Number(before.size));
    let offset = 0;
    while (offset < bytes.length) {
      const count = fs.readSync(descriptor, bytes, offset, bytes.length - offset, offset);
      need(count > 0, 'INPUT_CHANGED'); offset += count;
    }
    need(fs.readSync(descriptor, Buffer.alloc(1), 0, 1, bytes.length) === 0, 'INPUT_CHANGED');
    const after = fs.fstatSync(descriptor, { bigint: true });
    need(sameStamp(before, after) && sameStamp(after, fs.statSync(filename, { bigint: true })) &&
      realpath === fs.realpathSync(filename), 'INPUT_CHANGED');
    need(hash(bytes) === expectedSHA256, 'INPUT_HASH_MISMATCH');
    return bytes;
  } catch (error) {
    if (error instanceof PreparationFailure) throw error;
    throw new PreparationFailure('INPUT_READ_FAILED');
  } finally { if (descriptor !== undefined) fs.closeSync(descriptor); }
}
function decodeJSON(bytes, code) {
  try { return JSON.parse(new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes)); }
  catch { throw new PreparationFailure(code); }
}
function decodeArgument(encoded) {
  need(typeof encoded === 'string' && encoded.length > 0 && encoded.length <= 128 * 1024, 'ARGUMENT_INVALID');
  const bytes = Buffer.from(encoded, 'base64');
  need(bytes.toString('base64') === encoded, 'ARGUMENT_INVALID');
  return decodeJSON(bytes, 'ARGUMENT_JSON_INVALID');
}
function loadQualifiedComparator(filename) {
  const bytes = readPinned(filename, QUALIFIED_COMPARATOR_SHA256, 256 * 1024);
  // Compile the exact pinned buffer; do not reopen a possibly replaced module.
  const qualified = new Module(filename, module);
  qualified.filename = filename;
  qualified.paths = Module._nodeModulePaths(path.dirname(filename));
  qualified._compile(bytes.toString('utf8'), filename);
  qualified.loaded = true;
  need(typeof qualified.exports.compare === 'function', 'QUALIFIED_MODULE_INVALID');
  return qualified.exports;
}
function prepareBaseline(config, comparatorPath) {
  const qualified = loadQualifiedComparator(comparatorPath);
  let verified;
  try { verified = qualified.compare(config); }
  catch { throw new PreparationFailure('BASELINE_INPUT_VERIFICATION_FAILED'); }
  const body = {
    schema: 1, kind: 'TMAR_P0_CURRENT_CONTENT_BASELINE',
    algorithm: 'TMAR-GIS-P0-CONTENT-FINGERPRINT-V1', preparedUTC: new Date().toISOString(),
    sources: verified.sources,
    origins: { http: { origin: HTTP }, https: { origin: HTTPS } },
    qualifiedComparatorSHA256: QUALIFIED_COMPARATOR_SHA256,
    qualifiedShaFunctionSHA256: QUALIFIED_SHA256_SOURCE_SHA256,
    snapshotAtomicAcrossStoresOrOrigins: false, completeOriginBackup: false, sourceWrites: false
  };
  for (const [slot, contract] of Object.entries(SLOTS)) {
    const source = verified.sources[slot];
    // The qualified comparison validates receipts and every record first.
    // This second bounded read is independently pinned to exactly the same
    // artifact identity; parsing and fingerprinting use this one hashed buffer.
    const bytes = readPinned(config.inputs[slot].backupPath, source.artifactSHA256,
      contract.maxBytes, source.artifactBytes);
    const data = decodeJSON(bytes, 'PINNED_ARTIFACT_JSON_INVALID');
    if (contract.kind === 'LOCALSTORAGE') {
      body.origins[contract.side].localStorage = {
        keys: data.entries.length, textUtf16CodeUnits: data.unitaUTF16ChiaviValori,
        fingerprintSHA256: fingerprint(contract.kind, contract.origin, data.entries)
      };
    } else {
      const tuples = data.records.map(record => [record.key, record.ct, record.byteLength, record.sha256]);
      body.origins[contract.side].indexedDB = {
        databasePresent: true, databaseVersion: 1, records: data.numeroRecords,
        binaryBytes: data.byteBinari,
        textUtf16Bytes: 2 * tuples.reduce((sum, tuple) => sum + tuple[0].length + tuple[1].length, 0),
        fingerprintSHA256: fingerprint(contract.kind, contract.origin, tuples)
      };
    }
  }
  return { status: 'BASELINE_PREPARED', baseline: body,
    baselineSHA256: hash(Buffer.from(JSON.stringify(body) + '\n', 'utf8')) };
}
function validateBaseline(envelope) {
  exactKeys(envelope, ['status', 'baseline', 'baselineSHA256'], 'BASELINE_INVALID');
  need(envelope.status === 'BASELINE_PREPARED' && isHash(envelope.baselineSHA256), 'BASELINE_INVALID');
  const body = envelope.baseline;
  exactKeys(body, ['schema', 'kind', 'algorithm', 'preparedUTC', 'sources', 'origins',
    'qualifiedComparatorSHA256', 'qualifiedShaFunctionSHA256', 'snapshotAtomicAcrossStoresOrOrigins',
    'completeOriginBackup', 'sourceWrites'], 'BASELINE_INVALID');
  need(body.schema === 1 && body.kind === 'TMAR_P0_CURRENT_CONTENT_BASELINE' &&
    body.algorithm === 'TMAR-GIS-P0-CONTENT-FINGERPRINT-V1' &&
    body.qualifiedComparatorSHA256 === QUALIFIED_COMPARATOR_SHA256 &&
    body.qualifiedShaFunctionSHA256 === QUALIFIED_SHA256_SOURCE_SHA256 &&
    body.snapshotAtomicAcrossStoresOrOrigins === false && body.completeOriginBackup === false &&
    body.sourceWrites === false && isISO(body.preparedUTC), 'BASELINE_INVALID');
  exactKeys(body.origins, ['http', 'https'], 'BASELINE_INVALID');
  exactKeys(body.sources, Object.keys(SLOTS), 'BASELINE_INVALID');
  for (const [slot, contract] of Object.entries(SLOTS)) {
    const source = body.sources[slot];
    exactKeys(source, ['origin', 'coverage', 'capturedUTC', 'verifiedUTC', 'artifactBytes',
      'artifactSHA256', 'receiptSHA256'], 'BASELINE_INVALID');
    need(source.origin === contract.origin &&
      source.coverage === (contract.kind === 'LOCALSTORAGE' ? 'LOCALSTORAGE_ONLY' : 'INDEXEDDB_TILES_ONLY') &&
      isCount(source.artifactBytes) && source.artifactBytes > 0 && source.artifactBytes <= contract.maxBytes &&
      isHash(source.artifactSHA256) && isHash(source.receiptSHA256) &&
      isISO(source.capturedUTC) && isISO(source.verifiedUTC) && source.verifiedUTC >= source.capturedUTC, 'BASELINE_INVALID');
  }
  for (const [side, expectedOrigin] of [['http', HTTP], ['https', HTTPS]]) {
    const entry = body.origins[side];
    exactKeys(entry, ['origin', 'localStorage', 'indexedDB'], 'BASELINE_INVALID');
    exactKeys(entry.localStorage, ['keys', 'textUtf16CodeUnits', 'fingerprintSHA256'], 'BASELINE_INVALID');
    exactKeys(entry.indexedDB, ['databasePresent', 'databaseVersion', 'records', 'binaryBytes',
      'textUtf16Bytes', 'fingerprintSHA256'], 'BASELINE_INVALID');
    need(entry.origin === expectedOrigin && isCount(entry.localStorage.keys) &&
      entry.localStorage.keys <= 150000 && isCount(entry.localStorage.textUtf16CodeUnits) &&
      entry.localStorage.textUtf16CodeUnits * 2 <= 64 * 1024 * 1024 &&
      isHash(entry.localStorage.fingerprintSHA256) && entry.indexedDB.databasePresent === true &&
      entry.indexedDB.databaseVersion === 1 && isCount(entry.indexedDB.records) &&
      entry.indexedDB.records <= 150000 && isCount(entry.indexedDB.binaryBytes) &&
      entry.indexedDB.binaryBytes <= 64 * 1024 * 1024 && isCount(entry.indexedDB.textUtf16Bytes) &&
      entry.indexedDB.textUtf16Bytes <= 4 * 1024 * 1024 && isHash(entry.indexedDB.fingerprintSHA256), 'BASELINE_INVALID');
  }
  need(hash(Buffer.from(JSON.stringify(body) + '\n', 'utf8')) === envelope.baselineSHA256, 'BASELINE_HASH_MISMATCH');
}

// Browser-only function. It is inert in Node and receives no private paths.
function browserCurrentContentProbe(envelope, sha256, preimage) {
  'use strict';
  return new Promise(resolve => {
    const startedUTC = new Date().toISOString();
    const deadline = performance.now() + 60000;
    const MAX_RECORDS = 150000, MAX_BINARY = 64 * 1024 * 1024, MAX_IDB_TEXT = 4 * 1024 * 1024;
    const MAX_LS_TEXT = 64 * 1024 * 1024;
    let finished = false, db = null, tx = null, timer, origin = null, expected;
    let tuples = [], seen = new Set(), binaryBytes = 0, idbTextBytes = 0;
    let count = null, cursorDone = false, initialLS = null, lsFingerprint = null, lsUnits = 0;
    let openings = 0;
    class ProbeFailure extends Error { constructor(code) { super(code); this.code = code; } }
    const close = connection => { try { connection.close(); } catch {} };
    function finish(status, details = {}) {
      if (finished) return;
      finished = true;
      if (timer !== undefined) clearTimeout(timer);
      if (tx) { try { tx.abort(); } catch {} tx = null; }
      if (db) { close(db); db = null; }
      tuples = []; seen.clear(); initialLS = null;
      resolve({ schema: 1, kind: 'TMAR_P0_CURRENT_CONTENT_CHECK', status, origin,
        startedUTC, finishedUTC: new Date().toISOString(), baselineSHA256: envelope?.baselineSHA256 || null,
        coverage: 'LOCALSTORAGE_AND_INDEXEDDB_CURRENT_FINGERPRINTS_ONLY',
        atomicAcrossStoresOrOrigins: false, subsequentChangesExcluded: false,
        completeOriginBackup: false, sourceWrites: false, networkRequests: 0, downloads: 0, ...details });
    }
    function guard() {
      if (finished || performance.now() >= deadline) throw new ProbeFailure('STOP_TIMEOUT');
    }
    function fail(error, fallback) { finish(error instanceof ProbeFailure ? error.code : fallback); }
    function requireCondition(condition, code) { if (!condition) throw new ProbeFailure(code); }
    function digestPreimage(kind, values) {
      guard();
      const bytes = new TextEncoder().encode(preimage(kind, origin, values));
      requireCondition(bytes.length <= (kind === 'LOCALSTORAGE' ? 64 : 32) * 1024 * 1024, 'STOP_FINGERPRINT_SIZE_LIMIT');
      guard(); const result = sha256(bytes); guard();
      return result;
    }
    function readLS() {
      guard();
      const size = localStorage.length, keys = [];
      requireCondition(Number.isSafeInteger(size) && size >= 0 && size <= MAX_RECORDS, 'STOP_LOCALSTORAGE_LIMIT');
      for (let i = 0; i < size; i++) { guard(); keys.push(localStorage.key(i)); }
      requireCondition(keys.every(key => typeof key === 'string') && new Set(keys).size === size, 'STOP_LOCALSTORAGE_CHANGED');
      keys.sort();
      const pairs = [];
      let units = 0;
      for (const key of keys) {
        guard();
        const value = localStorage.getItem(key);
        requireCondition(typeof value === 'string', 'STOP_LOCALSTORAGE_CHANGED');
        units += key.length + value.length;
        requireCondition(units * 2 <= MAX_LS_TEXT, 'STOP_LOCALSTORAGE_LIMIT');
        pairs.push([key, value]);
      }
      requireCondition(localStorage.length === size, 'STOP_LOCALSTORAGE_CHANGED');
      return { pairs, units, raw: JSON.stringify(pairs) };
    }
    function finishComparison(indexedDB) {
      try {
        guard();
        const finalOne = readLS(), finalTwo = readLS();
        requireCondition(finalOne.raw === initialLS.raw && finalTwo.raw === initialLS.raw, 'STOP_LOCALSTORAGE_CHANGED');
        const local = { keys: initialLS.pairs.length, textUtf16CodeUnits: lsUnits, fingerprintSHA256: lsFingerprint,
          matchesBaseline: lsFingerprint === expected.localStorage.fingerprintSHA256 &&
            initialLS.pairs.length === expected.localStorage.keys && lsUnits === expected.localStorage.textUtf16CodeUnits };
        guard();
        finish(local.matchesBaseline && indexedDB.matchesBaseline ? 'CURRENT_CONTENT_MATCHES_BASELINE' : 'CURRENT_CONTENT_DIFFERS',
          { localStorage: local, indexedDB, localStorageReads: 'TWO_INITIAL_AND_TWO_FINAL_COINCIDENT',
            coverage: indexedDB.databasePresent ? 'LOCALSTORAGE_AND_INDEXEDDB_CURRENT_FINGERPRINTS_ONLY' :
              'LOCALSTORAGE_CURRENT_FINGERPRINT_AND_IDB_CATALOG_ONLY' });
      } catch (error) { fail(error, 'STOP_LOCALSTORAGE_FINAL_READ'); }
    }
    function acquire(connection) {
      db = connection;
      db.onversionchange = () => finish('STOP_VERSION_CHANGED');
      db.onclose = () => finish('STOP_DATABASE_CLOSED');
      try {
        guard();
        const stores = Array.from(db.objectStoreNames);
        requireCondition(db.name === 'CoordConvMapTiles' && db.version === 1 && stores.length === 1 && stores[0] === 'tiles',
          'STOP_DATABASE_SCHEMA');
        tx = db.transaction(['tiles'], 'readonly');
        tx.onabort = () => finish('STOP_TRANSACTION_ABORTED');
        tx.onerror = () => finish('STOP_TRANSACTION_ERROR');
        tx.oncomplete = () => {
          tx = null;
          if (finished) return;
          try {
            guard();
            requireCondition(cursorDone && count !== null && count === tuples.length, 'STOP_COUNT_MISMATCH');
            const completed = db; db = null;
            try { completed.onversionchange = null; completed.onclose = null; completed.close(); }
            catch { close(completed); return finish('STOP_DATABASE_CLOSE_UNCONFIRMED'); }
            const fingerprintSHA256 = digestPreimage('INDEXEDDB_TILES', tuples);
            finishComparison({ databasePresent: true, databaseVersion: 1, records: count, binaryBytes,
              textUtf16Bytes: idbTextBytes, fingerprintSHA256, databaseOpenings: openings,
              transactionMode: 'readonly', matchesBaseline: fingerprintSHA256 === expected.indexedDB.fingerprintSHA256 &&
                count === expected.indexedDB.records && binaryBytes === expected.indexedDB.binaryBytes &&
                idbTextBytes === expected.indexedDB.textUtf16Bytes });
          } catch (error) { fail(error, 'STOP_FINAL_FINGERPRINT'); }
        };
        const store = tx.objectStore('tiles');
        requireCondition(store.keyPath === null && store.autoIncrement === false && store.indexNames.length === 0,
          'STOP_STORE_SCHEMA');
        const countRequest = store.count(), cursorRequest = store.openCursor();
        countRequest.onerror = () => finish('STOP_COUNT_ERROR');
        countRequest.onsuccess = () => {
          if (finished) return;
          try {
            guard(); const value = countRequest.result;
            requireCondition(Number.isSafeInteger(value) && value >= 0 && value <= MAX_RECORDS, 'STOP_RECORD_LIMIT');
            count = value;
          } catch (error) { fail(error, 'STOP_COUNT_ERROR'); }
        };
        cursorRequest.onerror = () => finish('STOP_CURSOR_ERROR');
        cursorRequest.onsuccess = () => {
          if (finished) return;
          try {
            guard(); const cursor = cursorRequest.result;
            if (cursor === null) { cursorDone = true; return; }
            const key = cursor.key, value = cursor.value;
            requireCondition(typeof key === 'string' && cursor.primaryKey === key && !seen.has(key), 'STOP_KEY_TYPE');
            requireCondition(value && Object.getPrototypeOf(value) === Object.prototype, 'STOP_VALUE_TYPE');
            const properties = Reflect.ownKeys(value);
            requireCondition(properties.length === 2 && properties.includes('b') && properties.includes('ct') &&
              value.b instanceof ArrayBuffer && typeof value.ct === 'string', 'STOP_VALUE_TYPE');
            const bytes = new Uint8Array(value.b), addedText = 2 * (key.length + value.ct.length);
            requireCondition(tuples.length < MAX_RECORDS && bytes.length <= MAX_BINARY - binaryBytes &&
              addedText <= MAX_IDB_TEXT - idbTextBytes, 'STOP_INDEXEDDB_LIMIT');
            const binarySHA256 = sha256(bytes); guard();
            tuples.push([key, value.ct, bytes.length, binarySHA256]); seen.add(key);
            binaryBytes += bytes.length; idbTextBytes += addedText;
            cursor.continue();
          } catch (error) { fail(error, 'STOP_RECORD_READ'); }
        };
      } catch (error) { fail(error, 'STOP_TRANSACTION_OPEN'); }
    }
    try {
      const currentOrigin = location.origin;
      requireCondition((currentOrigin === 'http://100.99.54.93:8000' || currentOrigin === 'https://ionos-n8n-new.tailc01234.ts.net') &&
        window.top === window &&
        (location.pathname === '/__tmar_p0_inventory__' || location.pathname === '/gis/__tmar_p0_inventory__') &&
        location.search === '' && location.hash === '', 'STOP_CONTEXT');
      origin = currentOrigin;
      timer = setTimeout(() => finish('STOP_TIMEOUT'), 60000);
      guard();
      const body = envelope.baseline;
      requireCondition(envelope.status === 'BASELINE_PREPARED' && body?.schema === 1 &&
        body.algorithm === 'TMAR-GIS-P0-CONTENT-FINGERPRINT-V1' &&
        sha256(new TextEncoder().encode(JSON.stringify(body) + '\n')) === envelope.baselineSHA256, 'STOP_BASELINE_INTEGRITY');
      expected = body.origins[currentOrigin === 'http://100.99.54.93:8000' ? 'http' : 'https'];
      requireCondition(expected?.origin === currentOrigin && expected.indexedDB.databasePresent === true, 'STOP_BASELINE_ORIGIN');
      initialLS = readLS(); const second = readLS();
      requireCondition(initialLS.raw === second.raw, 'STOP_LOCALSTORAGE_CHANGED');
      lsUnits = initialLS.units;
      lsFingerprint = digestPreimage('LOCALSTORAGE', initialLS.pairs);
      const idb = globalThis.indexedDB;
      requireCondition(idb && typeof idb.databases === 'function', 'STOP_CATALOG_API');
      Promise.resolve(idb.databases()).then(catalog => {
        if (finished) return;
        try {
          guard(); requireCondition(Array.isArray(catalog), 'STOP_CATALOG');
          if (catalog.length === 0) return finishComparison({ databasePresent: false, databaseVersion: null,
            records: null, binaryBytes: null, textUtf16Bytes: null, fingerprintSHA256: null,
            databaseOpenings: 0, transactionMode: null, matchesBaseline: false });
          requireCondition(catalog.length === 1 && catalog[0]?.name === 'CoordConvMapTiles' && catalog[0]?.version === 1,
            'STOP_CATALOG');
          const request = idb.open('CoordConvMapTiles', 1); openings++;
          request.onupgradeneeded = () => {
            let aborted = false;
            try { request.transaction.abort(); aborted = true; } catch {}
            try { close(request.result); } catch {}
            finish(aborted ? 'STOP_UPGRADE_ABORTED' : 'STOP_UPGRADE_ABORT_UNCONFIRMED');
          };
          request.onblocked = () => finish('STOP_DATABASE_BLOCKED');
          request.onerror = () => finish('STOP_DATABASE_OPEN');
          request.onsuccess = () => {
            try {
              const connection = request.result;
              if (finished) { close(connection); return; }
              acquire(connection);
            } catch (error) { fail(error, 'STOP_DATABASE_CONNECTION'); }
          };
        } catch (error) { fail(error, 'STOP_CATALOG_OR_OPEN'); }
      }, () => finish('STOP_CATALOG_READ'));
    } catch (error) { fail(error, 'STOP_PROBE'); }
  });
}
function makeProbeSource(envelope) {
  validateBaseline(envelope);
  need(hash(Buffer.from(SHA256_SOURCE, 'utf8')) === QUALIFIED_SHA256_SOURCE_SHA256, 'QUALIFIED_SHA_SOURCE_CHANGED');
  return '(() => {\n"use strict";\n' + SHA256_SOURCE + '\n' + contentPreimage.toString() + '\n' +
    browserCurrentContentProbe.toString() + '\nreturn browserCurrentContentProbe(' + JSON.stringify(envelope) +
    ', sha256, contentPreimage).then(result => { console.log(JSON.stringify(result)); }, () => {' +
    ' console.log(JSON.stringify({schema:1,kind:"TMAR_P0_CURRENT_CONTENT_CHECK",status:"STOP_INTERNAL",sourceWrites:false}));' +
    ' });\n})();\n';
}
function main(argv) {
  try {
    if (argv.length === 3 && argv[0] === '--baseline') {
      const result = prepareBaseline(decodeArgument(argv[1]), argv[2]);
      validateBaseline(result);
      process.stdout.write(JSON.stringify(result) + '\n');
      return 0;
    }
    if (argv.length === 2 && argv[0] === '--probe-source') {
      process.stdout.write(makeProbeSource(decodeArgument(argv[1])));
      return 0;
    }
    throw new PreparationFailure('ARGUMENT_INVALID');
  } catch (error) {
    process.stdout.write(JSON.stringify({ schema: 1, status: 'STOP',
      code: error instanceof PreparationFailure ? error.code : 'LOCAL_OPERATION_FAILED',
      sourceWrites: false, completeOriginBackup: false }) + '\n');
    return 1;
  }
}
module.exports = { prepareBaseline, validateBaseline, makeProbeSource, contentPreimage, fingerprint,
  browserCurrentContentProbe, PreparationFailure, QUALIFIED_COMPARATOR_SHA256,
  QUALIFIED_SHA256_SOURCE_SHA256, SHA256_SOURCE, main };
if (require.main === module) process.exitCode = main(process.argv.slice(2));
