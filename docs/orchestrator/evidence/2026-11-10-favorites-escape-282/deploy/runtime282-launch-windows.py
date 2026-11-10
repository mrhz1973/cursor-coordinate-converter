"""Prepared launcher for DESKTOP-DPIJL64. Do not execute before the parent's GO.

Each invocation opens at most one SSH connection. An uncertain remote outcome
is never retried automatically; read the existing transaction journal instead.
"""
from pathlib import Path
import argparse
import datetime
import hashlib
import json
import os
import re
import shlex
import subprocess
import sys

SSH = Path(r'C:\WINDOWS\System32\OpenSSH\ssh.exe')
IDENTITY = Path(r'C:\Users\Utente\.ssh\id_ed25519')
ALIAS = 'root@31.70.139.73'
SOURCE = '6b906869b77a2b3c91c8848012894ffff85399e3'
RUNTIME = Path(__file__).resolve().parent / 'runtime-282.html'
RUNTIME_SHA = '71267f1a9d95488adf527db40333c811c2beeef0c9051e98ee5673debb5a7399'
REMOTE_SCRIPT_SHA256 = 'e633af45cd26fd65e0dc81dd41b81cbb462f58d40d6c5ee3f7c703a55c0be44d'
SSH_OPTIONS = [
    '-T', '-i', str(IDENTITY), '-o', 'HostName=31.70.139.73', '-o', 'User=root', '-o', 'Port=22',
    '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=yes',
    '-o', 'UpdateHostKeys=no', '-o', 'IdentitiesOnly=yes',
    '-o', 'ForwardAgent=no', '-o', 'ClearAllForwardings=yes',
    '-o', 'PermitLocalCommand=no', '-o', 'ControlMaster=no',
    '-o', 'ControlPath=none', '-o', 'ConnectTimeout=10',
    '-o', 'ConnectionAttempts=1', '-o', 'ServerAliveInterval=15',
    '-o', 'ServerAliveCountMax=2',
]


def require(condition, message):
    if not condition:
        raise RuntimeError(message)


def sha(contents):
    return hashlib.sha256(contents).hexdigest()


def now():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def write_new(path, value):
    with path.open('x', encoding='utf-8', newline='\n') as stream:
        json.dump(value, stream, indent=2)
        stream.write('\n')
        stream.flush()
        os.fsync(stream.fileno())


def local_ssh_config():
    # -G reads existing local configuration and does not connect.
    process = subprocess.run([str(SSH), '-G', *SSH_OPTIONS, ALIAS],
                             capture_output=True, timeout=15)
    require(process.returncode == 0, 'SSH_CONFIG_PARSE_FAILED')
    selected = {}
    for line in process.stdout.decode('utf-8', errors='replace').splitlines():
        fields = line.split(' ', 1)
        if len(fields) == 2 and fields[0] in (
                'hostname', 'user', 'port', 'identitiesonly', 'identityfile'):
            selected.setdefault(fields[0], []).append(fields[1])
    for key, value in {'hostname': '31.70.139.73', 'user': 'root',
                       'port': '22', 'identitiesonly': 'yes'}.items():
        require(selected.get(key) == [value], 'SSH_EFFECTIVE_DESTINATION_CHANGED')
    identities = selected.get('identityfile', [])
    require(len(identities) == 1
            and Path(os.path.expanduser(identities[0])).resolve() == IDENTITY.resolve(),
            'SSH_IDENTITY_CHANGED')
    return selected


def result_summary(result, evidence, phase):
    # Full stdout and remote journal remain in the evidence files.
    fields = (
        'status', 'backup_directory', 'runtime_source_commit', 'expected_remote_head',
        'target_blob', 'target_sha256', 'target_bytes', 'target_build',
        'old_sha256', 'old_bytes', 'old_build', 'before_head',
        'candidate', 'runtime_before', 'runtime_after', 'rollback_runtime',
        'final_head', 'final_branch', 'final_status', 'rollback_head',
        'rollback_branch', 'completed_at_utc', 'checked_at_utc',
        'preflight_error', 'deploy_error', 'rollback_error', 'provider_post_requests',
    )
    summary = {key: result[key] for key in fields if key in result}
    summary.update({'phase': phase, 'evidence_directory': str(evidence),
                    'event_count': len(result.get('events', []))})
    shared = result.get('shared_after')
    if isinstance(shared, dict):
        summary['infra_hashes_preserved'] = (
            shared.get('config_hashes') == result.get('config_hashes_before'))
        summary['shared_listeners_preserved'] = (
            shared.get('listeners') == result.get('shared_listeners_before'))
        summary['shared_endpoints_preserved'] = (
            shared.get('http') == result.get('shared_http_before'))
        summary['services_before'] = result.get('services_before')
        summary['services_after'] = shared.get('services')
    return summary


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--phase', choices=('preflight', 'apply', 'status'), required=True)
    parser.add_argument('--go-remote-head', help='Exact full commit supplied by the parent GO')
    parser.add_argument('--backup-directory')
    options = parser.parse_args()
    require(os.name == 'nt' and os.environ.get('COMPUTERNAME', '').upper() == 'DESKTOP-DPIJL64',
            'AUTHORIZED_WINDOWS_MACHINE_REQUIRED')
    require(SSH.is_file() and IDENTITY.is_file(), 'EXISTING_SSH_IDENTITY_UNAVAILABLE')
    require(re.fullmatch(r'[0-9a-f]{40}', SOURCE) is not None
            and re.fullmatch(r'[0-9a-f]{64}', REMOTE_SCRIPT_SHA256) is not None,
            'FROZEN_DEPLOYMENT_PACKET_REQUIRED')
    if options.phase != 'status':
        require(options.go_remote_head is not None
                and re.fullmatch(r'[0-9a-f]{40}', options.go_remote_head) is not None,
                'EXPLICIT_PARENT_GO_REMOTE_HEAD_REQUIRED')
    if options.go_remote_head is not None:
        require(re.fullmatch(r'[0-9a-f]{40}', options.go_remote_head) is not None,
                'INVALID_GO_REMOTE_HEAD')
    stamp = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
    if options.phase == 'preflight' and options.backup_directory is None:
        options.backup_directory = '/var/backups/goi-gis-runtime/' + stamp + '-build282'
    require(options.backup_directory is not None and re.fullmatch(
        r'/var/backups/goi-gis-runtime/\d{8}T\d{12}Z-build282',
        options.backup_directory) is not None, 'INVALID_BACKUP_DIRECTORY')
    packet = Path(__file__).resolve().parent
    script = (packet / 'runtime282-remote.py').read_bytes()
    require(sha(script) == REMOTE_SCRIPT_SHA256, 'REMOTE_SCRIPT_HASH_MISMATCH')
    if options.phase != 'status':
        contents = RUNTIME.read_bytes()
        require(len(contents) == 11108980 and sha(contents) == RUNTIME_SHA,
                'WINDOWS_CANDIDATE_CHANGED')
    effective = local_ssh_config()
    remote_args = ['python3', '-B', '-', '--phase', options.phase]
    if options.go_remote_head:
        remote_args += ['--go-remote-head', options.go_remote_head]
    if options.backup_directory:
        remote_args += ['--backup-directory', options.backup_directory]
    remote_command = ' '.join(shlex.quote(item) for item in remote_args)
    evidence = packet / ('execution-' + stamp + '-' + options.phase)
    evidence.mkdir(exist_ok=False)
    intent = {
        'status': 'SSH_INVOCATION_INTENT', 'at_utc': now(), 'phase': options.phase,
        'runtime_source_commit': SOURCE, 'expected_remote_head': options.go_remote_head,
        'backup_directory': options.backup_directory,
        'remote_script_sha256': REMOTE_SCRIPT_SHA256,
        'machine': os.environ['COMPUTERNAME'], 'ssh_effective': effective,
        'remote_command': remote_command,
        'warning': 'One SSH attempt only. If outcome is uncertain, do not rerun apply.',
    }
    write_new(evidence / 'intent.json', intent)
    process = subprocess.Popen([str(SSH), *SSH_OPTIONS, ALIAS, remote_command],
                               stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                               stderr=subprocess.PIPE)
    print(json.dumps({'status': 'SSH_STARTED', 'phase': options.phase,
                      'ssh_pid': process.pid, 'evidence_directory': str(evidence)}),
          flush=True)
    uncertain = False
    try:
        stdout, stderr = process.communicate(input=script,
                                             timeout=60 if options.phase == 'status' else 600)
    except subprocess.TimeoutExpired:
        # Killing the local SSH transport says nothing about remote completion.
        process.kill()
        stdout, stderr = process.communicate()
        uncertain = True
    record = {
        'finished_at_utc': now(), 'ssh_returncode': process.returncode,
        'transport_timeout': uncertain,
        'stdout': stdout.decode('utf-8', errors='replace'),
        'stderr': stderr.decode('utf-8', errors='replace'),
    }
    write_new(evidence / 'process.json', record)
    try:
        result = json.loads(record['stdout'])
        require(isinstance(result, dict), 'REMOTE_RESULT_NOT_OBJECT')
    except (ValueError, RuntimeError):
        result = None
    if result is not None:
        write_new(evidence / 'remote-result.json', result)
        print(json.dumps(result_summary(result, evidence, options.phase)), flush=True)
    if uncertain or process.returncode == 255 or result is None:
        print(json.dumps({
            'status': 'REMOTE_OUTCOME_UNKNOWN_DO_NOT_RETRY',
            'phase': options.phase, 'backup_directory': options.backup_directory,
            'evidence_directory': str(evidence),
            'next': 'Read the existing VPS journal; do not start another apply.'}), flush=True)
        return 125
    return process.returncode


if __name__ == '__main__':
    try:
        sys.exit(main())
    except Exception as error:
        print(json.dumps({'status': 'LOCAL_REFUSAL_OR_LAUNCH_FAILURE',
                          'error': type(error).__name__ + ': ' + str(error)}), flush=True)
        sys.exit(1)
