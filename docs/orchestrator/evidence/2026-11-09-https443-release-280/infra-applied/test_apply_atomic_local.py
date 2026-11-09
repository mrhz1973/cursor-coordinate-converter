from pathlib import Path
import ast
import datetime
import hashlib
import json
import os
import tempfile

source = Path(__file__).with_name("apply_authorized.py").read_text()
names = {"now", "sha", "sync_directory", "save", "same_inode", "install_new"}
tree = ast.parse(source)
selected = ast.Module(body=[n for n in tree.body if isinstance(n, ast.FunctionDef) and n.name in names], type_ignores=[])
results = []

for scenario in ("complete", "partial_write", "foreign_target", "completion_journal_failure"):
    with tempfile.TemporaryDirectory(prefix="gis-apply-local-") as temporary:
        root = Path(temporary)
        packet = root / "packet"
        packet.mkdir()
        payload = b"approved complete payload\n" * 30
        (packet / "file.py").write_bytes(payload)
        target = root / "installed.py"
        namespace = dict(Path=Path, os=os, tempfile=tempfile, datetime=datetime, hashlib=hashlib, json=json,
                         ROOT=root, PACKET=packet, STATE=root / "state.json", state={"installed": {}},
                         manifest={"files": {"file.py": {"sha256": hashlib.sha256(payload).hexdigest()}}})
        exec(compile(selected, "apply_selected_no_server_code", "exec"), namespace)
        original_fdopen = os.fdopen
        if scenario == "partial_write":
            class PartialWriter:
                def __init__(self, real): self.real = real
                def __enter__(self): return self
                def __exit__(self, *args): self.real.close()
                def write(self, data):
                    self.real.write(data[:17]); self.real.flush()
                    raise OSError("injected partial write")
            os.fdopen = lambda *a, **k: PartialWriter(original_fdopen(*a, **k))
        if scenario == "foreign_target":
            target.write_bytes(b"foreign file must survive")
        if scenario == "completion_journal_failure":
            real_save = namespace["save"]
            def failing_save(event=None, value=None):
                if event == "installed_file": raise OSError("injected completion journal failure")
                return real_save(event, value)
            namespace["save"] = failing_save
        error = None
        try:
            namespace["install_new"]("file.py", str(target))
        except OSError as caught:
            error = type(caught).__name__
        finally:
            os.fdopen = original_fdopen
        assert not list(root.glob(".gis-https443-new-*")), scenario
        if scenario == "complete":
            assert error is None and target.read_bytes() == payload and target.stat().st_mode & 0o777 == 0o644
        elif scenario == "partial_write":
            assert error == "OSError" and not target.exists()
        elif scenario == "foreign_target":
            assert error == "FileExistsError" and target.read_bytes() == b"foreign file must survive"
        else:
            journal = json.loads((root / "state.json").read_text())
            assert error == "OSError" and journal["installed"] == {}
            assert namespace["same_inode"](target, journal["install_prepared"]["file.py"])
            assert target.read_bytes() == payload
        results.append({"scenario": scenario, "status": "PASS"})

result = {"scope": "local temporary files only; selected actual helper functions; no service or network code executed",
          "helper_sha256": hashlib.sha256(source.encode()).hexdigest(), "tests": results, "passed": len(results), "failed": 0}
Path(__file__).with_name("atomic-install-local.json").write_text(json.dumps(result, indent=2) + "\n")
print(json.dumps(result))
