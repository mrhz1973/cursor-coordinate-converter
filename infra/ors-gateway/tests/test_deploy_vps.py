#!/usr/bin/env python3
"""Static checks for deploy_vps.py PRESENT/ABSENT idempotence — no network, no secret."""
from __future__ import annotations

import ast
import importlib.util
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "deploy_vps.py"
DROPIN = ROOT / "goi-ors-gateway.service.d" / "credential.conf"
LOADCRED = "LoadCredential=ORS_API_KEY:/etc/systemd/ors-credentials/ORS_API_KEY"
UNIT = ROOT / "goi-ors-gateway.service"


class DeployIdempotenceTests(unittest.TestCase):
    def test_syntax(self):
        ast.parse(SRC.read_text(encoding="utf-8"))

    def test_unit_does_not_inline_loadcredential(self):
        txt = UNIT.read_text(encoding="utf-8")
        self.assertNotIn(LOADCRED, txt)
        self.assertIn("goi-ors-gateway.service.d/credential.conf", txt)

    def test_dropin_is_required_mode(self):
        txt = DROPIN.read_text(encoding="utf-8")
        self.assertIn(LOADCRED, txt)
        self.assertNotIn("LoadCredential=ORS_API_KEY:?", txt)

    def test_present_absent_branches(self):
        spec = importlib.util.spec_from_file_location("deploy_vps", SRC)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        remote = mod.REMOTE
        self.assertIn("SECRET_STATE=PRESENT", remote)
        self.assertIn("SECRET_STATE=ABSENT", remote)
        self.assertIn("SKIP FAIL-CLOSED 503", remote)
        self.assertIn("NO_UPSTREAM_PROBE_ON_DEPLOY", remote)
        self.assertIn("secret_not_configured", remote)
        self.assertIn("CREDENTIAL_WIRING_OK", remote)
        self.assertIn("credential.conf", remote)
        self.assertIn(str(DROPIN), str(mod.DROPIN_SRC))
        files_blob = SRC.read_text(encoding="utf-8")
        self.assertIn("credential.conf", files_blob)
        self.assertNotIn("ORS_API_KEY=", remote)


if __name__ == "__main__":
    unittest.main()
