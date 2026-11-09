#!/usr/bin/env python3
"""Explicit one-file atomic replacement. Use only after the infrastructure approval.

TARGET SOURCE EXPECTED_CURRENT_SHA EXPECTED_SOURCE_SHA
The helper never starts, reloads or stops a service. Reverse the two hashes and
use the baseline source for rollback. No overwrite occurs on a hash conflict.
"""
from pathlib import Path
import hashlib
import json
import os
import stat
import sys
import tempfile


def sha(data):
    return hashlib.sha256(data).hexdigest()


def main():
    if len(sys.argv) != 5:
        raise SystemExit("Usage: replace_if_hash.py TARGET SOURCE EXPECTED_CURRENT_SHA EXPECTED_SOURCE_SHA")
    target, source = Path(sys.argv[1]), Path(sys.argv[2])
    old_sha, new_sha = sys.argv[3:5]
    if not target.is_absolute() or not source.is_absolute():
        raise SystemExit("Absolute paths required")
    # Resolve an existing deployment's version symlink without replacing it.
    resolved = target.resolve(strict=True)
    original = resolved.read_bytes()
    replacement = source.read_bytes()
    if sha(original) != old_sha or sha(replacement) != new_sha:
        raise SystemExit("HASH_CONFLICT: no write performed")
    metadata = resolved.stat()
    fd, temporary = tempfile.mkstemp(prefix=".gis-approved-replace-", dir=resolved.parent)
    try:
        with os.fdopen(fd, "wb") as stream:
            stream.write(replacement)
            stream.flush()
            os.fsync(stream.fileno())
            os.fchmod(stream.fileno(), stat.S_IMODE(metadata.st_mode))
            os.fchown(stream.fileno(), metadata.st_uid, metadata.st_gid)
        if target.resolve(strict=True) != resolved or sha(resolved.read_bytes()) != old_sha:
            raise RuntimeError("CONCURRENT_CHANGE: no replacement performed")
        os.replace(temporary, resolved)
        directory = os.open(resolved.parent, os.O_RDONLY)
        try:
            os.fsync(directory)
        finally:
            os.close(directory)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)
    if sha(resolved.read_bytes()) != new_sha:
        raise RuntimeError("POSTWRITE_HASH_MISMATCH")
    print(json.dumps({"target": str(target), "resolved_target": str(resolved),
                      "before_sha256": old_sha, "after_sha256": new_sha}))


if __name__ == "__main__":
    main()
