# 2026-08-17 — GIS-DIALOG-MINIMIZE-HISTORY-A · REVIEW PASS + deploy + ABQA

## Fatti stabili (EXTERNAL_ONLY)

- **Categoria:** DELICATO
- **REVIEW GPT-SOSTITUTIVA:** **PASS** sul FULL SHA `7196b30fe0c89acf2bd538640eb2076f012b6380` (evidence B già pubblicata)
- **Runtime LIVE (deployato):** `7196b30fe0c89acf2bd538640eb2076f012b6380` · build **214** · `APP_BUILD_ID=GIS-DIALOG-MINIMIZE-HISTORY-A`
- **Monolite blob:** `d425ec9a6c0fe4dc9e8f3a7445e6a1f6f6686f9f`
- **SHA-256 LF / bytes:** `523fc1cccc930461445235f7f50980dbc02db410b01e0e9225a6e63e1c2fd541` · **10468712**
- **Deploy GIS-only:** PASS — VPS FF `956efa7`→`2e7557a` · blob ≡ candidato · `goi-gis-app` restart MainPID `2746464`→`2755555` · proxy/GH PID **invariati** (`2481045` / `2034035`) · helper PID **invariato** `2643028` · HTTP **200** · file↔HTTP SHA MATCH · tip VPS `2e7557ac31cb205e4fc38594208828ee20d8423b`
- **URL:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=7196b30`
- **Helper:** `HELPER_VERSION = "0.1.3"` · servizio **non** riavviato (GIS-only). PID `2643028`→`2643028`.
- **Automated Browser QA:** **PASS** (**37**/37, fail=0) — build 214 LIVE · Converti/Cerca min→dock→restore→× · no inert/backdrop in minimize · Cronologia dialog no right-slide · Esc/× · chrome 1400 + 360 · smoke G-D dock · console senza errori severi · selftest **592/592** · `DOCK_GD_*` 40/40 · `DH_*` 28/28
- **NO** patch monolite in questo pass · **NO** finito · **NO** istruzioni QA operatore · **F NOT OPENED** · Oggetti GIS **FROZEN**

## Gate

**QA FINALE CHATGPT — PENDING**

## ABQA summary

```json
{
  "ok": true,
  "n": 37,
  "pass": 37,
  "fail": 0,
  "fails": [],
  "url": "http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=7196b30-abqa",
  "selftest": { "ok": true, "n": 592, "fail": 0 },
  "build": "214 / GIS-DIALOG-MINIMIZE-HISTORY-A",
  "F": "NOT OPENED"
}
```

JSON: [`2026-08-17_2255_gis-dialog-minimize-history-a-abqa.json`](2026-08-17_2255_gis-dialog-minimize-history-a-abqa.json) · deploy out: [`…-deploy-out.txt`](2026-08-17_2255_gis-dialog-minimize-history-a-deploy-out.txt).

Evidence pre-deploy: [`2026-08-17_2235_gis-dialog-minimize-history-a-evidence.md`](2026-08-17_2235_gis-dialog-minimize-history-a-evidence.md) · REVIEW-EVIDENCE-B: [`2026-08-17_2240_gis-dialog-minimize-history-a-review-evidence-b.md`](2026-08-17_2240_gis-dialog-minimize-history-a-review-evidence-b.md).

## Coverage (nomi check)

`build_214_live` · `convert_*` / `search_*` (open / min dock / no inert / map free / restore / close clears) · `history_open_dialog` · `history_not_drawer` · `history_esc_closes` · `history_x_closes` · `*_chrome_1400` · `*_chrome_360` · `gd_smoke_*` · `selftest_592` · `selftest_dock_gd_40` · `console_no_severe`

Nota metodo: criterio titolo = **intersezione viewport** (il default GIS di Converti a 1400 può avere `left` negativo; `−`/`×` restano fully in-view). Nessun finding di prodotto; nessuna patch.

## Conferma LIVE post-ABQA (2026-08-17 22:55 +02)

VPS HEAD `2e7557ac31cb205e4fc38594208828ee20d8423b` · blob `d425ec9a…` · GIS PID `2755555` · HTTP 200 / SHA MATCH / BUILD 214 OK.
