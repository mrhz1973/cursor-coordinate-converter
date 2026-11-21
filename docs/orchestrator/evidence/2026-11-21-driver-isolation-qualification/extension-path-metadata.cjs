'use strict';
// Readonly metadata of the ten paths in one already acquired, pinned catalog.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { spawnSync } = require('child_process');
const EDGE_ROOT = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application';
const VERSION_ROOT = path.join(EDGE_ROOT, '157.0.4341.60');
const INPUT_BYTES = 19594;
const INPUT_SHA = '00888441d1c8be3a355daf53f90afee144886bfb0388c9c6ed573ccf08b57f12';
const HASH = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const CODES = new Set();
function stop(code) { CODES.add(code); const e = new Error(code); e.safeCode = code; throw e; }
function requireThat(value, code) { if (!value) stop(code); }
function safeCode(e) { return e && CODES.has(e.safeCode) ? e.safeCode : 'LOCAL_OPERATION_FAILED'; }
function within(child, parent) { const rel = path.relative(parent, child); return rel === '' || (!path.isAbsolute(rel) && rel !== '..' && !rel.startsWith('..' + path.sep)); }
function add(hist, key) { hist[key] = (hist[key] || 0) + 1; }
function nodeError(e) {
  const known = new Set(['ENOENT', 'ENOTDIR', 'EACCES', 'EPERM', 'EINVAL', 'ENAMETOOLONG', 'ELOOP', 'EBUSY', 'EIO']);
  return { status: 'ERROR', code: known.has(e.code) ? e.code : 'OTHER', errno: Number.isInteger(e.errno) ? e.errno : null };
}
function readPinned(file) {
  const a = fs.statSync(file), bytes = fs.readFileSync(file), b = fs.statSync(file);
  requireThat(a.isFile() && a.size === b.size && a.mtimeMs === b.mtimeMs && a.ino === b.ino, 'INPUT_UNSTABLE');
  requireThat(bytes.length === INPUT_BYTES && HASH(bytes) === INPUT_SHA, 'INPUT_IDENTITY');
  return bytes;
}
function writeReceipt(file, value) {
  const bytes = Buffer.from(JSON.stringify(value, null, 2) + '\n');
  fs.writeFileSync(file, bytes, { flag: 'wx', mode: 0o600 });
  requireThat(fs.readFileSync(file).equals(bytes), 'RECEIPT_READBACK');
  return { file: path.basename(file), bytes: bytes.length, sha256: HASH(bytes) };
}
// Paths are JSON data on stdin. No path is inserted into executable PowerShell text.
const ATTRIBUTE_SCRIPT = String.raw`
$ErrorActionPreference = 'Stop'
[Console]::InputEncoding = [System.Text.UTF8Encoding]::new($false)
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
try {
  $plan = [Console]::In.ReadToEnd() | ConvertFrom-Json
  $records = [System.Collections.Generic.List[object]]::new()
  foreach ($node in $plan.nodes) {
    $r = @{ index = [int]$node.index; status = 'NOT_ATTEMPTED'; directory = $false; reparse = $false; hresult = $null; win32Code = $null }
    if ([int]$node.parentIndex -ge 0) {
      $p = $records[[int]$node.parentIndex]
      if ($p.status -ne 'OK' -or -not $p.directory -or $p.reparse) {
        $r.status = 'BLOCKED_BY_ANCESTOR'; $records.Add($r); continue
      }
    }
    try {
      $attrs = [System.IO.File]::GetAttributes([string]$node.path)
      $r.directory = [bool]($attrs -band [System.IO.FileAttributes]::Directory)
      $r.reparse = [bool]($attrs -band [System.IO.FileAttributes]::ReparsePoint)
      $r.status = if ($r.reparse) { 'REPARSE_POINT' } else { 'OK' }
    } catch {
      $ex = $_.Exception
      for ($depth = 0; $depth -lt 8 -and $null -ne $ex.InnerException; $depth++) { $ex = $ex.InnerException }
      $hr = [int]$ex.HResult; $r.hresult = $hr
      if ((($hr -shr 16) -band 0x1fff) -eq 7) { $r.win32Code = $hr -band 0xffff }
      $r.status = 'OTHER_ERROR'
      if ($null -ne $r.win32Code) {
        $r.status = switch ($r.win32Code) {
          2 { 'NOT_FOUND' }; 3 { 'NOT_FOUND' }; 5 { 'ACCESS_DENIED' }; 32 { 'SHARING_VIOLATION' }
          87 { 'INVALID_PARAMETER' }; 123 { 'INVALID_NAME' }; 206 { 'PATH_TOO_LONG' }; default { 'OTHER_ERROR' }
        }
      }
    }
    $records.Add($r)
  }
  [Console]::WriteLine((@{ status = 'COMPLETED'; records = $records.ToArray() } | ConvertTo-Json -Depth 5 -Compress))
} catch {
  [Console]::WriteLine('{"status":"STOP","reason":"ATTRIBUTE_PROBE_FAILED"}')
  exit 2
}
`;
function main() {
  requireThat(process.platform === 'win32', 'WINDOWS_REQUIRED');
  const local = process.env.LOCALAPPDATA;
  requireThat(typeof local === 'string' && /^[A-Za-z]:[\\/]/.test(local), 'LOCAL_OUTPUT_ROOT');
  const logicalBackups = path.join(local, 'TMAR-GIS', 'Backups');
  const physicalLocal = fs.realpathSync.native(local), backups = fs.realpathSync.native(logicalBackups);
  requireThat(within(backups, path.join(physicalLocal, 'TMAR-GIS', 'Backups')), 'OUTPUT_PHYSICAL_SCOPE');
  const input = path.join(logicalBackups, 'p0-extension-catalog-rMIOLk', 'catalog-resource-private.txt');
  requireThat(within(fs.realpathSync.native(input), backups), 'INPUT_PHYSICAL_SCOPE');
  const bytes = readPinned(input);
  let catalog; try { catalog = JSON.parse(bytes.toString('utf8')); } catch (_) { stop('INPUT_JSON'); }
  requireThat(Array.isArray(catalog) && catalog.length === 10, 'INPUT_CATALOG_COUNT');
  const nodes = [], byPath = new Map(), leafIndices = [], uniqueLeaves = new Set();
  const lexical = { installation: 0, version: 0, installationOther: 0 }, types = {};
  function addNode(file) {
    const key = file.toLowerCase(); if (byPath.has(key)) return byPath.get(key);
    const parentIndex = key === EDGE_ROOT.toLowerCase() ? -1 : addNode(path.dirname(file));
    const index = nodes.length; nodes.push({ index, parentIndex, path: file }); byPath.set(key, index); return index;
  }
  for (const item of catalog) {
    requireThat(item && typeof item.path === 'string' && /^[A-Za-z]:[\\/]/.test(item.path) && !/[\u0000\r\n]/.test(item.path), 'REPORTED_PATH_FORMAT');
    const resolved = path.resolve(item.path);
    requireThat(within(resolved, EDGE_ROOT) && !resolved.slice(3).includes(':'), 'REPORTED_PATH_OUTSIDE_SCOPE');
    requireThat(path.relative(EDGE_ROOT, resolved).split(path.sep).length <= 64, 'REPORTED_PATH_DEPTH');
    const index = addNode(resolved); leafIndices.push(index); uniqueLeaves.add(index);
    lexical.installation++;
    if (within(resolved, VERSION_ROOT)) lexical.version++; else lexical.installationOther++;
    add(types, item.type === 'TYPE_EXTENSION' ? 'TYPE_EXTENSION' : 'UNINTERPRETED');
  }
  requireThat(nodes.length <= 256, 'METADATA_PLAN_SIZE');
  const runDirectory = fs.mkdtempSync(path.join(backups, 'p0-extension-path-metadata-'));
  const receipt = { schema: 'TMAR-GIS-P0-EXTENSION-PATH-METADATA-V1', purpose: 'PINNED_CATALOG_PATH_METADATA_ONLY',
    status: 'RUNNING', startedUTC: new Date().toISOString(), browserStarted: false, gisRuntimeRead: false,
    gisInputRead: false, permissionsOrPolicyRead: false, signaturesRead: false, sourceWrites: false,
    accessChangesAttempted: false, directoryListings: false, fileContentsUnderEdgeRead: false,
    filesystemObservationAtomic: false, virtualPathsProven: false, componentAdmission: 'NOT_GRANTED',
    input: { bytes: INPUT_BYTES, sha256: INPUT_SHA }, catalogRecords: catalog.length, distinctReportedPaths: uniqueLeaves.size,
    plannedMetadataNodes: nodes.length, lexical, technicalTypeLiterals: types,
    effectiveIncognitoAccess: 'NOT_OBSERVED', effectivePolicy: 'NOT_OBSERVED' };
  try {
    const systemRoot = process.env.SystemRoot;
    requireThat(typeof systemRoot === 'string' && /^[A-Za-z]:[\\/]/.test(systemRoot), 'SYSTEM_ROOT');
    const powershell = path.join(systemRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe');
    const execution = spawnSync(powershell, ['-NoProfile', '-NonInteractive', '-Command', ATTRIBUTE_SCRIPT], {
      input: JSON.stringify({ nodes }), encoding: 'utf8', windowsHide: true, timeout: 20000, maxBuffer: 1024 * 1024 });
    requireThat(!execution.error && execution.status === 0, 'ATTRIBUTE_PROBE_PROCESS');
    let attributes; try { attributes = JSON.parse(execution.stdout.replace(/^\uFEFF/, '')); } catch (_) { stop('ATTRIBUTE_PROBE_JSON'); }
    requireThat(attributes.status === 'COMPLETED' && Array.isArray(attributes.records) && attributes.records.length === nodes.length, 'ATTRIBUTE_PROBE_SCHEMA');
    const allowedStatus = new Set(['OK', 'BLOCKED_BY_ANCESTOR', 'REPARSE_POINT', 'NOT_FOUND', 'ACCESS_DENIED',
      'SHARING_VIOLATION', 'INVALID_PARAMETER', 'INVALID_NAME', 'PATH_TOO_LONG', 'OTHER_ERROR']);
    const results = [];
    let physicalRoot = null;
    for (const node of nodes) {
      const a = attributes.records[node.index];
      requireThat(a.index === node.index && allowedStatus.has(a.status) && typeof a.directory === 'boolean' && typeof a.reparse === 'boolean', 'ATTRIBUTE_RECORD_SCHEMA');
      const r = { attribute: a.status, hresult: Number.isInteger(a.hresult) ? a.hresult : null,
        win32Code: Number.isInteger(a.win32Code) ? a.win32Code : null,
        lstat: { status: 'NOT_ATTEMPTED' }, realpath: { status: 'NOT_ATTEMPTED' }, descendantsPermitted: false };
      results.push(r);
      if (node.parentIndex >= 0 && !results[node.parentIndex].descendantsPermitted) continue;
      // Only NOT_FOUND is additionally probed at this same node, to preserve the actual Node errno.
      // Nothing below a missing/access-denied/reparse node is traversed.
      if (!['OK', 'NOT_FOUND'].includes(a.status) || a.reparse) continue;
      let st;
      try {
        st = fs.lstatSync(node.path);
        r.lstat = { status: 'OK', kind: st.isSymbolicLink() ? 'LINK' : st.isDirectory() ? 'DIRECTORY' : st.isFile() ? 'FILE' : 'OTHER' };
      } catch (e) { r.lstat = nodeError(e); }
      if (r.lstat.kind === 'LINK' || ['EACCES', 'EPERM'].includes(r.lstat.code)) continue;
      let physical;
      try {
        physical = fs.realpathSync.native(node.path);
        r.realpath = { status: 'OK' };
        if (node.parentIndex === -1) {
          requireThat(physical.toLowerCase() === path.resolve(EDGE_ROOT).toLowerCase(), 'ROOT_PHYSICAL_SCOPE_CHANGED');
          physicalRoot = physical;
        } else if (!physicalRoot || !within(physical, physicalRoot)) {
          r.realpath = { status: 'RESOLVED_OUTSIDE_SCOPE' }; continue;
        }
      } catch (e) { if (e.safeCode) throw e; r.realpath = nodeError(e); }
      r.descendantsPermitted = a.status === 'OK' && a.directory && !a.reparse &&
        r.lstat.status === 'OK' && r.lstat.kind === 'DIRECTORY' && r.realpath.status === 'OK';
    }
    function aggregate(indices) {
      const output = { count: indices.length, attributes: {}, attributeHResults: {}, attributeWin32Codes: {},
        lstat: {}, lstatErrorCodes: {}, lstatErrnos: {}, realpath: {}, realpathErrorCodes: {}, realpathErrnos: {}, reparseOrLinkObserved: 0 };
      for (const index of indices) {
        const r = results[index]; add(output.attributes, r.attribute);
        if (r.hresult !== null) add(output.attributeHResults, String(r.hresult));
        if (r.win32Code !== null) add(output.attributeWin32Codes, String(r.win32Code));
        for (const key of ['lstat', 'realpath']) {
          add(output[key], r[key].status);
          if (r[key].code) add(output[key + 'ErrorCodes'], r[key].code);
          if (Number.isInteger(r[key].errno)) add(output[key + 'Errnos'], String(r[key].errno));
        }
        if (r.attribute === 'REPARSE_POINT' || r.lstat.kind === 'LINK') output.reparseOrLinkObserved++;
      }
      return output;
    }
    receipt.metadata = { uniqueNodes: aggregate(nodes.map(n => n.index)),
      uniqueReportedPaths: aggregate([...uniqueLeaves]), catalogRecords: aggregate(leafIndices) };
    receipt.branchStopping = { noDescendantTraversalAfterObservedReparseOrBlockedAncestor: true,
      missingNodesAreNotClassifiedAsVirtual: true, attributeErrorsNotImputedToUnattemptedNodeOperations: true };
    receipt.status = 'OBSERVATION_COMPLETED_REQUIRES_ASSESSMENT';
  } catch (e) { receipt.status = 'STOP'; receipt.reason = safeCode(e); }
  try { readPinned(input); receipt.inputUnchanged = true; }
  catch (e) { receipt.inputUnchanged = false; receipt.status = 'STOP'; receipt.reason = safeCode(e); }
  receipt.finishedUTC = new Date().toISOString();
  const artifact = writeReceipt(path.join(runDirectory, 'receipt.json'), receipt);
  process.stdout.write(JSON.stringify({ status: receipt.status, purpose: receipt.purpose, reason: receipt.reason || null,
    runDirectory, receipt: artifact, virtualPathsProven: false, componentAdmission: 'NOT_GRANTED' }) + '\n');
  return receipt.status === 'STOP' ? 2 : 0;
}
if (require.main === module) {
  try { process.exitCode = main(); }
  catch (e) { process.stdout.write(JSON.stringify({ status: 'STOP', reason: safeCode(e), browserStarted: false }) + '\n'); process.exitCode = 2; }
}
