#!/usr/bin/env node
'use strict';

// Focused regression harness for F-303-01, authored 2026-11-15.
// Intermediate evidence only: this is not browser QA or app save/reload QA.
// Product functions are extracted verbatim from the specified Git ref or file.
// The sole state-boundary stub is ensureSavedTracksState(), declared below.

const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const args = process.argv.slice(2);
const options = {};
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--expect-known-baseline') options.baseline = true;
  else if (args[i].startsWith('--')) options[args[i].slice(2)] = args[++i];
  else throw new Error('Unexpected argument: ' + args[i]);
}
if (!!options.ref === !!options.file) throw new Error('Specify exactly one of --ref or --file');
if (options.ref && !options.repo) throw new Error('--repo is required with --ref');

const bytes = options.file
  ? fs.readFileSync(options.file)
  : execFileSync('git', ['show', options.ref + ':coordinate_converter Claude.html'], {
      cwd: options.repo, maxBuffer: 30 * 1024 * 1024
    });
const source = bytes.toString('utf8');

function extractFunction(name) {
  const marker = new RegExp('^function ' + name + '\\(', 'm').exec(source);
  if (!marker) throw new Error('Missing product function: ' + name);
  const start = marker.index;
  // The JS parser identifies the first syntactically complete declaration;
  // braces in literals/comments do not confuse the extraction.
  for (let end = source.indexOf('}', start); end !== -1; end = source.indexOf('}', end + 1)) {
    if (end - start > 100000) throw new Error('Function extraction budget exceeded: ' + name);
    const fragment = source.slice(start, end + 1);
    try { new vm.Script('(' + fragment + ')'); return fragment; } catch (_) {}
  }
  throw new Error('Could not extract function: ' + name);
}

function extractConstant(name) {
  const match = new RegExp('^const ' + name + '\\s*=.*?;', 'm').exec(source);
  if (!match) throw new Error('Missing product constant: ' + name);
  return match[0];
}

const constantNames = [
  'TRACK_POINTS_CAP', 'SAVED_TRACK_ELEVATION_MIN_M', 'SAVED_TRACK_ELEVATION_MAX_M',
  'SAVED_TRACK_IMPORTED_ELEVATION_SCHEMA', 'SAVED_TRACK_IMPORTED_ELEVATION_SOURCE', 'round'
];
const functionNames = [
  'savedTrackFnv1a32Hex', 'savedTrackGeometryHash', 'spatialImportedElevationNumber',
  'savedTrackSanitizeImportedElevations', 'savedTrackBuildImportedElevations',
  'savedTrackToFeatureCollection', 'exportGeoJsonMetadata', 'spatialXmlEsc', 'xmlEsc', 'esc',
  'spatialGeoJSONToGpx', 'spatialGeoJSONToKml'
];
const context = vm.createContext({});
const api = vm.runInContext(
  constantNames.map(extractConstant).join('\n') + '\n' +
  functionNames.map(extractFunction).join('\n') + '\n' +
  'function ensureSavedTracksState(){}\n' +
  '({' + functionNames.join(',') + ',SAVED_TRACK_ELEVATION_MIN_M,SAVED_TRACK_ELEVATION_MAX_M})',
  context, { timeout: 2000 }
);

const tests = [];
function check(id, action) {
  try {
    const details = action();
    tests.push({ id, pass: true, details });
  } catch (error) {
    tests.push({ id, pass: false, error: String(error.message || error) });
  }
}
function assert(condition, message) { if (!condition) throw new Error(message); }
function equal(actual, expected, message) {
  assert(JSON.stringify(actual) === JSON.stringify(expected),
    message + '; actual=' + JSON.stringify(actual) + '; expected=' + JSON.stringify(expected));
}
function makeTrack() {
  return {
    id: 'synthetic-regression', name: 'Synthetic regression', closed: false,
    points: [{ lat: 44, lon: 9 }, { lat: 44.001, lon: 9.001 }, { lat: 44.002, lon: 9.002 }]
  };
}
function build(heights, track = makeTrack()) {
  const points = track.points.map((point, i) => ({ ...point, _importEle: heights[i] }));
  const addon = api.savedTrackBuildImportedElevations(track, points);
  if (addon) track.importedElevations = addon;
  return { track, addon };
}
function raw(heights, track = makeTrack()) {
  return { schema: 1, source: 'spatial-file', geometryHash: api.savedTrackGeometryHash(track), heights };
}
function featureExport(heights) {
  const { track } = build(heights);
  return api.savedTrackToFeatureCollection(track);
}

for (const [label, height] of [['positive', 123], ['zero', 0], ['negative', -3]]) {
  check('single-' + label, () => {
    const { addon } = build([height, null, null]);
    equal(addon && addon.heights, [height, null, null], 'A single valid elevation must be preserved');
    return { heights: addon.heights };
  });
}
check('all-missing-rejected', () => {
  assert(build([null, null, null]).addon === null, 'All-missing addon must remain absent');
  return { addon: null };
});
for (const [label, value] of [['nan', NaN], ['infinity', Infinity], ['string', '125']]) {
  check('raw-invalid-' + label + '-rejected', () => {
    const track = makeTrack();
    assert(api.savedTrackSanitizeImportedElevations(raw([123, 124, value], track), track) === null,
      'Raw invalid elevation must reject the addon');
    return { addon: null };
  });
}
check('builder-invalid-becomes-missing', () => {
  const { addon } = build([123, 124, NaN]);
  equal(addon && addon.heights, [123, 124, null], 'Builder must map an invalid imported sample to missing');
  return { heights: addon.heights };
});
check('out-of-range-rejected', () => {
  const track = makeTrack();
  assert(api.savedTrackSanitizeImportedElevations(raw([123, 124, api.SAVED_TRACK_ELEVATION_MAX_M + 1], track), track) === null,
    'Raw out-of-range elevation must reject the addon');
  return { addon: null };
});
check('stale-geometry-rejected', () => {
  const track = makeTrack();
  const addon = raw([123, 124, null], track);
  track.points[1].lat += 0.01;
  assert(api.savedTrackSanitizeImportedElevations(addon, track) === null, 'Stale geometry hash must reject the addon');
  return { addon: null };
});
check('polygon-addon-rejected', () => {
  const track = makeTrack();
  track.closed = true;
  assert(api.savedTrackSanitizeImportedElevations(raw([123, 124, null], track), track) === null,
    'The scoped addon must not apply to closed polygons');
  return { addon: null };
});
for (const [label, height] of [['positive', 123], ['zero', 0], ['negative', -3]]) {
  check('gpx-single-' + label, () => {
    const xml = api.spatialGeoJSONToGpx(featureExport([height, null, null]));
    const elevations = [...xml.matchAll(/<ele>([^<]+)<\/ele>/g)].map(match => Number(match[1]));
    equal(elevations, [height], 'GPX must export exactly the original valid elevation');
    const points = [...xml.matchAll(/<trkpt\b[^>]*>([\s\S]*?)<\/trkpt>/g)];
    assert(points.length === 3, 'GPX must preserve three geometry points');
    assert(!points[1][1].includes('<ele>') && !points[2][1].includes('<ele>'), 'Missing points must have no invented ele element');
    return { elevations, points: points.length, missingEleElements: 2 };
  });
}
check('kml-partial-remains-2d', () => {
  const xml = api.spatialGeoJSONToKml(featureExport([123, null, null]));
  assert(!xml.includes('<altitudeMode>absolute</altitudeMode>'), 'Partial geometry must not be labelled absolute');
  const match = /<coordinates>([^<]+)<\/coordinates>/.exec(xml);
  assert(!!match, 'Expected KML coordinates');
  const coords = match[1].trim().split(/\s+/).map(value => value.split(',').map(Number));
  equal(coords.map(coord => coord[2]), [0, 0, 0], 'Legacy partial KML remains 2D with zero placeholders');
  return { points: coords.length, mode: 'default clampToGround' };
});
check('two-valid-partial-control', () => {
  const { addon } = build([123, 124, null]);
  equal(addon && addon.heights, [123, 124, null], 'Two-valid partial control must remain unchanged');
  const xml = api.spatialGeoJSONToGpx(featureExport([123, 124, null]));
  equal([...xml.matchAll(/<ele>([^<]+)<\/ele>/g)].map(match => Number(match[1])), [123, 124],
    'Control GPX must preserve two elevations');
  return { heights: addon.heights };
});

const failedIds = tests.filter(test => !test.pass).map(test => test.id);
const expectedKnownFailureIds = [
  'single-positive', 'single-zero', 'single-negative',
  'gpx-single-positive', 'gpx-single-zero', 'gpx-single-negative'
];
const baselineFailureSignatureMatches = JSON.stringify([...failedIds].sort()) ===
  JSON.stringify([...expectedKnownFailureIds].sort());
const result = {
  label: options.label || options.ref || options.file,
  source: { ref: options.ref || null, file: options.file || null, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') },
  scope: 'F-303-01 focused unit/helper regression; no browser, network, app save/reload or operator QA',
  boundaryStub: 'ensureSavedTracksState() is a no-op; direct sanitizer and original export functions are exercised',
  counts: { total: tests.length, pass: tests.length - failedIds.length, fail: failedIds.length },
  baselineFailureSignatureMatches,
  tests
};
if (options.out) fs.writeFileSync(options.out, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ label: result.label, source: result.source, counts: result.counts,
  baselineFailureSignatureMatches, failedIds, output: options.out || null }));
process.exitCode = options.baseline ? (baselineFailureSignatureMatches ? 0 : 1) : (failedIds.length ? 1 : 0);
