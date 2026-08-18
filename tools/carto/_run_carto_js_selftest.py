#!/usr/bin/env python3
"""Run GOICartoIndex.selfTest() against the local monolite via Playwright."""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright

HTML = Path(__file__).resolve().parents[2] / "coordinate_converter Claude.html"
URI = HTML.resolve().as_uri()


def main() -> int:
    with sync_playwright() as p:
        last_err = None
        for launcher in (p.chromium, p.firefox, p.webkit):
            try:
                browser = launcher.launch(headless=True)
            except Exception as e:
                last_err = e
                continue
            page = browser.new_page()
            page.goto(URI, wait_until="load", timeout=180000)
            page.wait_for_function("() => window.GOICartoIndex && typeof window.GOICartoIndex.selfTest === 'function'", timeout=60000)
            build = page.evaluate("() => ({ id: APP_BUILD_ID, num: APP_BUILD_NUM })")
            result = page.evaluate("() => window.GOICartoIndex.selfTest()")
            browser.close()
            print(json.dumps({"build": build, "selfTest": result}, indent=2, default=str))
            return 0 if result and result.get("ok") else 1
        raise SystemExit("no playwright browser: " + str(last_err))


if __name__ == "__main__":
    raise SystemExit(main())
