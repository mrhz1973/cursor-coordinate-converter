"""Authorized one-time bootstrap. PACK is supplied by the verified launcher."""
import datetime
import fcntl
import grp
import hashlib
import json
import os
import pwd
from pathlib import Path
import subprocess
import sys

ROOT = Path('/opt/tmar-vps-access')
STATE = Path('/var/lib/tmar-vps-access')
UNIT = Path('/etc/systemd/system/tmar-vps-access.service')
REPO = Path('/root/local-files/handoff-runtime/cursor-coordinate-converter')
RUNTIME = REPO / 'coordinate_converter Claude.html'
EXPECTED_SHA = 'e8bd8c1d354919064cfd09033f97fe294f366d34c12f1e92dc1d5a3bcd38ca62'
EXPECTED_HEAD = 'cee1c9a1e71a38fc36ba33ab717870730d70036b'
SERVICES = ['nginx.service', 'goi-ors-gateway.service', 'goi-gis-app.service', 'goi-gis-https443-proxy.service']
OWNER = 'TMAR_VPS_DIRECT_ACCESS_20261109_V1'
JOURNAL = ROOT / 'journal.json'

def require(condition, message):
    if not condition:
        raise RuntimeError(message)

def run(args, timeout=30, check=True):
    proc = subprocess.run(args, capture_output=True, text=True, timeout=timeout)
    if check and proc.returncode:
        raise RuntimeError('COMMAND_FAILED:' + args[0] + ':exit_' + str(proc.returncode) + ':' + proc.stderr[-1200:])
    return proc

def record(obj):
    obj['updated_utc'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    temp = ROOT / 'journal.json.tmp'
    temp.write_text(json.dumps(obj, indent=2) + '\n')
    os.chmod(temp, 0o600)
    os.replace(temp, JOURNAL)

def snapshot():
    result = {}
    for service in SERVICES:
        props = run(['systemctl', 'show', service, '-p', 'ActiveState', '-p', 'MainPID']).stdout
        data = dict(line.split('=', 1) for line in props.splitlines())
        require(data.get('ActiveState') == 'active' and int(data.get('MainPID', '0')) > 0, 'PREEXISTING_SERVICE_NOT_ACTIVE:' + service)
        result[service] = data
    raw = RUNTIME.read_bytes()
    listeners = sorted(' '.join(line.split()[3:5]) for line in run(['ss', '-ltnH']).stdout.splitlines())
    return {'services': result, 'runtime_sha256': hashlib.sha256(raw).hexdigest(), 'runtime_bytes': len(raw), 'git_head': run(['git', '-C', str(REPO), 'rev-parse', 'HEAD']).stdout.strip(), 'git_status': run(['git', '-C', str(REPO), 'status', '--porcelain']).stdout, 'tcp_listeners': listeners}

def own_journal():
    require(ROOT.is_dir() and not ROOT.is_symlink(), 'ROOT_MISSING_OR_SYMLINK')
    require((ROOT / 'OWNER').read_text().strip() == OWNER, 'OWNER_MISMATCH')
    return json.loads(JOURNAL.read_text())

def verify_pack():
    require(set(PACK['files']) == {'prepare-user.py', 'tmar-vps-access.service'}, 'PACK_FILES_MISMATCH')
    for item in PACK['files'].values():
        require(hashlib.sha256(item['content'].encode()).hexdigest() == item['sha256'], 'PACK_HASH_MISMATCH')

def prepare():
    verify_pack()
    for lookup in (pwd.getpwnam, grp.getgrnam):
        try:
            lookup('tmar-vps-access')
        except KeyError:
            pass
        else:
            raise RuntimeError('ACCOUNT_OR_GROUP_ALREADY_EXISTS_STOP')
    for path in (ROOT, STATE, Path('/var/lib/private/tmar-vps-access'), UNIT, Path('/var/cache/tmar-vps-access'), Path('/var/cache/private/tmar-vps-access')):
        require(not path.exists() and not path.is_symlink(), 'TARGET_ALREADY_EXISTS_STOP_RECONCILE:' + str(path))
    require(run(['node', '--version']).stdout.strip() == 'v22.23.2', 'NODE_VERSION_CHANGED')
    mem = dict(line.split(':', 1) for line in Path('/proc/meminfo').read_text().splitlines())
    require(int(mem['MemAvailable'].split()[0]) > 1572864, 'INSUFFICIENT_AVAILABLE_MEMORY')
    baseline = snapshot()
    require(baseline['runtime_sha256'] == EXPECTED_SHA and baseline['runtime_bytes'] == 11108861, 'LIVE_RUNTIME_CHANGED')
    require(baseline['git_head'] == EXPECTED_HEAD and not baseline['git_status'], 'LIVE_REPO_CHANGED')
    ROOT.mkdir(mode=0o755)
    (ROOT / 'OWNER').write_text(OWNER + '\n')
    journal = {'owner': OWNER, 'phase': 'PREPARE_STARTED', 'before': baseline, 'file_hashes': {k: v['sha256'] for k, v in PACK['files'].items()}}
    record(journal)
    try:
        for name, item in PACK['files'].items():
            dest = ROOT / name
            dest.write_text(item['content'])
            os.chmod(dest, 0o644)
        run(['systemd-analyze', 'verify', str(ROOT / 'tmar-vps-access.service')])
        props = ['DynamicUser=yes', 'User=tmar-vps-access', 'StateDirectory=tmar-vps-access', 'StateDirectoryMode=0700', 'CacheDirectory=tmar-vps-access', 'CacheDirectoryMode=0700', 'ProtectSystem=strict', 'ProtectHome=yes', 'PrivateTmp=yes', 'PrivateDevices=yes', 'NoNewPrivileges=yes', 'ProtectKernelTunables=yes', 'ProtectKernelModules=yes', 'ProtectControlGroups=yes', 'RestrictSUIDSGID=yes', 'CapabilityBoundingSet=', 'AmbientCapabilities=', 'UMask=0077', 'MemoryMax=1536M', 'CPUQuota=100%', 'TasksMax=256', 'Nice=10', 'TimeoutStartSec=720', 'TimeoutStopSec=20']
        args = ['systemd-run', '--unit=tmar-vps-access-prepare', '--collect', '--wait', '--pipe', '--service-type=oneshot', '--setenv=HOME=/var/lib/tmar-vps-access', '--setenv=PUPPETEER_SKIP_DOWNLOAD=true', '--setenv=npm_config_cache=/var/cache/tmar-vps-access']
        for prop in props:
            args += ['--property=' + prop]
        args += ['/usr/bin/python3', str(ROOT / 'prepare-user.py')]
        journal['phase'] = 'UNPRIVILEGED_INSTALL_RUNNING'
        record(journal)
        outcome = run(args, timeout=840, check=False)
        (ROOT / 'prepare.stdout.log').write_text(outcome.stdout)
        (ROOT / 'prepare.stderr.log').write_text(outcome.stderr)
        os.chmod(ROOT / 'prepare.stdout.log', 0o600)
        os.chmod(ROOT / 'prepare.stderr.log', 0o600)
        require(outcome.returncode == 0, 'UNPRIVILEGED_PREPARE_FAILED:' + str(outcome.returncode))
        prepared = json.loads((STATE / 'prepare-result.json').read_text())
        require(prepared.get('status') == 'PREPARE_PASS' and prepared.get('uid') != 0, 'PREPARE_RESULT_NOT_PASS')
        require(not UNIT.exists(), 'UNIT_APPEARED_DURING_PREPARE')
        with UNIT.open('x') as handle:
            handle.write(PACK['files']['tmar-vps-access.service']['content'])
        os.chmod(UNIT, 0o644)
        run(['systemctl', 'daemon-reload'])
        after = snapshot()
        require(after == baseline, 'PREEXISTING_STATE_CHANGED_DURING_PREPARE')
        journal.update({'phase': 'PREPARED_NOT_STARTED', 'prepare_result': prepared, 'after_prepare': after, 'unit_sha256': hashlib.sha256(UNIT.read_bytes()).hexdigest(), 'existing_state_unchanged': True})
        record(journal)
        print(json.dumps(journal, indent=2))
    except Exception as exc:
        journal.update({'phase': 'PREPARE_FAILED', 'error': type(exc).__name__ + ': ' + str(exc)})
        record(journal)
        raise

def start():
    journal = own_journal()
    require(journal['phase'] == 'PREPARED_NOT_STARTED', 'NOT_READY_OR_START_ALREADY_ATTEMPTED')
    require(hashlib.sha256(UNIT.read_bytes()).hexdigest() == journal['unit_sha256'], 'UNIT_CHANGED')
    require(snapshot() == journal['after_prepare'], 'PREEXISTING_STATE_CHANGED_BEFORE_START')
    journal['phase'] = 'START_INTENT_RECORDED'
    record(journal)
    try:
        run(['systemctl', 'enable', '--now', 'tmar-vps-access.service'])
        active = run(['systemctl', 'is-active', 'tmar-vps-access.service'], check=False)
        require(active.returncode == 0 and active.stdout.strip() == 'active', 'SERVICE_NOT_ACTIVE_AFTER_START')
        after = snapshot()
        require(after == journal['after_prepare'], 'PREEXISTING_STATE_CHANGED_AFTER_START')
        journal.update({'phase': 'STARTED_AWAITING_PAIRING', 'after_start': after, 'independent_connection_verified': False})
        record(journal)
    except Exception as exc:
        stopped = run(['systemctl', 'disable', '--now', 'tmar-vps-access.service'], check=False)
        journal.update({'phase': 'START_FAILED', 'error': type(exc).__name__ + ': ' + str(exc), 'own_service_stop_exit': stopped.returncode})
        record(journal)
        raise
    print(json.dumps({'phase': journal['phase'], 'existing_state_unchanged': True, 'independent_connection_verified': False}))

def status():
    journal = own_journal()
    out = {'journal': journal, 'service': run(['systemctl', 'show', 'tmar-vps-access.service', '-p', 'LoadState', '-p', 'ActiveState', '-p', 'SubState', '-p', 'MainPID', '-p', 'User', '-p', 'DynamicUser', '-p', 'NRestarts'], check=False).stdout}
    result = STATE / 'prepare-result.json'
    if result.exists():
        out['prepare_result'] = json.loads(result.read_text())
    print(json.dumps(out, indent=2))

def pairing_info():
    journal = own_journal()
    require(journal['phase'] in {'STARTED_AWAITING_PAIRING', 'START_INTENT_RECORDED'}, 'SERVICE_NOT_STARTED')
    raw = run(['journalctl', '--unit=tmar-vps-access.service', '--no-pager', '--output=cat', '--lines=90']).stdout
    # Only human verification instructions. Never read the session file.
    lines = [line for line in raw.splitlines() if any(key in line.lower() for key in ('verify', 'verification', 'pairing', 'device code', 'user code', 'waiting for', 'connected', 'device ready', 'error', 'authenticat', 'https://mcp.desktopcommander.app', 'https://desktopcommander.app'))]
    print(json.dumps({'phase': journal['phase'], 'instructions': lines[-20:]}, indent=2))

def rollback_stop():
    journal = own_journal()
    attempt = run(['systemctl', 'disable', '--now', 'tmar-vps-access.service'], check=False)
    observed = run(['systemctl', 'show', 'tmar-vps-access.service', '-p', 'LoadState', '-p', 'ActiveState', '-p', 'MainPID', '-p', 'UnitFileState'], check=False)
    props = dict(line.split('=', 1) for line in observed.stdout.splitlines() if '=' in line)
    verified = observed.returncode == 0 and props.get('MainPID') == '0' and props.get('ActiveState') in {'inactive', 'failed'} and props.get('UnitFileState') in {'disabled', ''}
    journal.update({'phase': 'STOPPED_STATE_PRESERVED' if verified else 'ROLLBACK_STOP_NOT_VERIFIED', 'rollback_exit': attempt.returncode, 'rollback_observation': props})
    record(journal)
    print(json.dumps({'phase': journal['phase'], 'stop_verified': verified, 'server_side_revoke': 'Not performed. If paired, revoke only this device in the dashboard.'}))
    require(verified, 'ROLLBACK_STOP_NOT_VERIFIED')

require(os.getuid() == 0, 'ROOT_BOOTSTRAP_REQUIRED')
require(len(sys.argv) == 2 and sys.argv[1] in {'prepare', 'start', 'status', 'pairing-info', 'rollback-stop'}, 'INVALID_ACTION')
if sys.argv[1] in {'prepare', 'start', 'rollback-stop'}:
    lock_handle = open('/run/tmar-vps-access-setup.lock', 'a')
    fcntl.flock(lock_handle, fcntl.LOCK_EX | fcntl.LOCK_NB)
{'prepare': prepare, 'start': start, 'status': status, 'pairing-info': pairing_info, 'rollback-stop': rollback_stop}[sys.argv[1]]()
