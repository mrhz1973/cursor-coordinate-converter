from pathlib import Path
import hashlib
import json
import difflib
import re

ROOT = Path('/workspace/scratch/bcbe375c6817')
ORIGINAL = ROOT / 'gis-recovery/routing-tests-original'
OUTPUT = ROOT / 'qa-gis-routing-final'
SHA = '1e6c11cf0825d5c76dd06147cec2378f023a4c323ba4dfcdb623cdce2a57576a'
REMOTE_APP = 'C:/Users/Utente/Downloads/Documents/ChatGPT/TMART GIS Tool/work/gpt-resume-20261109/candidate-280-1e6c11cf.html'
AUTHORIZED_URL = 'https://ionos-n8n-new.tailc01234.ts.net/'
LEGACY_URL = 'http://31.70.139.73/gis/'
UNKNOWN_URL = 'https://app.invalid/'
CHROME = 'C:/Users/Utente/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'

OUTPUT.mkdir(exist_ok=True)
manifest = {
    'candidate_sha256': SHA,
    'remote_candidate': REMOTE_APP,
    'document_origins': {
        'ordinary': AUTHORIZED_URL,
        'local_gh_fallback_only': LEGACY_URL,
        'negative_origin_test_only': UNKNOWN_URL,
    },
    'policy': 'All requests intercepted using a fresh non-persistent context; service workers blocked; documents fulfilled from exact candidate bytes; provider responses mocked; everything else aborted.',
    'acceptance_change': 'ORS HTTP404 {error:ors_not_found} is ambiguous in the live gateway contract: preserve refusal/no preview/no save and require routing.errorOrsHttp with no false land-unavailable diagnosis. GH ConnectionNotFoundException remains routing.landUnavailable.',
    'expected_case_counts': {'general': 38, 'policy_transitions': 4, 'compare_anchor_available': 9, 'unknown_origin_additional': 3},
    'unrecovered_coverage': 'The available compare-anchor (1), compare-guard (6) and snap-anchor (2) runners do not reproduce the historical count of 13. Additional recovered runner names duplicate existing matrices.',
    'files': [],
}

def replace_once(text, before, after):
    assert text.count(before) == 1, (before[:100], text.count(before))
    return text.replace(before, after, 1)

def common(text, old_name, new_name, main_style):
    text, count = re.subn(r"const app\s*=\s*'[^']+';", "const app = '" + REMOTE_APP + "';", text)
    assert count == 1
    if main_style:
        text = replace_once(text,
            "if(!process.env.EXPECTED_SHA || sha!==process.env.EXPECTED_SHA) throw Error('unexpected candidate');",
            "if(sha!=='" + SHA + "') throw Error('unexpected candidate');")
        text = replace_once(text,
            "scenario=s; const ctx=await browser.newContext();",
            "scenario=s; const documentUrl=s.gate==='origin'?'" + UNKNOWN_URL + "':s.fallback?'" + LEGACY_URL + "':'" + AUTHORIZED_URL + "'; const ctx=await browser.newContext({serviceWorkers:'block'});")
        text = text.replace("'https://app.invalid/'", 'documentUrl')
        # Restore the explicit negative-origin fixture in the initializer itself.
        text = replace_once(text, "s.gate==='origin'?documentUrl:", "s.gate==='origin'?'" + UNKNOWN_URL + "':")
        text = text.replace("preview:!!state._routing.previewCoordinates,saveDisabled:", "preview:!!state._routing.previewCoordinates,routeError:state._routing.routeError||null,saveDisabled:")
    else:
        text, count = re.subn(r"const expectedSha = '[a-f0-9]+';", "const expectedSha = '" + SHA + "';\nconst APP_URL = '" + AUTHORIZED_URL + "';", text)
        assert count == 1
        text = text.replace("'https://app.invalid/'", 'APP_URL')
        text = text.replace('browser.newContext()', "browser.newContext({ serviceWorkers: 'block' })")
        text = text.replace(old_name.replace('.cjs', '-results.json'), new_name.replace('.cjs', '-results.json'))
    return text

def save(original_name, adapted_name, text, changes):
    raw = (ORIGINAL / original_name).read_bytes()
    old = raw.decode('utf-8-sig').replace('\r\n', '\n')
    payload = text.encode('utf-8')
    (OUTPUT / adapted_name).write_bytes(payload)
    diff = ''.join(difflib.unified_diff(old.splitlines(keepends=True), text.splitlines(keepends=True), fromfile='original/' + original_name, tofile='adapted/' + adapted_name))
    (OUTPUT / (adapted_name + '.diff')).write_text(diff, encoding='utf-8')
    manifest['files'].append({
        'original': str(ORIGINAL / original_name),
        'original_sha256': hashlib.sha256(raw).hexdigest(),
        'adapted_name': adapted_name,
        'adapted_sha256': hashlib.sha256(payload).hexdigest(),
        'changes': changes,
    })

adapted_general = None
for name in ['run-279.cjs', 'transitions-279.cjs', 'qa-compare-snap-anchor-277.cjs', 'qa-compare-snap-guard-277.cjs', 'qa-snap-anchor-277.cjs']:
    text = (ORIGINAL / name).read_bytes().decode('utf-8-sig').replace('\r\n', '\n')
    new_name = name.replace('279', '280').replace('277', '280')
    main_style = name.startswith('run-') or name.startswith('transitions-')
    text = common(text, name, new_name, main_style)
    changes = ['Candidate path and immutable SHA pin', 'Fresh context with service workers blocked', 'Authorized HTTPS443 document origin for normal cases', 'QA copies normalized to LF; original files preserved']
    if main_style:
        changes.append('Only the GH-local-to-VPS scenario uses a dedicated intercepted legacy HTTP document')
        if name == 'run-279.cjs':
            text = replace_once(text,
                "if(s.kind==='noconnection')passed=passed&&/percorso terrestre|collegamento terrestre|land route/i.test(ui.status);",
                "if(s.kind==='noconnection')passed=passed&&(s.service==='graphhopper' ? ui.routeError==='routing.landUnavailable'&&/percorso terrestre|collegamento terrestre|land route/i.test(ui.status) : ui.routeError==='routing.errorOrsHttp'&&!/percorso terrestre|collegamento terrestre|land route/i.test(ui.status));")
            changes.append('Known gateway404 ambiguity: corrected ORS expectation; original error fixture retained; GH specific diagnosis retained')
            text = text.replace("'results.json'", "'general-38.json'")
            adapted_general = text
        else:
            text = text.replace("'transitions.json'", "'transitions-4.json'")
    else:
        if name == 'qa-compare-snap-anchor-277.cjs':
            begin = text.index('  let browser = null;')
            end = text.index('\n\n  const context =', begin)
            text = text[:begin] + "  let browserChannel = 'chromium-1234';\n  let edgeLaunchError = null;\n  const browser = await chromium.launch({ headless: true, executablePath: '" + CHROME + "' });" + text[end:]
        elif name == 'qa-compare-snap-guard-277.cjs':
            begin = text.index('  let browser = null;')
            end = text.index('\n  try {\n    const scenarios =', begin)
            text = text[:begin] + "  let browserChannel = 'chromium-1234';\n  let edgeLaunchError = null;\n  const browser = await chromium.launch({ headless: true, executablePath: '" + CHROME + "' });" + text[end:]
        else:
            text = replace_once(text,
                "  const channel = process.env.QA_BROWSER_CHANNEL || 'msedge';\n  const browser = await chromium.launch({ headless: true, channel });",
                "  const channel = 'chromium-1234';\n  const browser = await chromium.launch({ headless: true, executablePath: '" + CHROME + "' });")
        changes.append('Explicit Chromium1234 executable instead of Edge/Chrome channel discovery')
    save(name, new_name, text, changes)

assert adapted_general is not None
extra = adapted_general
begin = extra.index(' for(const s of [')
end = extra.index(' ].filter(s=>', begin)
extra = extra[:begin] + " for(const s of [\n  {name:'graphhopper unknown HTTPS origin',service:'graphhopper',gate:'origin'},\n  {name:'ors unknown HTTPS origin',service:'ors',gate:'origin'},\n  {name:'compare unknown HTTPS origin',service:'graphhopper',compare:true,gate:'origin'},\n" + extra[end:]
extra = extra.replace("'general-38.json'", "'origin-guard-3.json'")
extra = replace_once(extra,
    'passed=passed&&before.length===0&&errors.length===0;',
    "if(s.gate==='origin')passed=passed&&records.filter(x=>x.service||x.url.endsWith('/info')||x.url.includes('/nearest?')||x.url.endsWith('/ors/status')).length===0;\n  passed=passed&&before.length===0&&errors.length===0;")
save('run-279.cjs', 'origin-guard-280.cjs', extra, ['Additional requested negative-origin suite, separate from original38 cases', 'Original gate assertions reused without changing runtime origin gates', 'Zero provider requests required in ALL phases, including startup/setup', 'Three contexts: GH, ORS and compare'])

(OUTPUT / 'adaptation-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'adapted_files': len(manifest['files']), 'expected_case_counts': manifest['expected_case_counts'], 'candidate_sha256': SHA}))
