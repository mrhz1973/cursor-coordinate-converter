from pathlib import Path
import base64, hashlib, json, zipfile, io, subprocess, datetime

root = Path(__file__).resolve().parent
expected_archive = "13368d19d5daa1044c6edefe5c48cfba7b7b91918cc8544c17bed1b864e3dca0"
encoded = "".join((root / "playwright-1.62.1-offline.zip.b64").read_text(encoding="utf-8").split())
archive = base64.b64decode(encoded, validate=True)
assert hashlib.sha256(archive).hexdigest() == expected_archive, "archive hash mismatch"
manifest = json.loads((root / "dependencies-manifest.json").read_text(encoding="utf-8"))
assert manifest["archive"]["sha256"] == expected_archive
expected = {f["path"]: f for f in manifest["files"]}
assert len(expected) == 173
with zipfile.ZipFile(io.BytesIO(archive)) as bundle:
    assert set(bundle.namelist()) == set(expected), "unexpected archive entries"
    for name in bundle.namelist():
        assert name.startswith(("node_modules/playwright/", "node_modules/playwright-core/"))
        assert ".." not in Path(name).parts and ":" not in name
        data = bundle.read(name)
        assert hashlib.sha256(data).hexdigest() == expected[name]["sha256"], name
        target = root / name
        if target.exists():
            assert target.read_bytes() == data, "existing different test dependency: " + name
        else:
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)
for name, record in expected.items():
    assert hashlib.sha256((root / name).read_bytes()).hexdigest() == record["sha256"], name
js = "const fs=require('fs');const p=require('playwright');console.log(JSON.stringify({node:process.version,playwright:require('playwright/package.json').version,core:require('playwright-core/package.json').version,module:require.resolve('playwright'),edgePresent:fs.existsSync('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe')}));"
probe = subprocess.run(["node", "-e", js], cwd=str(root), text=True, capture_output=True, encoding="utf-8", check=True)
loaded = json.loads(probe.stdout)
assert loaded["playwright"] == loaded["core"] == "1.62.1"
assert loaded["edgePresent"]
report = {"verifiedAtUtc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
          "archiveSha256": expected_archive, "archiveBytes": len(archive), "verifiedFiles": len(expected),
          "packageProbe": loaded, "npmUsed": False, "downloaded": False,
          "browserLaunched": False, "location": str(root / "node_modules")}
(root / "dependency-verification.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
print(json.dumps(report))
