'use strict';
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
const sourcePath = process.argv[2];
const outputPath = process.argv[3];
if (!sourcePath) throw new Error('Source HTML path required');
const bytes = fs.readFileSync(sourcePath);
const source = bytes.toString('utf8');
function fn(name) {
  const match = new RegExp('^function ' + name + '\\(', 'm').exec(source);
  if (!match) throw new Error('Missing original function ' + name);
  for (let end = source.indexOf('}', match.index); end !== -1; end = source.indexOf('}', end + 1)) {
    const fragment = source.slice(match.index, end + 1);
    try { new vm.Script('(' + fragment + ')'); return fragment; } catch (_) {}
    if (end - match.index > 100000) throw new Error('Extraction bound exceeded');
  }
  throw new Error('Cannot extract ' + name);
}
function cn(name) {
  const match = new RegExp('^const ' + name + '\\s*=.*?;', 'm').exec(source);
  if (!match) throw new Error('Missing original constant ' + name);
  return match[0];
}
const names = [
  'trackUpdatePointLatLon', 'ensureTrackState', 'normalizeLon',
  'savedTrackFnv1a32Hex', 'savedTrackGeometryHash', 'spatialImportedElevationNumber',
  'savedTrackSanitizeImportedElevations', 'savedTrackBuildImportedElevations'
];
const constants = ['TRACK_POINTS_CAP', 'SAVED_TRACK_ELEVATION_MIN_M', 'SAVED_TRACK_ELEVATION_MAX_M',
  'SAVED_TRACK_IMPORTED_ELEVATION_SCHEMA', 'SAVED_TRACK_IMPORTED_ELEVATION_SOURCE'];
const state = {};
const context = vm.createContext({ state });
const api = vm.runInContext(constants.map(cn).join('\n') + '\n' + names.map(fn).join('\n') +
  '\n({' + names.join(',') + '})', context, { timeout: 2000 });
function reset() {
  state.track = { closed: false, points: [
    { id: 'a', lat: 44, lon: 9, _importEle: 123 },
    { id: 'b', lat: 44.001, lon: 9.002, _importEle: 124 }
  ] };
}
const tests = [];
function check(id, lat, lon, expectedHeights, expectedLat, expectedLon) {
  reset();
  try {
    api.trackUpdatePointLatLon('a', lat, lon);
    const point = state.track.points[0];
    if (Math.abs(point.lat - expectedLat) > 1e-10 || Math.abs(point.lon - expectedLon) > 1e-10)
      throw new Error('Normalized coordinates do not match');
    const snapshot = { closed: false, points: state.track.points.map(p => ({ id: p.id, lat: p.lat, lon: p.lon })) };
    const addon = api.savedTrackBuildImportedElevations(snapshot, state.track.points);
    const actual = addon && addon.heights;
    if (JSON.stringify(actual) !== JSON.stringify(expectedHeights))
      throw new Error('Unexpected elevation snapshot: ' + JSON.stringify(actual));
    tests.push({ id, pass: true, preservedOwnElevation: Object.hasOwn(point, '_importEle'), heights: actual });
  } catch (error) {
    tests.push({ id, pass: false, error: String(error.message || error) });
  }
}
check('unchanged-keeps-elevation', 44, 9, [123, 124], 44, 9);
check('normalized-unchanged-keeps-elevation', 44, 369, [123, 124], 44, 9);
check('changed-latitude-clears-only-affected-elevation', 44.0005, 9, [null, 124], 44.0005, 9);
check('changed-longitude-clears-only-affected-elevation', 44, 9.001, [null, 124], 44, 9.001);
const fail = tests.filter(test => !test.pass).length;
const result = {
  source: { file: sourcePath, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') },
  scope: 'Original mutation, normalization, geometry hash and addon builder functions; no browser or persistence',
  counts: { total: tests.length, pass: tests.length - fail, fail }, tests
};
if (outputPath) fs.writeFileSync(outputPath, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result));
process.exitCode = fail ? 1 : 0;
