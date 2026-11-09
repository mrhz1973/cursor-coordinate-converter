"""Create a bounded, hash-guarded transport patch for the isolated browser copy."""
from pathlib import Path
import base64
import difflib
import hashlib
import json
import sys

old_path, new_path, output_path = map(Path, sys.argv[1:4])
old, new = old_path.read_bytes(), new_path.read_bytes()
sha = lambda data: hashlib.sha256(data).hexdigest()
assert sha(old) == '70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde'
old_lines, new_lines = old.splitlines(keepends=True), new.splitlines(keepends=True)
offsets = [0]
for line in old_lines:
    offsets.append(offsets[-1] + len(line))
operations = []
for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, old_lines, new_lines).get_opcodes():
    if tag == 'equal':
        continue
    removed = b''.join(old_lines[i1:i2])
    inserted = b''.join(new_lines[j1:j2])
    operations.append({'offset': offsets[i1], 'remove_bytes': len(removed),
                       'remove_sha256': sha(removed),
                       'insert_base64': base64.b64encode(inserted).decode('ascii')})
assert 0 < len(operations) <= 24
assert sum(x['remove_bytes'] + len(base64.b64decode(x['insert_base64'])) for x in operations) < 65536
check = old
for op in reversed(operations):
    pos, length = op['offset'], op['remove_bytes']
    assert sha(check[pos:pos + length]) == op['remove_sha256']
    check = check[:pos] + base64.b64decode(op['insert_base64']) + check[pos + length:]
assert check == new
result = {'purpose': 'isolated_browser_candidate_transport_only',
          'base_sha256': sha(old), 'base_bytes': len(old),
          'candidate_sha256': sha(new), 'candidate_bytes': len(new),
          'operations': operations}
output_path.write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps({k: v for k, v in result.items() if k != 'operations'}))
print(json.dumps({'operations': len(operations), 'patch_bytes': output_path.stat().st_size,
                  'patch_sha256': sha(output_path.read_bytes())}))
