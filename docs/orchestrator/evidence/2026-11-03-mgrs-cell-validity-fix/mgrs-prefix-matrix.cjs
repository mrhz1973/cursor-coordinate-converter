const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');

const runtimePath = 'C:/Users/Utente/Documents/Codex/2026-10-28/gi/work/mart-gis/coordinate_converter Claude.html';
const sourceBytes = fs.readFileSync(runtimePath);
const html = sourceBytes.toString('utf8');
const scripts = [...html.matchAll(/<script>\s*\n([\s\S]*?)\n<\/script>/g)];
assert.equal(scripts.length, 2, 'runtime inline script inventory changed');
scripts.forEach((script, i) => new vm.Script(script[1], { filename: `inline-${i}` }));

const constantsStart = html.indexOf('const MGRS_COL_SETS =');
const constantsEnd = html.indexOf('// #endregion JS — CONSTANTS', constantsStart);
assert(constantsStart >= 0 && constantsEnd > constantsStart, 'MGRS constants block not found');
const extractFunction = (name) => {
  const start = html.indexOf(`function ${name}(`);
  assert(start >= 0, `${name} not found`);
  const end = html.indexOf('\n}', start);
  assert(end >= 0, `${name} end not found`);
  return html.slice(start, end + 2);
};

class ErrI18n extends Error { constructor(code) { super(code); this.code = code; } }
const context = { ErrI18n, Math, String, parseInt, Array };
vm.createContext(context);
vm.runInContext(
  `${html.slice(constantsStart, constantsEnd)}\n${extractFunction('mgrsResolveUtm100kRow')}\n${extractFunction('parseMGRS')}`,
  context,
  { filename: 'mgrs-parser-under-test.js' }
);

// Independent transcription of GeographicLib 2.5 MGRS.cpp UTMRow validity
// rule; deliberately kept in the harness, separate from runtime helper.
function referenceRow(bandIndex, columnIndex, periodicRowIndex) {
  const band = bandIndex - 10;
  const north = band >= 0;
  const centerRow = 100 * (8 * band + 4) / 90;
  const minRow = band > -10 ? Math.floor(centerRow - 4.3 - (north ? 0.1 : 0)) : -90;
  const maxRow = band < 9 ? Math.floor(centerRow + 4.4 - (north ? 0.1 : 0)) : 94;
  const baseRow = Math.trunc((minRow + maxRow) / 2) - 10;
  const row = ((periodicRowIndex - baseRow + 100) % 20) + baseRow;
  if (row >= minRow && row <= maxRow) return row;
  const sb = band >= 0 ? band : -band - 1;
  const sr = row >= 0 ? row : -row - 1;
  const sc = columnIndex < 4 ? columnIndex : -columnIndex + 7;
  const edge =
    (sr === 70 && sb === 8 && sc >= 2) ||
    (sr === 71 && sb === 7 && sc <= 2) ||
    (sr === 79 && sb === 9 && sc >= 1) ||
    (sr === 80 && sb === 8 && sc <= 1);
  return edge ? row : null;
}

let prefixes = 0, valid = 0, invalid = 0;
const colSets = ['ABCDEFGH', 'JKLMNPQR', 'STUVWXYZ'];
const oddRows = 'ABCDEFGHJKLMNPQRSTUV';
const evenRows = 'FGHJKLMNPQRSTUVABCDE';
const bands = 'CDEFGHJKLMNPQRSTUVWX';
for (let zone = 1; zone <= 60; zone++) {
  const cols = colSets[(zone - 1) % 3];
  const rows = zone % 2 ? oddRows : evenRows;
  for (let bandIndex = 0; bandIndex < bands.length; bandIndex++) {
    for (let colIndex = 0; colIndex < cols.length; colIndex++) {
      for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        prefixes++;
        const refRow = referenceRow(bandIndex, colIndex, rowIndex);
        const prefix = `${zone}${bands[bandIndex]}${cols[colIndex]}${rows[rowIndex]}`;
        if (refRow === null) {
          assert.throws(() => context.parseMGRS(prefix), undefined, `should reject ${prefix}`);
          invalid++;
        } else {
          const parsed = context.parseMGRS(prefix);
          const expectedNorthing = refRow * 100000 + (bandIndex < 10 ? 10000000 : 0);
          assert.equal(parsed.northing, expectedNorthing, `northing mismatch for ${prefix}`);
          assert.equal(parsed.easting, (colIndex + 1) * 100000, `easting mismatch for ${prefix}`);
          valid++;
        }
      }
    }
  }
}

const fixtures = [
  ['38VLS', true], ['38WLS', true], ['38VMS', false],
  ['38MPE', true], ['38NPF', true], ['38NPE', false], ['38MPF', false],
  ['32NNA0000000000', false], ['32MNF0000050000', false], ['32MNF0000000000', false]
];
for (const [input, expectedValid] of fixtures) {
  let actualValid = true;
  try { context.parseMGRS(input); } catch { actualValid = false; }
  assert.equal(actualValid, expectedValid, `normative fixture ${input}`);
}

for (const input of ['38VLS0000000000', '38WLS0000000000', '38MPE0000000000', '38NPF0000000000']) {
  const parsed = context.parseMGRS(input);
  assert.equal(parsed.precision, 5);
}

console.log(JSON.stringify({
  result: 'PASS',
  runtimeSha256: crypto.createHash('sha256').update(sourceBytes).digest('hex'),
  inlineScriptSyntax: 'PASS',
  prefixesComparedWithGeographicLibRule: prefixes,
  validPrefixes: valid,
  invalidPrefixes: invalid,
  officialFixtures: fixtures.length,
  validPrecisionFiveFixtures: 4
}, null, 2));
