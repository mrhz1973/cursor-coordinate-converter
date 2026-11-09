from pathlib import Path
from lxml import html
import json, re, hashlib, datetime

BASE = Path('/workspace/scratch/bcbe375c6817')
SOURCE = BASE / 'gis-tool/coordinate_converter Claude.html'
OUT = BASE / 'qa-gis-windows-audit-280/static-inventory'
SHA = '70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde'
data = SOURCE.read_bytes()
assert hashlib.sha256(data).hexdigest() == SHA
dom = html.fromstring(data, parser=html.HTMLParser(encoding='utf-8', huge_tree=True, no_network=True))
nodes = dom.xpath('//dialog | //*[@id="offlineTilePanel"] | //*[@id="tabDrawer"]')
by_id = {n.get('id'): n for n in dom.iter() if isinstance(n.tag, str) and n.get('id')}

def text(n):
    return ' '.join(''.join(n.itertext()).split())

def class_has(n, name):
    return name in n.get('class', '').split()

def control(n):
    return {'id': n.get('id'), 'class': n.get('class'), 'type': n.get('type'),
            'line': n.sourceline, 'text': text(n), 'aria_label_literal': n.get('aria-label'),
            'aria_label_i18n_key': n.get('data-i18n-aria'),
            'data_attributes': {k: v for k, v in n.attrib.items() if k.startswith('data-')}}

items = []
for n in nodes:
    titles = n.xpath('.//h1 | .//h2 | .//h3 | ./summary')
    title = titles[0] if titles else None
    buttons = n.xpath('.//button')
    closes = [x for x in buttons if class_has(x, 'app-modal-close') or class_has(x, 'drawer-close') or class_has(x, 'tab-drawer-close')]
    mins = [x for x in buttons if class_has(x, 'app-modal-min-btn')]
    bodies = [x for x in n.iterdescendants() if isinstance(x.tag, str) and
              any(class_has(x, c) for c in ['app-modal-body','drawer-body','tools-drawer-body','tab-drawer-body'])]
    headers = [x for x in n.iterdescendants() if isinstance(x.tag, str) and
               any(class_has(x, c) for c in ['app-modal-head','tools-drawer-head','tab-drawer-head'])]
    labelled = n.get('aria-labelledby', '').split()
    item = {'id': n.get('id'), 'element': n.tag, 'line': n.sourceline,
            'classes': n.get('class', '').split(),
            'title': {'text_literal': text(title) if title is not None else None,
                      'id': title.get('id') if title is not None else None,
                      'i18n_key': title.get('data-i18n') if title is not None else None},
            'aria_labelledby': labelled, 'aria_label_literal': n.get('aria-label'),
            'label_targets_exist': all(x in by_id for x in labelled) if labelled else None,
            'aria_modal_literal': n.get('aria-modal'), 'aria_hidden_literal': n.get('aria-hidden'),
            'close_controls': [control(x) for x in closes],
            'minimize_controls': [control(x) for x in mins],
            'header_regions': [{'id': x.get('id'), 'class': x.get('class'), 'line': x.sourceline} for x in headers],
            'body_regions': [{'id': x.get('id'), 'class': x.get('class'), 'line': x.sourceline,
                             'style': x.get('style')} for x in bodies],
            'geometry_or_visibility_inferred': False}
    items.append(item)

# Lexical CSS traversal: declarations/at-rules, preserving source line offsets.
# It is deliberately not a cascade evaluator or a substitute for browser layout.
def skip_space(s, i, end):
    while i < end:
        if s[i].isspace(): i += 1
        elif s.startswith('/*', i):
            j = s.find('*/', i + 2); i = end if j < 0 else j + 2
        else: break
    return i

def scan(s, i, end, stops):
    quote = None; parens = 0; brackets = 0
    while i < end:
        c = s[i]
        if quote:
            if c == '\\': i += 2; continue
            if c == quote: quote = None
        elif s.startswith('/*', i):
            j = s.find('*/', i + 2); i = end if j < 0 else j + 2; continue
        elif c in ('"', "'"): quote = c
        elif c == '(': parens += 1
        elif c == ')': parens = max(0, parens - 1)
        elif c == '[': brackets += 1
        elif c == ']': brackets = max(0, brackets - 1)
        elif not parens and not brackets and c in stops: return i
        i += 1
    return end

def block_end(s, start, end):
    depth = 1; i = start
    while i < end:
        p = scan(s, i, end, '{}')
        if p == end: return end
        depth += 1 if s[p] == '{' else -1
        if depth == 0: return p
        i = p + 1
    return end

props = {'display','position','inset','inset-inline','inset-block','top','bottom','left','right',
         'width','min-width','max-width','height','min-height','max-height','block-size','min-block-size',
         'max-block-size','overflow','overflow-x','overflow-y','flex','flex-direction','flex-shrink',
         'flex-grow','grid-template-rows','padding','padding-top','padding-bottom','margin','margin-top',
         'margin-bottom','box-sizing','resize','touch-action','z-index','content','pointer-events',
         'visibility','transform','font-size','gap','align-items','justify-content','overscroll-behavior'}
all_rules=[]
def parse_css(s, start, end, line0, context):
    i = start
    while i < end:
        i = skip_space(s, i, end)
        if i >= end: break
        p = scan(s, i, end, '{;')
        if p >= end: break
        if s[p] == ';': i = p + 1; continue
        q = block_end(s, p + 1, end)
        selector = re.sub(r'/\*.*?\*/', '', s[i:p], flags=re.S).strip()
        compact = ' '.join(selector.split())
        line = line0 + s.count('\n', 0, i)
        if compact.startswith(('@media','@supports','@container','@layer')):
            parse_css(s, p + 1, q, line0, context + [compact])
        elif compact and not compact.startswith('@'):
            decls=[]; a = p + 1
            while a < q:
                a = skip_space(s, a, q); z = scan(s, a, q, ';')
                declaration = re.sub(r'/\*.*?\*/', '', s[a:z], flags=re.S).strip()
                if ':' in declaration:
                    name, value = declaration.split(':', 1); name = name.strip(); value = ' '.join(value.split())
                    if name in props: decls.append({'property': name, 'value': value})
                a = z + 1
            all_rules.append({'selector': compact, 'line': line, 'context': context, 'declarations': decls})
        i = q + 1

for sty in dom.xpath('//style'):
    value = sty.text or ''; parse_css(value, 0, len(value), sty.sourceline, [])

classes = {x for n in nodes for x in n.get('class', '').split()}
ids = {n.get('id') for n in nodes}
target_tokens = ['.'+x for x in classes] + ['#'+x for x in ids] + [
    '.app-modal-head','.app-modal-title','.app-modal-body','.app-modal-close','.app-modal-min-btn',
    '.gis-panel-minimized','.gis-modal-minimize-notice']
relevant=[]
for r in all_rules:
    selector=r['selector']
    if r['declarations'] and (any(t in selector for t in target_tokens) or re.search(r'(?<![\w-])dialog(?![\w-])',selector)):
        relevant.append(r)

for item in items:
    tokens=['#'+item['id']]+['.'+x for x in item['classes'] if x!='app-modal']
    item['specific_css_rule_lines']=[r['line'] for r in relevant if any(t in r['selector'] for t in tokens)]

selected_lines={3305,5058,5059,5060,5066,5141,5157,5161,5167,5168,5169,5179,
                6948,6970,6976,6978,7020,7061,7070,7342,8433,9217,9244,9257,9262,
                9311,12425,12429,12674}
selected_css=[r for r in relevant if r['line'] in selected_lines]
result={'source':{'commit':'c33f58c956e9630b03f9ff86eb35eccd35879a4a','sha256':SHA,'bytes':len(data),
                  'path':str(SOURCE)},
        'checked_at_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'scope':'Static parsed HTML plus relevant CSS declarations; not computed layout or JS lifecycle',
        'counts':{'dialogs':sum(x['element']=='dialog' for x in items),'other_floating_candidates':sum(x['element']!='dialog' for x in items),
                  'app_modal_dialogs':sum('app-modal' in x['classes'] for x in items),
                  'dialogs_with_minimize_markup':sum(bool(x['minimize_controls']) for x in items if x['element']=='dialog'),
                  'dialogs_without_static_accessible_name':sum(not x['aria_labelledby'] and not x['aria_label_literal'] for x in items if x['element']=='dialog'),
                  'all_qualified_css_rules':len(all_rules),'relevant_css_rules_indexed':len(relevant),
                  'targeted_css_rules_saved':len(selected_css)},
        'items':items,'css_rules':selected_css,
        'css_selection':'Only shared layout/control rules and the targeted Converti/Strumenti/Guida/Astro cases are saved; all matched per-window rule line numbers remain indexed above.',
        'limitations':['CSS cascade, media state, runtime inline styles and actual reachability are not evaluated',
                       'Names and aria attributes may be populated or changed by i18n/JS',
                       'Compact decision dialogs and tools drawer are not automatically failures of a full-height operational-panel target',
                       'Inventory covers static markup; dynamic wrappers/popovers are excluded except the known offlineTilePanel content and legacy tabDrawer',
                       'No browser/provider test or user-profile access was performed by this static audit']}
OUT.mkdir(parents=True,exist_ok=True)
(OUT/'inventory.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(result['counts'],indent=2))
