## REVIEW-EVIDENCE-RECOVERY — `GLOBAL-MODAL-EDGE-RESIZE-A` (gap closure verify-only)

### Identità
- Baseline commit: `c35e2f79f28ade1271cadb9608bc6022cb6ab431`
- Candidate commit: `942ab73e73fa61870ab85a72d871b35f0105e8f2`
- Baseline blob: `52376f48e4f181939ee2ee3c1cdd88d1c2dd3038`
- Candidate blob: `ae5b4df61f76b7b16d4e889a618abf7cf1010c80`

### 1) PROVA RETE ISOLATA DAL RESIZE (NO deploy / NO runtime changes)
Misura basata su `performance.clearResourceTimings()` e conteggio univoco di risorse `http(s)` non-locali **solo dopo** il clear, eseguendo **una sola** azione resize su `favoritesPanel`.

| Scenario | ext_before_count | ext_after_count | ext_new (delta!=0) | gesture |
|---|---:|---:|---|---|
| NORMAL-SETTLED | 0 | 0 | `[]` | `{ok:true}` |
| OPSEC/OFFLINE | 0 | 0 | `[]` | `{ok:true}` |

Conclusione rete isolata:
- `N_external_network_delta0` non riproducibile quando il resize è isolato da load precedenti (delta esterne = 0).

### 2) BASELINE DEI FAIL SELFTEST (identità ESATTA nomi/fail)
Eseguito `GOIDflight.selfTest()` su copie/temp separate (baseline vs candidate), senza modificare runtime.

| Campo | Baseline (`c35e2f79...`) | Candidate (`942ab73...`) |
|---|---:|---:|
| total checks | 850 | 871 |
| fail_count | 13 | 13 |
| fail names | identici set 13 voci | identici set 13 voci |

**Fail names (identici set):**
1. `Tf_FIX3_actual_top_available_height`
2. `Tf_FIX3_valid_dragged_top_preserved`
3. `Tf_FIX3_low_top_clamped_upward`
4. `Tf_FIX3_high_low_high`
5. `Tf_FIX3_details_same_invariants`
6. `Tf_FIX3_restore_maximize_safeTop`
7. `Tf_FIX3_details_restore_safeTop`
8. `HitA_FIX1_info_above_efp`
9. `HitA_FIX1_single_dispatch_info`
10. `HitA_FIX2_recovery_single_dispatch`
11. `DOCK_GD_four_not_all_row`
12. `DOCK_GD_no_5th_chip_jump`
13. `DOCK_GD_fifth_uses_lateral_or_stable`

Attenzione 5 nomi:
- Tutti e 5 (`HitA_FIX1_info_above_efp`, `HitA_FIX1_single_dispatch_info`, `HitA_FIX2_recovery_single_dispatch`, `DOCK_GD_four_not_all_row`, `DOCK_GD_fifth_uses_lateral_or_stable`) risultano **presenti identici** in baseline e candidate (nessun fail nuovo).

### Finding conclusivo (per ChatGPT, gate ancora PENDING)
- Resize edge/corner **isolato**: delta rete esterna = **0**.
- Selftest `GOIDflight.selfTest()`:
  - fail_count identico (13 vs 13),
  - fail names set identico (nessun nuovo fail introdotto dal candidate).

