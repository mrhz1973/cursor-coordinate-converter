"""Publish a verified linear commit range using the existing isolated bare repository."""
import base64, datetime, hashlib, json, os, pathlib, re, subprocess, sys, zlib

base = pathlib.Path(r'D:\ChatGPT\TMAR-GIS\work\gpt-audit-20261109-1a2a0a10')
repo = base / 'publication-isolated.git'
packet = sys.argv[1]
assert re.fullmatch(r'checkpoint-[0-9a-f]{8}', packet)
m = json.loads((base / (packet + '.json')).read_text(encoding='utf-8-sig'))
old, new = m.get('base_commit', m['parent']), m['commit']
assert all(re.fullmatch(r'[0-9a-f]{40}', value) for value in (old, new))
assert m['kind'] in {'runtime', 'runtime_and_docs', 'docs'}
chain = m.get('commit_chain', [new])
assert chain and chain[-1] == new and all(re.fullmatch(r'[0-9a-f]{40}', value) for value in chain)
assert re.fullmatch(r'HEAD|refs/heads/[A-Za-z0-9_/-]+', m['bundle_ref'])
ref = 'refs/heads/gpt-' + packet
env = os.environ.copy()
env.update(GIT_TERMINAL_PROMPT='0', GCM_INTERACTIVE='never')
sha = lambda data: hashlib.sha256(data).hexdigest()
result = {'started_at_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
          'device': 'ASUSDESKTOP', 'repository': str(repo), 'expected_old': old,
          'expected_new': new, 'kind': m['kind']}

def git(*args, binary=False):
    proc = subprocess.run(['git', '-C', str(repo), *args], env=env,
                          capture_output=True, check=True, timeout=180)
    return proc.stdout if binary else proc.stdout.decode('utf-8').strip()

try:
    assert (base / 'OWNER.txt').exists() and repo.is_dir()
    assert git('remote', 'get-url', 'origin') == 'https://github.com/mrhz1973/cursor-coordinate-converter.git'
    before = git('ls-remote', 'origin', 'refs/heads/main').split()[0]
    result['remote_before'] = before
    assert before in {old, new}, 'Remote changed; stop'
    git('fetch', '--no-tags', '--depth=2', 'origin', 'refs/heads/main:refs/remotes/origin/main')
    encoded = ''.join((base / (packet + '.zlib.b64')).read_text().split())
    assert len(encoded) == m['encoded_chars']
    raw = zlib.decompress(base64.b64decode(encoded, validate=True))
    assert len(raw) == m['bundle_bytes'] and sha(raw) == m['bundle_sha256']
    bundle = base / (packet + '.bundle')
    bundle.write_bytes(raw)
    result['bundle_verified'] = True
    git('bundle', 'verify', str(bundle))
    assert git('bundle', 'list-heads', str(bundle), m['bundle_ref']).split() == [new, m['bundle_ref']]
    git('fetch', str(bundle), m['bundle_ref'] + ':' + ref)
    assert git('rev-parse', ref) == new and git('rev-parse', new + '^') == m['parent']
    git('merge-base', '--is-ancestor', old, new)
    assert git('rev-list', '--reverse', old + '..' + new).splitlines() == chain
    previous = old
    for commit in chain:
        assert git('rev-list', '--parents', '-n', '1', commit).split() == [commit, previous]
        previous = commit
    paths = git('diff', '--name-only', old, new).splitlines()
    assert len(paths) == len(set(paths)) and set(paths) == set(m['changed_paths'])
    if m['kind'] == 'runtime':
        assert len(chain) == 1 and paths == ['coordinate_converter Claude.html']
    elif m['kind'] == 'runtime_and_docs':
        assert len(chain) == 2
        assert git('diff', '--name-only', old, chain[0]).splitlines() == ['coordinate_converter Claude.html']
        doc_paths = git('diff', '--name-only', chain[0], new).splitlines()
        assert doc_paths and all(p.startswith('docs/') for p in doc_paths)
        assert not git('diff', chain[0], new, '--', 'coordinate_converter Claude.html')
    else:
        assert len(chain) == 1 and paths and all(p.startswith('docs/') for p in paths)
        assert not git('diff', old, new, '--', 'coordinate_converter Claude.html')
    assert sha(git('show', old + ':coordinate_converter Claude.html', binary=True)) == m['parent_runtime_sha256']
    data = git('show', new + ':coordinate_converter Claude.html', binary=True)
    assert len(data) == m['runtime_bytes'] and sha(data) == m['runtime_sha256']
    assert git('rev-parse', new + ':coordinate_converter Claude.html') == m['runtime_blob']
    if m.get('runtime_source_commit'):
        git('merge-base', '--is-ancestor', m['runtime_source_commit'], new)
        assert git('rev-parse', m['runtime_source_commit'] + ':coordinate_converter Claude.html') == m['runtime_blob']
    assert isinstance(m['runtime_build'], int) and m['runtime_build'] == 281
    runtime = base / ('runtime-281-' + sha(data)[:8] + '.html')
    if runtime.exists():
        assert runtime.read_bytes() == data, 'Existing candidate differs; stop'
    else:
        with runtime.open('xb') as output:
            output.write(data)
    result.update(runtime_path=str(runtime), runtime_sha256=sha(data), runtime_bytes=len(data),
                  runtime_blob=m['runtime_blob'], changed_paths=paths)
    if before == old:
        result['push_output'] = git('push', 'origin', ref + ':refs/heads/main')
    after = git('ls-remote', 'origin', 'refs/heads/main').split()[0]
    result['remote_after'] = after
    assert after == new
    result['state'] = 'PUBLISHED_PASS' if before == old else 'ALREADY_PUBLISHED_VERIFIED'
except Exception as exc:
    result.update(state='FAILED', error=str(exc))
    if isinstance(exc, subprocess.CalledProcessError):
        result['stderr'] = exc.stderr.decode('utf-8', 'replace') if isinstance(exc.stderr, bytes) else exc.stderr
finally:
    result['finished_at_utc'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    (base / (packet + '-publication-result.json')).write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps(result, ensure_ascii=False, indent=2))
if result['state'] not in {'PUBLISHED_PASS', 'ALREADY_PUBLISHED_VERIFIED'}:
    sys.exit(1)
