"""Prepared only. Run over the verified SSH route only after the parent's GO.

No code runs on import. Only the GIS service may be restarted. Git rollback
uses a guarded detached checkout; it never resets, cleans or forces files.
"""
from pathlib import Path
import argparse
import datetime
import fcntl
import hashlib
import json
import os
import re
import signal
import ssl
import stat
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request

REPO = Path('/root/local-files/handoff-runtime/cursor-coordinate-converter')
RUNTIME = 'coordinate_converter Claude.html'
RUNTIME_SOURCE_COMMIT = '0c0f6785654dbba279774bb8569788088f0762e9'
EXPECTED_REMOTE_HEAD = None  # Required full commit from the later explicit GO.
TARGET_BLOB = '3dcff61081a2f461f8841953986ced17b058eab1'
NEW_SHA = 'e8bd8c1d354919064cfd09033f97fe294f366d34c12f1e92dc1d5a3bcd38ca62'
NEW_BYTES, NEW_BUILD = 11108861, 281
OLD_SHA = '70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde'
OLD_BYTES, OLD_BUILD = 11108654, 280
BACKUP_PARENT = Path('/var/backups/goi-gis-runtime')
ORIGIN = 'https://ionos-n8n-new.tailc01234.ts.net'
HTTP_RUNTIME = 'http://100.99.54.93:8000/coordinate_converter%20Claude.html'
OLD_ORIGIN = 'http://100.99.54.93:8000'
SERVICE = 'goi-gis-app.service'
SERVICE_NAMES = ('nginx.service', 'goi-ors-gateway.service', SERVICE,
                 'goi-gis-https443-proxy.service')
SHARED_PORTS = (443, 8020, 18080, 8989, 8089, 8099)
CONFIGS = {
    '/etc/nginx/sites-available/goi-ors-gateway':
        'b57501bb9306127c6aef551a4afd8ecc720922ccb4979d8ab5461303478f5fd5',
    '/opt/goi-ors-gateway/current/goi_ors_gateway.py':
        'e15a23f6b098b340b4c7f290c9ea96d4e01085bc4a5d9cc843ad32e9135089d8',
    '/opt/goi-gis-https443/gis_same_origin_proxy.py':
        'ae32a22ac5b66fc4771e3d19d5fe7f89b34ce6ccfec0e1c02dc792a4165dc06d',
    '/etc/systemd/system/goi-gis-https443-proxy.service':
        'dcd667915070e02b61a8a0d88b90af4daf88b81c715f562aed6e0d068574b012',
    '/etc/nginx/snippets/goi-gis-https443.common.conf':
        '35702da28f71a7ab59574784af6ed1dc430e60d80c26e4bd8f31f31284f0f5c5',
    '/etc/nginx/snippets/goi-gis-https443.locations.conf':
        'f01bba43f03d3b90aa35da4f70cd60d9ef7b1e75b8b4084796197abf938e9ab6',
}
ENDPOINTS = {
    'ors_old': (ORIGIN + '/ors/status', OLD_ORIGIN),
    'ors_new': (ORIGIN + '/ors/status', ORIGIN),
    'catalogo': (ORIGIN + '/catalogo/', None),
    'vps': (ORIGIN + '/vps/', None),
}
ENV = os.environ.copy()
ENV['GIT_TERMINAL_PROMPT'] = '0'
ENV['LC_ALL'] = 'C'
STATE = None
ROOT = None


class TransientEndpointError(RuntimeError):
    pass


def now():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def require(value, message):
    if not value:
        raise RuntimeError(message)


def sha(value):
    return hashlib.sha256(value).hexdigest()


def sync_dir(path):
    descriptor = os.open(str(path), os.O_RDONLY | os.O_DIRECTORY)
    try:
        os.fsync(descriptor)
    finally:
        os.close(descriptor)


def private_directory(path):
    value = path.lstat()
    require(stat.S_ISDIR(value.st_mode) and value.st_uid == 0
            and stat.S_IMODE(value.st_mode) == 0o700,
            'UNEXPECTED_BACKUP_DIRECTORY_METADATA')


def private_bytes(path, contents):
    descriptor = os.open(str(path), os.O_CREAT | os.O_EXCL | os.O_WRONLY
                         | os.O_NOFOLLOW, 0o600)
    with os.fdopen(descriptor, 'wb') as stream:
        stream.write(contents)
        stream.flush()
        os.fsync(stream.fileno())
    sync_dir(path.parent)


def save(event, value=None):
    require(STATE is not None and ROOT is not None, 'JOURNAL_UNAVAILABLE')
    STATE['events'].append({'at_utc': now(), 'event': event, 'value': value})
    descriptor, temporary = tempfile.mkstemp(prefix='.state-', dir=str(ROOT))
    try:
        with os.fdopen(descriptor, 'w', encoding='utf-8') as stream:
            os.fchmod(stream.fileno(), 0o600)
            json.dump(STATE, stream, indent=2)
            stream.write('\n')
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, ROOT / 'state.json')
        sync_dir(ROOT)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


def run(argv, timeout=45):
    process = subprocess.run(argv, capture_output=True, env=ENV, timeout=timeout)
    if STATE is not None:
        save('command', {'argv': argv, 'returncode': process.returncode,
                         'stdout_sha256': sha(process.stdout),
                         'stderr_sha256': sha(process.stderr)})
    require(process.returncode == 0,
            'COMMAND_FAILED:' + json.dumps({'argv': argv,
                                            'returncode': process.returncode}))
    return process.stdout


def git(*args):
    # Per-command options only: no persistent Git or service configuration change.
    return run(['git', '-C', str(REPO), '-c', 'core.hooksPath=/dev/null',
                '-c', 'core.fsmonitor=false', *args], timeout=90)


def git_text(*args):
    return git(*args).decode('utf-8').strip()


def check_origin():
    # Do not print or persist the raw remote URL.
    value = git_text('remote', 'get-url', 'origin')
    allowed = {
        'https://github.com/mrhz1973/cursor-coordinate-converter',
        'https://github.com/mrhz1973/cursor-coordinate-converter.git',
        'git@github.com:mrhz1973/cursor-coordinate-converter',
        'git@github.com:mrhz1973/cursor-coordinate-converter.git',
        'ssh://git@github.com/mrhz1973/cursor-coordinate-converter',
        'ssh://git@github.com/mrhz1973/cursor-coordinate-converter.git',
    }
    require(value in allowed, 'UNEXPECTED_ORIGIN_URL')


def remote_main():
    rows = git_text('ls-remote', 'origin', 'refs/heads/main').splitlines()
    require(len(rows) == 1, 'UNEXPECTED_REMOTE_MAIN_RESPONSE')
    fields = rows[0].split()
    require(len(fields) == 2 and fields[1] == 'refs/heads/main',
            'UNEXPECTED_REMOTE_MAIN_RESPONSE')
    return fields[0]


def clean_head(expected=None, branch=None):
    require(git('status', '--porcelain=v1', '--untracked-files=all') == b'',
            'DIRTY_CLONE')
    value = git_text('rev-parse', 'HEAD')
    if expected:
        require(value == expected, 'HEAD_CHANGED')
    if branch is not None:
        require(git_text('branch', '--show-current') == branch, 'UNEXPECTED_BRANCH')
    return value


def runtime_bytes(contents, expected_sha, expected_bytes, expected_build):
    match = re.search(rb'const APP_BUILD_NUM\s*=\s*(\d+)', contents)
    value = {'bytes': len(contents), 'sha256': sha(contents),
             'build': int(match.group(1)) if match else None}
    require(value == {'bytes': expected_bytes, 'sha256': expected_sha,
                       'build': expected_build}, 'RUNTIME_BYTE_PROOF_FAILED')
    return value


def config_hashes():
    value = {path: sha(Path(path).read_bytes()) for path in CONFIGS}
    require(value == CONFIGS, 'INFRA_CONFIG_CHANGED')
    return value


def services():
    output = run(['systemctl', 'show', *SERVICE_NAMES,
                  '--property=Id,MainPID,ActiveState,SubState'], timeout=15)
    value = {}
    for block in output.decode().strip().split('\n\n'):
        item = dict(row.split('=', 1) for row in block.splitlines() if '=' in row)
        value[item['Id']] = item
    require(set(value) == set(SERVICE_NAMES), 'SERVICE_SET_MISMATCH')
    require(all(item['ActiveState'] == 'active' and int(item['MainPID']) > 0
                for item in value.values()), 'SERVICE_NOT_ACTIVE')
    return value


def listeners():
    expression = '( ' + ' or '.join('sport = :' + str(port)
                                    for port in SHARED_PORTS) + ' )'
    output = run(['ss', '-H', '-ltnp', expression], timeout=10).decode()
    value = sorted([
        {'address': row.split()[3],
         'pids': sorted(set(re.findall(r'pid=(\d+)', row)))}
        for row in output.splitlines()
    ], key=lambda item: (item['address'], item['pids']))
    observed = {int(item['address'].rsplit(':', 1)[1]) for item in value}
    require(observed == set(SHARED_PORTS), 'SHARED_LISTENER_MISSING')
    return value


def get(url, origin=None, runtime=None):
    headers = {'Cache-Control': 'no-cache'}
    if origin:
        headers['Origin'] = origin
    request = urllib.request.Request(url, headers=headers, method='GET')
    opener = urllib.request.build_opener(
        urllib.request.ProxyHandler({}),
        urllib.request.HTTPSHandler(context=ssl.create_default_context()))
    try:
        response = opener.open(request, timeout=25)
    except urllib.error.HTTPError as error:
        response = error
    with response:
        contents = response.read()
        value = {'status': response.status, 'url': response.geturl(),
                 'bytes': len(contents), 'sha256': sha(contents),
                 'content_type': response.headers.get('Content-Type'),
                 'allow_origin': response.headers.get('Access-Control-Allow-Origin'),
                 'tls_verified': url.startswith('https://')}
    if value['status'] in (502, 503, 504):
        raise TransientEndpointError('ENDPOINT_NOT_READY:' + url)
    require(value['status'] == 200 and value['url'] == url,
            'HTTP_ENDPOINT_FAILED:' + url)
    if runtime:
        value.update(runtime_bytes(contents, *runtime))
    return value


def runtime_pair(expected_sha, expected_bytes, expected_build, retry=False):
    specification = (expected_sha, expected_bytes, expected_build)
    deadline = time.monotonic() + (20 if retry else 0)
    while True:
        try:
            return {'http': get(HTTP_RUNTIME, runtime=specification),
                    'https': get(ORIGIN + '/gis', runtime=specification)}
        except (OSError, urllib.error.URLError, TransientEndpointError):
            if time.monotonic() >= deadline:
                raise
            time.sleep(0.25)


def shared_http():
    value = {name: get(url, origin) for name, (url, origin) in ENDPOINTS.items()}
    require(value['ors_old']['allow_origin'] == OLD_ORIGIN,
            'OLD_ORS_ORIGIN_NOT_PRESERVED')
    require(value['ors_new']['allow_origin'] == ORIGIN,
            'HTTPS_ORS_ORIGIN_NOT_PRESERVED')
    return value


def verify_shared(before, keep_gis_pid=False):
    current = services()
    for name, prior in before['services_before'].items():
        if name != SERVICE or keep_gis_pid:
            require(current[name] == prior, 'SERVICE_CHANGED:' + name)
    current_listeners = listeners()
    require(current_listeners == before['shared_listeners_before'],
            'SHARED_LISTENER_CHANGED')
    current_configs = config_hashes()
    require(current_configs == before['config_hashes_before'], 'INFRA_CONFIG_CHANGED')
    current_http = shared_http()
    require(current_http == before['shared_http_before'], 'SHARED_ENDPOINT_CHANGED')
    return {'services': current, 'listeners': current_listeners,
            'config_hashes': current_configs, 'http': current_http}


def check_candidate():
    git('merge-base', '--is-ancestor', RUNTIME_SOURCE_COMMIT, EXPECTED_REMOTE_HEAD)
    source_blob = git_text('rev-parse', RUNTIME_SOURCE_COMMIT + ':' + RUNTIME)
    head_blob = git_text('rev-parse', EXPECTED_REMOTE_HEAD + ':' + RUNTIME)
    require(source_blob == head_blob == TARGET_BLOB, 'CANDIDATE_BLOB_MISMATCH')
    checkpoint_paths = git_text('diff', '--name-only', RUNTIME_SOURCE_COMMIT,
                                EXPECTED_REMOTE_HEAD).splitlines()
    require(all(path.startswith('docs/') for path in checkpoint_paths),
            'NON_DOCUMENTAL_CHANGE_AFTER_RUNTIME_SOURCE')
    return runtime_bytes(git('show', EXPECTED_REMOTE_HEAD + ':' + RUNTIME), NEW_SHA,
                         NEW_BYTES, NEW_BUILD)


def checked_backup_path(directory):
    value = Path(directory)
    require(value.parent == BACKUP_PARENT
            and re.fullmatch(r'\d{8}T\d{12}Z-build281', value.name) is not None,
            'INVALID_BACKUP_PATH')
    return value


def preflight(directory):
    global STATE, ROOT
    planned = checked_backup_path(directory)
    require(not planned.exists() and not planned.is_symlink(),
            'PREFLIGHT_DIRECTORY_ALREADY_EXISTS_DO_NOT_REPEAT')
    check_origin()
    before_head = clean_head(branch='main')
    old = (REPO / RUNTIME).read_bytes()
    runtime_bytes(old, OLD_SHA, OLD_BYTES, OLD_BUILD)
    require(remote_main() == EXPECTED_REMOTE_HEAD, 'REMOTE_COMMIT_NOT_APPROVED')
    git('fetch', '--no-tags', 'origin',
        'refs/heads/main:refs/remotes/origin/main')
    require(git_text('rev-parse', 'FETCH_HEAD') == EXPECTED_REMOTE_HEAD
            and git_text('rev-parse', 'origin/main') == EXPECTED_REMOTE_HEAD,
            'FETCHED_COMMIT_MISMATCH')
    require(remote_main() == EXPECTED_REMOTE_HEAD, 'REMOTE_CHANGED_DURING_FETCH')
    git('merge-base', '--is-ancestor', before_head, EXPECTED_REMOTE_HEAD)
    candidate = check_candidate()
    changed = git_text('diff', '--name-only', before_head, EXPECTED_REMOTE_HEAD).splitlines()
    require(RUNTIME in changed and all(path == RUNTIME or path.startswith('docs/')
                                      for path in changed), 'UNEXPECTED_CHANGED_PATH')
    configurations = config_hashes()
    service_state = services()
    listener_state = listeners()
    live_runtime = runtime_pair(OLD_SHA, OLD_BYTES, OLD_BUILD)
    endpoints = shared_http()
    clean_head(before_head, 'main')
    require(sha((REPO / RUNTIME).read_bytes()) == OLD_SHA, 'LIVE_FILE_CHANGED')
    require(services() == service_state and listeners() == listener_state,
            'BASELINE_CHANGED_DURING_PREFLIGHT')
    if not BACKUP_PARENT.exists():
        BACKUP_PARENT.mkdir(mode=0o700)
        sync_dir(BACKUP_PARENT.parent)
    private_directory(BACKUP_PARENT)
    ROOT = planned
    ROOT.mkdir(mode=0o700)
    sync_dir(BACKUP_PARENT)
    private_bytes(ROOT / 'runtime-before.html', old)
    require(sha((ROOT / 'runtime-before.html').read_bytes()) == OLD_SHA,
            'BACKUP_BYTE_MISMATCH')
    STATE = {
        'schema': 1, 'status': 'PREFLIGHT_PASS', 'checked_at_utc': now(),
        'repo': str(REPO), 'runtime_path': RUNTIME, 'branch_before': 'main',
        'before_head': before_head, 'backup_directory': str(ROOT),
        'runtime_source_commit': RUNTIME_SOURCE_COMMIT,
        'expected_remote_head': EXPECTED_REMOTE_HEAD, 'target_blob': TARGET_BLOB,
        'target_sha256': NEW_SHA, 'target_bytes': NEW_BYTES,
        'target_build': NEW_BUILD, 'old_sha256': OLD_SHA,
        'old_bytes': OLD_BYTES, 'old_build': OLD_BUILD,
        'changed_paths': changed, 'candidate': candidate,
        'services_before': service_state, 'shared_listeners_before': listener_state,
        'config_hashes_before': configurations, 'runtime_before': live_runtime,
        'shared_http_before': endpoints, 'events': [],
        'provider_post_requests': 0,
    }
    save('preflight_completed')
    return STATE


def load_state(directory):
    global ROOT, STATE
    value = checked_backup_path(directory)
    private_directory(BACKUP_PARENT)
    private_directory(value)
    state_path = value / 'state.json'
    metadata = state_path.lstat()
    require(stat.S_ISREG(metadata.st_mode) and metadata.st_uid == 0
            and stat.S_IMODE(metadata.st_mode) == 0o600, 'UNSAFE_STATE_FILE')
    current = json.loads(state_path.read_text(encoding='utf-8'))
    expected = {
        'repo': str(REPO), 'runtime_path': RUNTIME,
        'runtime_source_commit': RUNTIME_SOURCE_COMMIT,
        'target_blob': TARGET_BLOB, 'target_sha256': NEW_SHA,
        'target_bytes': NEW_BYTES, 'target_build': NEW_BUILD,
        'old_sha256': OLD_SHA, 'old_bytes': OLD_BYTES, 'old_build': OLD_BUILD,
        'backup_directory': str(value), 'config_hashes_before': CONFIGS,
    }
    require(all(current.get(key) == item for key, item in expected.items()),
            'STATE_BELONGS_TO_ANOTHER_TRANSACTION')
    recorded_head = current.get('expected_remote_head', '')
    require(re.fullmatch(r'[0-9a-f]{40}', recorded_head) is not None,
            'INVALID_RECORDED_REMOTE_HEAD')
    if EXPECTED_REMOTE_HEAD is not None:
        require(recorded_head == EXPECTED_REMOTE_HEAD, 'GO_AND_STATE_HEAD_DIFFER')
    ROOT, STATE = value, current
    return current


def rollback():
    # No forced restoration is permitted when any concurrent edit is present.
    head = clean_head()
    value = (REPO / RUNTIME).read_bytes()
    if head == EXPECTED_REMOTE_HEAD:
        runtime_bytes(value, NEW_SHA, NEW_BYTES, NEW_BUILD)
        STATE['rollback_checkout_attempted'] = True
        save('rollback_detached_checkout_attempt', STATE['before_head'])
        git('switch', '--detach', STATE['before_head'])
    else:
        require(head == STATE['before_head'], 'ROLLBACK_REFUSED_NONEXACT_HEAD')
        runtime_bytes(value, OLD_SHA, OLD_BYTES, OLD_BUILD)
        if not STATE.get('gis_restart_attempted'):
            STATE['unchanged_runtime'] = runtime_pair(OLD_SHA, OLD_BYTES, OLD_BUILD)
            STATE['unchanged_shared'] = verify_shared(STATE, keep_gis_pid=True)
            STATE['status'] = 'DEPLOY_STOPPED_NO_RUNTIME_CHANGE'
            STATE['stopped_at_utc'] = now()
            save('stopped_before_runtime_change')
            return
    clean_head(STATE['before_head'])
    runtime_bytes((REPO / RUNTIME).read_bytes(), OLD_SHA, OLD_BYTES, OLD_BUILD)
    STATE['rollback_restart_attempted'] = True
    save('rollback_gis_restart_attempt')
    run(['systemctl', 'restart', SERVICE])
    STATE['rollback_runtime'] = runtime_pair(OLD_SHA, OLD_BYTES, OLD_BUILD, retry=True)
    STATE['rollback_shared'] = verify_shared(STATE)
    STATE['rollback_head'] = clean_head(STATE['before_head'])
    STATE['rollback_branch'] = git_text('branch', '--show-current')
    STATE['status'] = 'ROLLED_BACK_TO_280'
    STATE['rollback_completed_at_utc'] = now()
    save('rollback_completed')


def apply(directory):
    load_state(directory)
    require(STATE['status'] == 'PREFLIGHT_PASS', 'TRANSACTION_ALREADY_STARTED_OR_CLOSED')
    checked = datetime.datetime.fromisoformat(STATE['checked_at_utc'])
    age = (datetime.datetime.now(datetime.timezone.utc) - checked).total_seconds()
    require(0 <= age <= 600, 'PREFLIGHT_EXPIRED')
    check_origin()
    clean_head(STATE['before_head'], 'main')
    require(remote_main() == EXPECTED_REMOTE_HEAD, 'REMOTE_CHANGED_SINCE_PREFLIGHT')
    require(git_text('rev-parse', 'origin/main') == EXPECTED_REMOTE_HEAD, 'LOCAL_REMOTE_REF_CHANGED')
    check_candidate()
    runtime_bytes((REPO / RUNTIME).read_bytes(), OLD_SHA, OLD_BYTES, OLD_BUILD)
    runtime_bytes((ROOT / 'runtime-before.html').read_bytes(), OLD_SHA, OLD_BYTES,
                  OLD_BUILD)
    runtime_pair(OLD_SHA, OLD_BYTES, OLD_BUILD)
    verify_shared(STATE, keep_gis_pid=True)
    try:
        STATE['status'] = 'APPLYING'
        STATE['fast_forward_attempted'] = True
        save('fast_forward_attempt', EXPECTED_REMOTE_HEAD)
        git('merge', '--ff-only', '--no-edit', EXPECTED_REMOTE_HEAD)
        clean_head(EXPECTED_REMOTE_HEAD, 'main')
        runtime_bytes((REPO / RUNTIME).read_bytes(), NEW_SHA, NEW_BYTES, NEW_BUILD)
        require(git_text('rev-parse', 'HEAD:' + RUNTIME) == TARGET_BLOB,
                'DEPLOYED_BLOB_MISMATCH')
        STATE['gis_restart_attempted'] = True
        save('gis_restart_attempt')
        run(['systemctl', 'restart', SERVICE])
        STATE['runtime_after'] = runtime_pair(NEW_SHA, NEW_BYTES, NEW_BUILD, retry=True)
        save('runtime_byte_proof', STATE['runtime_after'])
        STATE['shared_after'] = verify_shared(STATE)
        require(STATE['shared_after']['services'][SERVICE]['MainPID']
                != STATE['services_before'][SERVICE]['MainPID'],
                'GIS_RESTART_NOT_OBSERVED')
        STATE['final_head'] = clean_head(EXPECTED_REMOTE_HEAD, 'main')
        STATE['final_branch'] = 'main'
        STATE['final_status'] = 'clean'
        STATE['status'] = 'DEPLOY_PASS'
        STATE['completed_at_utc'] = now()
        save('deploy_completed')
    except BaseException as error:
        STATE['status'] = 'DEPLOY_FAILED'
        STATE['deploy_error'] = type(error).__name__ + ': ' + str(error)
        save('deploy_failed', STATE['deploy_error'])
        try:
            rollback()
        except BaseException as rollback_error:
            STATE['status'] = 'ROLLBACK_INCOMPLETE_REQUIRES_REVIEW'
            STATE['rollback_error'] = type(rollback_error).__name__ + ': ' + str(rollback_error)
            save('rollback_failed', STATE['rollback_error'])
        return STATE
    return STATE


def interrupted(number, unused_frame):
    raise RuntimeError('SIGNAL_RECEIVED:' + str(number))


def main():
    global EXPECTED_REMOTE_HEAD
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--phase', required=True, choices=('preflight', 'apply', 'status'))
    parser.add_argument('--go-remote-head', help='Exact full origin/main commit explicitly supplied with the parent GO')
    parser.add_argument('--backup-directory')
    options = parser.parse_args()
    require(os.geteuid() == 0, 'ROOT_REQUIRED')
    require(REPO.is_dir() and not REPO.is_symlink(), 'CANONICAL_REPO_UNAVAILABLE')
    if options.phase != 'status':
        require(options.go_remote_head is not None
                and re.fullmatch(r'[0-9a-f]{40}', options.go_remote_head) is not None,
                'EXPLICIT_PARENT_GO_REMOTE_HEAD_REQUIRED')
    if options.go_remote_head is not None:
        require(re.fullmatch(r'[0-9a-f]{40}', options.go_remote_head) is not None,
                'INVALID_GO_REMOTE_HEAD')
        EXPECTED_REMOTE_HEAD = options.go_remote_head
    require(options.backup_directory is not None, 'BACKUP_DIRECTORY_REQUIRED')
    # The directory lock creates no extra file and spans the entire transaction phase.
    descriptor = os.open(str(REPO), os.O_RDONLY | os.O_DIRECTORY)
    try:
        try:
            fcntl.flock(descriptor, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            raise RuntimeError('ANOTHER_RUNTIME_TRANSACTION_IS_RUNNING')
        for number in (signal.SIGTERM, signal.SIGHUP):
            signal.signal(number, interrupted)
        if options.phase == 'preflight':
            result = preflight(options.backup_directory)
        elif options.phase == 'apply':
            result = apply(options.backup_directory)
        else:
            result = load_state(options.backup_directory)
        print(json.dumps(result), flush=True)
        return 0 if result['status'] in ('PREFLIGHT_PASS', 'DEPLOY_PASS') or options.phase == 'status' else 1
    except BaseException as error:
        outcome = {'status': 'REFUSED_OR_FAILED', 'phase': options.phase,
                   'error': type(error).__name__ + ': ' + str(error),
                   'backup_directory': str(ROOT) if ROOT else options.backup_directory,
                   'journal_status': STATE.get('status') if STATE else None,
                   'at_utc': now()}
        print(json.dumps(outcome), flush=True)
        return 1
    finally:
        os.close(descriptor)


if __name__ == '__main__':
    sys.exit(main())
