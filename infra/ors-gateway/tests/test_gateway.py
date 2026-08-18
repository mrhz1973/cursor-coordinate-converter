#!/usr/bin/env python3
"""Unit tests for ORS gateway sanitizer / fail-closed (no network)."""

from __future__ import annotations

import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("goi_ors_gateway", ROOT / "goi_ors_gateway.py")
mod = importlib.util.module_from_spec(SPEC)
assert SPEC and SPEC.loader
SPEC.loader.exec_module(mod)


class SanitizeTests(unittest.TestCase):
    def test_drops_unknown_keys(self):
        body = mod.sanitize_directions_body(
            {
                "coordinates": [[9.8, 44.1], [9.81, 44.11]],
                "elevation": True,
                "evil": "nope",
                "options": {"round_trip": {"length": 5000, "hack": 1}, "unknown": True},
            }
        )
        self.assertIsNotNone(body)
        self.assertNotIn("evil", body)
        self.assertEqual(body["options"]["round_trip"], {"length": 5000})
        self.assertNotIn("unknown", body["options"])

    def test_avoid_polygon_type_required(self):
        bad = mod.sanitize_directions_body(
            {
                "coordinates": [[9.8, 44.1], [9.81, 44.11]],
                "options": {"avoid_polygons": {"type": "Point", "coordinates": [1, 2]}},
            }
        )
        self.assertIsNone(bad)
        ok = mod.sanitize_directions_body(
            {
                "coordinates": [[9.8, 44.1], [9.81, 44.11]],
                "options": {
                    "avoid_polygons": {
                        "type": "Polygon",
                        "coordinates": [[[9.8, 44.1], [9.81, 44.1], [9.81, 44.11], [9.8, 44.1]]],
                    }
                },
            }
        )
        self.assertEqual(ok["options"]["avoid_polygons"]["type"], "Polygon")

    def test_alt_keys(self):
        body = mod.sanitize_directions_body(
            {
                "coordinates": [[9.8, 44.1], [9.81, 44.11]],
                "alternative_routes": {"target_count": 2, "extra": 9},
            }
        )
        self.assertEqual(body["alternative_routes"], {"target_count": 2})


class SecretTests(unittest.TestCase):
    def test_absent_empty_file(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "ORS_API_KEY"
            p.write_text("  \n", encoding="utf-8")
            old = mod.SECRET_FILE
            mod.SECRET_FILE = p
            try:
                st, val = mod.read_secret_status()
                self.assertEqual(st, "ABSENT")
                self.assertEqual(val, "")
            finally:
                mod.SECRET_FILE = old

    def test_status_has_no_secret_value(self):
        payload = json.dumps(mod.status_payload())
        self.assertIn('"secret": "ABSENT"', payload)
        self.assertIn("ORS_API_KEY", payload)
        self.assertNotRegex(payload, r"BEGIN [A-Z ]+PRIVATE KEY")


class PathTests(unittest.TestCase):
    def test_profile_whitelist(self):
        self.assertTrue(mod.DIRECTIONS_RE.match("/ors/v2/directions/foot-hiking/geojson"))
        self.assertIsNone(mod.DIRECTIONS_RE.match("/ors/v2/directions/driving-car/geojson"))
        self.assertIsNone(mod.DIRECTIONS_RE.match("/ors/v2/directions/foot-hiking/json"))
        self.assertIsNone(mod.DIRECTIONS_RE.match("/v2/directions/foot-hiking/geojson"))


if __name__ == "__main__":
    unittest.main()
