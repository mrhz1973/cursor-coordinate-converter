#!/usr/bin/env python3
"""Static checks for install_secret.py — no network, no secret."""
from __future__ import annotations

import ast
import importlib.util
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "install_secret.py"
DROPIN = ROOT / "goi-ors-gateway.service.d" / "credential.conf"
LOADCRED = "LoadCredential=ORS_API_KEY:/etc/systemd/ors-credentials/ORS_API_KEY"


class InstallerFixTests(unittest.TestCase):
    def test_syntax(self):
        ast.parse(SRC.read_text(encoding="utf-8"))

    def test_dropin_canonical(self):
        txt = DROPIN.read_text(encoding="utf-8")
        self.assertIn(LOADCRED, txt)
        self.assertNotIn("LoadCredential=ORS_API_KEY:?", txt)

    def test_no_multiline_python_c(self):
        txt = SRC.read_text(encoding="utf-8")
        self.assertNotIn('python3", "-c"', txt.replace(" ", ""))
        spec = importlib.util.spec_from_file_location("install_secret", SRC)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        self.assertNotIn("python3 -c", mod.SSH_REMOTE)
        argv = mod.ssh_argv()
        self.assertEqual(argv[0], "ssh")
        self.assertFalse(argv[-1].lstrip().startswith("python3"))
        joined = " ".join(argv)
        self.assertNotIn("python3 -c", joined)
        self.assertNotIn("ORS_API_KEY=", joined)

    def test_remote_installs_loadcredential_and_restarts(self):
        spec = importlib.util.spec_from_file_location("install_secret", SRC)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        remote = mod.SSH_REMOTE
        self.assertIn(LOADCRED, remote)
        self.assertIn("daemon-reload", remote)
        self.assertIn("restart goi-ors-gateway.service", remote)
        self.assertIn('phase=restart', remote)
        self.assertIn('phase=inactive', remote)
        self.assertIn('phase=status-not-present', remote)
        self.assertIn("SECRET_PRESENT_OK", remote)
        self.assertNotIn("sha256", remote.lower())
        self.assertNotIn("md5", remote.lower())


if __name__ == "__main__":
    unittest.main()
