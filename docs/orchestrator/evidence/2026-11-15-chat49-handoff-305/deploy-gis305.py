import datetime, hashlib, json, pathlib, shutil, subprocess, time, urllib.request

repo = pathlib.Path('/root/local-files/handoff-runtime/cursor-coordinate-converter')
runtime = repo / 'coordinate_converter Claude.html'
source = '95080bac23a1642c1a2c6f8c0bdd4885b7bac960'
previous_source = '938b2b3c601ae61b6c71cf806ae67119537af8aa'
expected = '5ffa64ff3ba9746de9a5463cc4adfc058ceb7de77e095aacdd51259e39d72464'
previous = '6e31044dbd4eb2e331db93a4f25194f105e6cb60ff4c1a8d6311990cc04a6240'

def run(*args):
    result = subprocess.run(args, cwd=repo, capture_output=True, text=True, timeout=45)
    if result.returncode:
        raise RuntimeError(f'{args[0]} exit {result.returncode}: {result.stderr[-1200:]}')
    return result.stdout.strip()

def digest(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

assert run('git', 'status', '--porcelain') == '', 'VPS working tree is not clean'
assert run('git', 'branch', '--show-current') == 'main', 'VPS branch mismatch'
assert run('git', 'rev-parse', 'HEAD') == previous_source, 'Previous VPS HEAD changed'
assert digest(runtime) == previous, 'Previous runtime byte changed'
assert run('git', 'ls-remote', 'origin', 'refs/heads/main').split()[0] == source, 'Remote main changed'

stamp = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ')
backup = pathlib.Path('/var/backups/goi-gis-runtime') / (stamp + '-build305')
backup.mkdir(parents=True, exist_ok=False)
backup_file = backup / 'coordinate_converter-Claude.html'
shutil.copy2(runtime, backup_file)
assert digest(backup_file) == previous, 'Backup byte mismatch'
journal = {'source': source, 'previous_source': previous_source,
           'backup': str(backup), 'previous_sha256': previous, 'expected_sha256': expected,
           'before_pid': run('systemctl', 'show', '-p', 'MainPID', '--value', 'goi-gis-app.service'),
           'scope': 'GIS-only', 'status': 'PREPARED'}
logfile = backup / 'DEPLOY-RESULT.json'
logfile.write_text(json.dumps(journal, indent=2) + '\n')
changed = False
try:
    changed = True
    journal['pull'] = run('git', 'pull', '--ff-only', 'origin', 'main')
    assert run('git', 'rev-parse', 'HEAD') == source, 'Pulled HEAD mismatch'
    assert digest(runtime) == expected, 'Candidate byte mismatch after pull'
    run('systemctl', 'restart', 'goi-gis-app.service')
    internal_url = 'http://100.99.54.93:8000/coordinate_converter%20Claude.html?v=' + expected[:8]
    last_error = None
    for attempt in range(10):
        try:
            with urllib.request.urlopen(internal_url, timeout=10) as response:
                body = response.read()
                smoke = {'status': response.status, 'bytes': len(body),
                         'sha256': hashlib.sha256(body).hexdigest()}
            assert smoke['status'] == 200 and smoke['sha256'] == expected
            assert b'const APP_BUILD_NUM = 305;' in body
            journal['internal_http'] = smoke
            journal['readiness_attempts'] = attempt + 1
            break
        except Exception as error:
            last_error = str(error)
            time.sleep(0.25)
    else:
        raise RuntimeError('HTTP smoke failed: ' + str(last_error))
    journal['service'] = run('systemctl', 'is-active', 'goi-gis-app.service')
    journal['after_pid'] = run('systemctl', 'show', '-p', 'MainPID', '--value', 'goi-gis-app.service')
    journal['file_bytes'] = runtime.stat().st_size
    journal['file_sha256'] = digest(runtime)
    journal['working_tree'] = run('git', 'status', '--porcelain')
    assert journal['service'] == 'active' and journal['working_tree'] == ''
    journal['status'] = 'DEPLOY_AND_INTERNAL_HTTP_PASS'
except Exception as error:
    journal['status'] = 'FAIL'
    journal['error'] = str(error)
    if changed:
        try:
            shutil.copy2(backup_file, runtime)
            journal['rollback_file_sha256'] = digest(runtime)
            assert journal['rollback_file_sha256'] == previous, 'Rollback file hash mismatch'
            run('systemctl', 'restart', 'goi-gis-app.service')
            rollback_url = 'http://100.99.54.93:8000/coordinate_converter%20Claude.html?v=' + previous[:8]
            rollback_error = None
            for attempt in range(10):
                try:
                    with urllib.request.urlopen(rollback_url, timeout=10) as response:
                        body = response.read()
                        restored = {'status': response.status, 'bytes': len(body),
                                    'sha256': hashlib.sha256(body).hexdigest()}
                    assert restored['status'] == 200 and restored['sha256'] == previous
                    assert b'const APP_BUILD_NUM = 304;' in body
                    assert run('systemctl', 'is-active', 'goi-gis-app.service') == 'active'
                    journal['rollback_http'] = restored
                    journal['rollback'] = 'PASS_HASH_HTTP_BUILD304; Git HEAD unchanged and working tree may require reconciliation'
                    break
                except Exception as restore_error:
                    rollback_error = str(restore_error)
                    time.sleep(0.25)
            else:
                raise RuntimeError('Rollback readiness failed: ' + str(rollback_error))
        except Exception as restore_error:
            journal['rollback'] = 'FAIL'
            journal['rollback_error'] = str(restore_error)
    raise
finally:
    journal['timestamp_utc'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    logfile.write_text(json.dumps(journal, indent=2) + '\n')
    print(json.dumps(journal))
