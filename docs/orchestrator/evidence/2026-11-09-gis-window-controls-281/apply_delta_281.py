from pathlib import Path
import hashlib, json, datetime, difflib, subprocess

BASE = Path('/workspace/scratch/bcbe375c6817')
REPO = BASE / 'gis-windows-281'
RUNTIME = REPO / 'coordinate_converter Claude.html'
OUT = BASE / 'qa-gis-windows-281'
EXPECTED = '70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde'
before = RUNTIME.read_bytes()
assert hashlib.sha256(before).hexdigest() == EXPECTED
baseline = subprocess.run(['git','-C',str(REPO),'show','c33f58c956e9630b03f9ff86eb35eccd35879a4a:coordinate_converter Claude.html'],capture_output=True,check=True).stdout
assert before == baseline
assert not subprocess.run(['git','-C',str(REPO),'status','--porcelain'],capture_output=True,text=True,check=True).stdout.strip()

replacements = [
 ('convert_dialog_name',
  '<dialog id="convertModal" class="app-modal convert-modal">',
  '<dialog id="convertModal" class="app-modal convert-modal" aria-labelledby="convertModalTitle">'),
 ('convert_existing_title_id',
  '<h2 class="app-modal-title" data-i18n="convert.title">Convertitore — inserisci coordinate</h2>',
  '<h2 id="convertModalTitle" class="app-modal-title" data-i18n="convert.title">Convertitore — inserisci coordinate</h2>'),
 ('astro_mobile_geometry_override',
  '    left:0 !important; right:0 !important; top:0 !important; bottom:auto !important;\n    width:100vw !important; max-width:100vw;\n    height:min(92vh, 720px) !important; max-height:92vh;\n',
  ''),
 ('bindHotkeys_consumed_escape_guard',
  '    // Esc: priority to closing modal; otherwise blur/clear\n      if (ev.key === "Escape"){\n      try {',
  '    // Esc: priority to closing modal; otherwise blur/clear\n      if (ev.key === "Escape"){\n      if (ev.defaultPrevented) return;\n      try {'),
 ('gis_escape_consumed_guard',
  '  document.addEventListener("keydown", (ev) => {\n    if (ev.key !== "Escape") return;\n    const wptM = document.getElementById("wptMapCtxMenu");',
  '  document.addEventListener("keydown", (ev) => {\n    if (ev.key !== "Escape") return;\n    if (ev.defaultPrevented) return;\n    const wptM = document.getElementById("wptMapCtxMenu");'),
 ('bindHotkeys_gis_unhandled_delegation',
  '      if (document.body.classList.contains("gis-mode")){\n        ev.preventDefault();\n        return;\n      }\n      clearForm();',
  '      if (document.body.classList.contains("gis-mode")){\n        return;\n      }\n      clearForm();'),
 ('build_id',
  'const APP_BUILD_ID = "ROUTING-LAND-ONLY-NO-FERRY-A";',
  'const APP_BUILD_ID = "GIS-WINDOW-CONTROLS-A";'),
 ('build_detail',
  'const APP_BUILD_DETAIL = "Controlli routing terrestre, agganci e HTTPS.";',
  'const APP_BUILD_DETAIL = "Controlli delle finestre, Escape e pannello Astro.";'),
 ('build_counter',
  'const APP_BUILD_NUM = 280;',
  'const APP_BUILD_NUM = 281;'),
 ('release_note_prefix',
  '<h4>Build 280 — routing terrestre</h4>',
  '<h4>Build 281 — finestre e comandi</h4><ul><li>Il titolo di Converti è riconoscibile dalle tecnologie assistive.</li><li>Guida e Converti non si chiudono più insieme con una pressione di Escape.</li><li>I comandi del pannello Astro restano raggiungibili sugli schermi stretti.</li></ul><h4>Build 280 — routing terrestre</h4>'),
]

after = before
ledger = []
for name, old, new in replacements:
    a, b = old.encode('utf-8'), new.encode('utf-8')
    assert after.count(a) == 1, (name, after.count(a))
    start = after.index(a)
    after = after[:start] + b + after[start+len(a):]
    ledger.append({'name':name,'old':old,'new':new,'occurrences':1})

# Exact reconstruction of the expected result from the source and the declared
# edits proves byte preservation outside this small bundle. No whole-file text
# normalization is performed.
reconstructed = before
for edit in ledger:
    reconstructed = reconstructed.replace(edit['old'].encode(),edit['new'].encode(),1)
assert reconstructed == after
assert before.count(b'\r') == after.count(b'\r')
assert before.count(b'\r\n') == after.count(b'\r\n')
assert before.startswith(b'\xef\xbb\xbf') == after.startswith(b'\xef\xbb\xbf')
RUNTIME.write_bytes(after)
assert RUNTIME.read_bytes() == after

diff = ''.join(difflib.unified_diff(before.decode().splitlines(keepends=True),after.decode().splitlines(keepends=True),
                                  fromfile='a/coordinate_converter Claude.html',tofile='b/coordinate_converter Claude.html',n=3))
(OUT/'runtime-281.diff').write_text(diff,encoding='utf-8')
integrity = {'checked_at_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),
             'status':'IMPLEMENTED_NOT_COMMITTED_OR_DEPLOYED',
             'base_commit':'63d4fd7b3bbd2b02fe10d8e2180c58c31b9e11d0',
             'base_runtime_commit':'c33f58c956e9630b03f9ff86eb35eccd35879a4a',
             'runtime_path':str(RUNTIME),'source_sha256':EXPECTED,
             'candidate_sha256':hashlib.sha256(after).hexdigest(),
             'source_bytes':len(before),'candidate_bytes':len(after),
             'replacement_regions':len(ledger),'replacements':ledger,
             'non_target_bytes_preserved':True,
             'cr_count_before':before.count(b'\r'),'cr_count_after':after.count(b'\r'),
             'crlf_count_before':before.count(b'\r\n'),'crlf_count_after':after.count(b'\r\n'),
             'bom_before':before.startswith(b'\xef\xbb\xbf'),'bom_after':after.startswith(b'\xef\xbb\xbf'),
             'diff_sha256':hashlib.sha256((OUT/'runtime-281.diff').read_bytes()).hexdigest(),
             'native_cancel_input_pick_regression':'REQUIRES_BROWSER_QA; no other branch changed',
             'registration_order':{'bindHotkeys_call_base_line':103753,'gisInit_call_base_line':103795,
                                   'first_listener_base_line':51862,'second_listener_base_line':81239,
                                   'first_capture':False,'second_capture':False,
                                   'description':'init registers bindHotkeys before gisInit; no registration changes'}}
(OUT/'implementation-integrity.json').write_text(json.dumps(integrity,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:integrity[k] for k in ['status','candidate_sha256','candidate_bytes','replacement_regions','non_target_bytes_preserved','cr_count_after','bom_after']},indent=2))
