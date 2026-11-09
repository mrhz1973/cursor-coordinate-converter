"""Prepared launcher for ASUSDESKTOP. Do not execute before the parent's GO.

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
IDENTITY = Path(r'C:\Users\mrhz\.ssh\ionos_n8n_vps')
ALIAS = 'ionos-n8n-new'
SOURCE = '0c0f6785654dbba279774bb8569788088f0762e9'
RUNTIME = Path(r'D:\ChatGPT\TMAR-GIS\work\gpt-audit-20261109-1a2a0a10\runtime-281-e8bd8c1d.html')
RUNTIME_SHA = 'e8bd8c1d354919064cfd09033f97fe294f366d34c12f1e92dc1d5a3bcd38ca62'
REMOTE_SCRIPT_SHA256 = 'a6f7215d7761bd7f725236605f4ede024d6b1807d85b80fbe379bc2a3920fbea'
SSH_OPTIONS = [
    '-T', '-o', 'HostName=31.70.139.73', '-o', 'User=root', '-o', 'Port=22',
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


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--phase', choices=('preflight', 'apply', 'status'), required=True)
    parser.add_argument('--go-remote-head', help='Exact full commit supplied by the parent GO')
    parser.add_argument('--backup-directory')
    options = parser.parse_args()
    require(os.name == 'nt' and os.environ.get('COMPUTERNAME', '').upper() == 'ASUSDESKTOP',
            'AUTHORIZED_WINDOWS_MACHINE_REQUIRED')
    require(SSH.is_file() and IDENTITY.is_file(), 'EXISTING_SSH_IDENTITY_UNAVAILABLE')
    if options.phase != 'status':
        require(options.go_remote_head is not None
                and re.fullmatch(r'[0-9a-f]{40}', options.go_remote_head) is not None,
                'EXPLICIT_PARENT_GO_REMOTE_HEAD_REQUIRED')
    if options.go_remote_head is not None:
        require(re.fullmatch(r'[0-9a-f]{40}', options.go_remote_head) is not None,
                'INVALID_GO_REMOTE_HEAD')
    stamp = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
    if options.phase == 'preflight' and options.backup_directory is None:
        options.backup_directory = '/var/backups/goi-gis-runtime/' + stamp + '-build281'
    require(options.backup_directory is not None and re.fullmatch(
        r'/var/backups/goi-gis-runtime/\d{8}T\d{12}Z-build281',
        options.backup_directory) is not None, 'INVALID_BACKUP_DIRECTORY')
    packet = Path(__file__).resolve().parent
    script = (packet / 'runtime281-remote.py').read_bytes()
    require(sha(script) == REMOTE_SCRIPT_SHA256, 'REMOTE_SCRIPT_HASH_MISMATCH')
    if options.phase != 'status':
        contents = RUNTIME.read_bytes()
        require(len(contents) == 11108861 and sha(contents) == RUNTIME_SHA,
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
        print(json.dumps(result), flush=True)
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
