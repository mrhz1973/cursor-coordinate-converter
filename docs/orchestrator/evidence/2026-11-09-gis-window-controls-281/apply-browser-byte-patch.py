"""Materialize a new candidate file without modifying the baseline or Git repository."""
from pathlib import Path
import base64
import hashlib
import json
import sys

baseline, patch_file, candidate = map(Path, sys.argv[1:4])
assert baseline.resolve() != candidate.resolve()
assert not candidate.exists(), 'candidate path already exists; inspect before any retry'
patch = json.loads(patch_file.read_text(encoding='utf-8-sig'))
sha = lambda data: hashlib.sha256(data).hexdigest()
data = baseline.read_bytes()
assert len(data) == patch['base_bytes'] and sha(data) == patch['base_sha256']
previous_end = 0
for op in patch['operations']:
    assert previous_end <= op['offset'] <= len(data)
    assert op['offset'] + op['remove_bytes'] <= len(data)
    previous_end = op['offset'] + op['remove_bytes']
for op in reversed(patch['operations']):
    pos, length = op['offset'], op['remove_bytes']
    assert sha(data[pos:pos + length]) == op['remove_sha256']
    data = data[:pos] + base64.b64decode(op['insert_base64'], validate=True) + data[pos + length:]
assert len(data) == patch['candidate_bytes'] and sha(data) == patch['candidate_sha256']
with candidate.open('xb') as output:
    output.write(data)
assert sha(candidate.read_bytes()) == patch['candidate_sha256']
assert sha(baseline.read_bytes()) == patch['base_sha256']
print(json.dumps({'result': 'CANDIDATE_MATERIALIZED', 'path': str(candidate),
                  'sha256': sha(data), 'bytes': len(data), 'baseline_unchanged': True}))
