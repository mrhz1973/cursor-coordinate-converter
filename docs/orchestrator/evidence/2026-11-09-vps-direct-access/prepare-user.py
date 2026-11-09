import datetime
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys

BASE = Path('/var/lib/tmar-vps-access')
CACHE = Path('/var/cache/tmar-vps-access')
APP = BASE / 'app'
SRI = 'sha512-cx7KTscLF951adHmDLVCDIVTqJ/Bg1LtdRILZoo5wa/UMeyOfMAuOJOEBulNMKBKb5Xd3nHDQnB9aXroN9Fw5A=='
RESULT = {'at_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'uid': os.getuid(), 'status': 'PREPARING'}

def require(value, message):
    if not value:
        raise RuntimeError(message)

def run(name, args, timeout=600):
    proc = subprocess.run(args, cwd=APP, capture_output=True, text=True, timeout=timeout)
    (BASE / (name + '.stdout.log')).write_text(proc.stdout)
    (BASE / (name + '.stderr.log')).write_text(proc.stderr)
    require(proc.returncode == 0, name + '_FAILED_exit_' + str(proc.returncode))
    return proc.stdout

try:
    require(os.getuid() != 0, 'REFUSE_ROOT_PACKAGE_EXECUTION')
    require(Path.home() == BASE, 'PERSISTENT_HOME_MISMATCH')
    require(not APP.exists(), 'APP_ALREADY_EXISTS_STOP_RECONCILE')
    require(not (BASE / '.desktop-commander-device/device.json').exists(), 'EXISTING_SESSION_STOP')
    APP.mkdir(mode=0o700)
    (BASE / 'workspace').mkdir(mode=0o700)
    config_dir = BASE / '.claude-server-commander'
    config_dir.mkdir(mode=0o700)
    config = {'defaultShell': '/bin/bash', 'allowedDirectories': [str(BASE / 'workspace')], 'telemetryEnabled': False, 'fileReadLineLimit': 300, 'fileWriteLineLimit': 50, 'pendingWelcomeOnboarding': False, 'welcomeOnboardingEligible': False}
    (config_dir / 'config.json').write_text(json.dumps(config, indent=2) + '\n')
    os.chmod(config_dir / 'config.json', 0o600)
    (APP / 'package.json').write_text(json.dumps({'name': 'tmar-vps-access', 'version': '1.0.0', 'private': True, 'dependencies': {'@wonderwhy-er/desktop-commander': '0.3.1'}}, indent=2) + '\n')
    env = os.environ.copy()
    env['PUPPETEER_SKIP_DOWNLOAD'] = 'true'
    env['npm_config_cache'] = str(CACHE)
    os.environ.update(env)
    run('npm-install', ['/usr/bin/npm', 'install', '--ignore-scripts', '--omit=dev', '--no-audit', '--no-fund', '--registry=https://registry.npmjs.org', '--strict-ssl=true'])
    lock = json.loads((APP / 'package-lock.json').read_text())
    pkg_path = APP / 'node_modules/@wonderwhy-er/desktop-commander'
    package = json.loads((pkg_path / 'package.json').read_text())
    require(package['name'] == '@wonderwhy-er/desktop-commander' and package['version'] == '0.3.1', 'PACKAGE_IDENTITY_FAILED')
    require(lock['packages']['node_modules/@wonderwhy-er/desktop-commander']['integrity'] == SRI, 'PACKAGE_INTEGRITY_FAILED')
    run('npm-rebuild-ripgrep', ['/usr/bin/npm', 'rebuild', '@vscode/ripgrep', '--foreground-scripts', '--registry=https://registry.npmjs.org', '--strict-ssl=true'], timeout=180)
    probe = "const r=require('@vscode/ripgrep');const cp=require('child_process');const sharp=require('sharp');console.log(JSON.stringify({ripgrep:cp.execFileSync(r.rgPath,['--version'],{encoding:'utf8'}).split('\\n')[0],sharp:sharp.versions.sharp,node:process.version}));"
    RESULT['dependency_probe'] = json.loads(run('dependency-probe', ['/usr/bin/node', '-e', probe], timeout=20))
    help_text = run('remote-help', ['/usr/bin/node', str(pkg_path / 'dist/index.js'), 'remote', '--help'], timeout=30)
    require('--disable-no-sleep' in help_text and 'remote' in help_text.lower(), 'CLI_HELP_MISMATCH')
    RESULT.update({'status': 'PREPARE_PASS', 'package_version': package['version'], 'package_sri': SRI, 'engines': package['engines'], 'lock_sha256': hashlib.sha256((APP / 'package-lock.json').read_bytes()).hexdigest(), 'dependency_entries': len(lock['packages']), 'workspace': str(BASE / 'workspace'), 'help_verified': True})
except Exception as exc:
    RESULT.update({'status': 'PREPARE_FAILED', 'error': type(exc).__name__ + ': ' + str(exc)})
finally:
    (BASE / 'prepare-result.json').write_text(json.dumps(RESULT, indent=2) + '\n')
    print(json.dumps(RESULT, indent=2))
sys.exit(0 if RESULT['status'] == 'PREPARE_PASS' else 1)
