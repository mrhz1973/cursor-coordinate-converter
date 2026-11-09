import datetime
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys

BASE = Path(r'D:\ChatGPT\TMAR-GIS\work\vps-direct-20261109')
SSH = Path(r'C:\WINDOWS\System32\OpenSSH\ssh.exe')
KEY = Path(r'C:\Users\mrhz\.ssh\ionos_n8n_vps')
ACTIONS = {'prepare', 'start', 'status', 'pairing-info', 'rollback-stop'}

def require(value, reason):
    if not value:
        raise RuntimeError(reason)

require(len(sys.argv) == 3 and sys.argv[1] in ACTIONS, 'INVALID_ARGUMENTS')
action, expected_sha = sys.argv[1:]
require(os.name == 'nt' and os.environ.get('COMPUTERNAME', '').upper() == 'ASUSDESKTOP', 'WRONG_BOOTSTRAP_HOST')
require(SSH.is_file() and KEY.is_file(), 'EXISTING_SSH_PREREQUISITE_MISSING')
payload = (BASE / 'package.json').read_bytes()
require(hashlib.sha256(payload).hexdigest() == expected_sha, 'TRANSFER_HASH_FAILED')
obj = json.loads(payload)
require(hashlib.sha256(obj['installer'].encode()).hexdigest() == obj['installer_sha256'], 'INSTALLER_HASH_FAILED')
for name, value in obj['pack']['files'].items():
    require(hashlib.sha256(value['content'].encode()).hexdigest() == value['sha256'], 'FILE_HASH_FAILED:' + name)
source = 'PACK = ' + repr(obj['pack']) + '\n' + obj['installer']
stamp = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
record = {'at_utc': stamp, 'action': action, 'package_sha256': expected_sha, 'status': 'INTENT'}
intent = BASE / (stamp + '-' + action + '-intent.json')
with intent.open('x') as handle:
    json.dump(record, handle, indent=2)
args = [str(SSH), '-T', '-i', str(KEY), '-o', 'IdentitiesOnly=yes', '-o', 'HostName=31.70.139.73', '-o', 'User=root', '-o', 'Port=22', '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=yes', '-o', 'UpdateHostKeys=no', '-o', 'ForwardAgent=no', '-o', 'ClearAllForwardings=yes', '-o', 'PermitLocalCommand=no', '-o', 'ControlMaster=no', '-o', 'ControlPath=none', '-o', 'ConnectTimeout=10', '-o', 'ConnectionAttempts=1', 'ionos-n8n-new', 'python3 - ' + action]
try:
    proc = subprocess.run(args, input=source, capture_output=True, text=True, timeout=900 if action == 'prepare' else 90)
    record.update({'status': 'COMPLETED' if proc.returncode == 0 else 'FAILED', 'ssh_exit': proc.returncode})
    if action != 'pairing-info':
        record.update({'stdout': proc.stdout, 'stderr': proc.stderr})
    print(proc.stdout)
    print(proc.stderr)
    print('SSH_EXIT', proc.returncode)
except subprocess.TimeoutExpired:
    record['status'] = 'TIMEOUT_UNCERTAIN_CHECK_STATUS_BEFORE_RETRY'
    print(json.dumps(record))
finally:
    with (BASE / (stamp + '-' + action + '-result.json')).open('x') as handle:
        json.dump(record, handle, indent=2)
sys.exit(0 if record['status'] == 'COMPLETED' else 1)
