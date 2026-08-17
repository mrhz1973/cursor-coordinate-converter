# GIS-PANEL-DOCK-MGR-G-B — evidence (pre-review)

**BLOCK-ID:** `GIS-PANEL-DOCK-MGR-G-B`  
**WU:** WU-0021  
**CATEGORIA:** DELICATO  
**GATE:** **REVIEW GPT-SOSTITUTIVA — PENDING**  
**NO deploy · NO ABQA · NO QA operatore · NO finito**

## Identity

| Voce | Valore |
| --- | --- |
| BASE LIVE | `525e7df50cb4edf768b0da7f59e7414dd79d56de` · build **210** · `GIS-PANEL-DOCK-MGR-G-A1-FIX2` |
| CANDIDATE G-B | `361345d6d330347a0ced6cd57c4a3fcb7d7b173a` · build **211** · `APP_BUILD_ID=GIS-PANEL-DOCK-MGR-G-B` |
| Blob | `a0b8661422d8646ee07ec7ff41ba25c7c67cbb42` |
| Bytes LF | `10400053` |
| SHA-256 LF | `eab1ae24b9817a6592dc22fb7b86d4be873704bbbec194f4b0810a74492c9b13` |
| Diff vs BASE | **18 hunk** · **+340 / −38** · **OTHER=0** |
| Helper | **0.1.3** invariato |
| Audit | G-B-AUDIT-A REVIEW PASS (scope) |

Ancestry: `525e7df` (LIVE/BASE) → `361345d` (G-B candidate).

Artifacts: [`…-verify.json`](2026-08-17_0210_gis-panel-dock-mgr-g-b-verify.json) · [`…-hunk-account.json`](2026-08-17_0210_gis-panel-dock-mgr-g-b-hunk-account.json)

## Runtime delta

### 1. Workbench whitelist (unico cambio funzionale)

In `gisMinimizePanel`, prima di `cartoIgmPanel` / fallback:

```javascript
} else if (panelId === "gisWorkbenchPanel"){
  /* G-B: ordinary workbench minimize — reuse existing focus/restore/i18n infra. */
}
```

Elimina il silent no-op. Riusa wire, focus map, restore, layout opts, `gis.minimized.workbench`. Nessuna nuova i18n / dock / state / block-check.

### 2. Selftest

- `DOCK_GA1_neg_workbench_whitelist` → `DOCK_GA1_workbench_whitelist_present` (branch **presente**)
- Nuova suite `gisDockSelfTestGB` + `G_B_ORDINARY_IDS` (11 id)
- Build pins 210→211 / FIX2→G-B

### 3. Non toccato

`gisDockReflow`, `gisPanelSafeTop`, z-order, shared dock/SoT, G-C lifecycle (D-Flight pair, carto `_cartoUi`, auto-min bbox/draw/pick, …), search/convert/qr, G-D.

## Hunk account

| Class | Count |
| --- | --- |
| BUILD_META | 10 |
| SELFTEST_BUILD_PIN | 5 |
| SELFTEST_GA1_GUARD | 1 |
| SELFTEST_GB | 1 |
| WHITELIST_WB | 1 |
| **OTHER** | **0** |

## Prove

| Check | Esito |
| --- | --- |
| Selftest | **486/486** PASS |
| Workbench minimize not no-op | PASS (chip + restore + drag) |
| Ordinary roundtrip 11/11 | PASS |
| Blocked favorites | PASS |
| Critico 360×640 / 3 chip safeTop | PASS (`safe=215`, `dockB=205`) |
| Handle hit panel | PASS |
| i18n IT→EN→FR→IT | PASS |
| WU-0019 sibling | PASS |
| Single dock | PASS |

## Invarianti

- No rete/GPS/storage/IDB nuovi · helper 0.1.3 · `mapWaypoints` · session-only minimized · brand TMART · **F/G-C/G-D NOT OPENED** · WU-0012 invariata · G-A1-FIX2 non riaperto semanticamente

## STOP

**REVIEW GPT-SOSTITUTIVA — PENDING**
