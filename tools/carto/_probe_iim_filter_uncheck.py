#!/usr/bin/env python3
"""Playwright probe: #cartoIimFilterPaper must stay unchecked after click/change."""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright

HTML = Path(__file__).resolve().parents[2] / "coordinate_converter Claude.html"
URI = HTML.resolve().as_uri()

PROBE_JS = """() => {
  const out = { ok: false };
  try {
    out.build = { id: APP_BUILD_ID, num: APP_BUILD_NUM };
    if (typeof openCartoIgmPanel === 'function') openCartoIgmPanel();
    const el = document.getElementById('cartoIimFilterPaper');
    const igm = document.getElementById('cartoIgmFilter50');
    if (!el) return Object.assign(out, { error: 'missing_iim_checkbox' });
    const prevIim = !!el.checked;
    const prevIgm = igm ? !!igm.checked : null;
    el.checked = false;
    el.dispatchEvent(new Event('change', { bubbles: true }));
    const series = (state && state._cartoUi && Array.isArray(state._cartoUi.selectedSeries))
      ? state._cartoUi.selectedSeries.slice() : null;
    out.afterUncheck = { checked: el.checked, series: series };
    el.checked = true;
    el.dispatchEvent(new Event('change', { bubbles: true }));
    const seriesOn = (state && state._cartoUi && Array.isArray(state._cartoUi.selectedSeries))
      ? state._cartoUi.selectedSeries.slice() : null;
    out.afterRecheck = { checked: el.checked, series: seriesOn };
    let igmOff = null;
    if (igm) {
      igm.checked = false;
      igm.dispatchEvent(new Event('change', { bubbles: true }));
      igmOff = igm.checked;
      igm.checked = prevIgm;
      igm.dispatchEvent(new Event('change', { bubbles: true }));
    }
    el.checked = prevIim;
    el.dispatchEvent(new Event('change', { bubbles: true }));
    out.igmUncheckStaysOff = igmOff === false;
    out.ok = out.afterUncheck.checked === false
      && Array.isArray(series) && series.indexOf('paper') < 0
      && out.afterRecheck.checked === true
      && Array.isArray(seriesOn) && seriesOn.indexOf('paper') >= 0
      && out.igmUncheckStaysOff === true;
    return out;
  } catch (e) {
    return { ok: false, error: String(e && e.message || e) };
  }
}"""


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
            page.wait_for_function(
                "() => window.GOICartoIndex && typeof openCartoIgmPanel === 'function'",
                timeout=60000,
            )
            result = page.evaluate(PROBE_JS)
            browser.close()
            print(json.dumps(result, indent=2, default=str))
            return 0 if result and result.get("ok") else 1
        raise SystemExit("no playwright browser: " + str(last_err))


if __name__ == "__main__":
    raise SystemExit(main())
