# Build 283 — D-Flight minimizzato non blocca Escape verso Poligoni

**Registrazione:** 2026-11-11 03:06:36 Europe/Rome. **Blocco:** `GIS-DFLIGHT-MINIMIZED-ESCAPE-A` · DELICATO lifecycle modale/dialog.

## Stato LIVE postdeploy — 2026-11-11

**Build 283 LIVE.** GitHub main e clone VPS aggiornati. Preflight, backup, fast-forward e restart GIS-only PASS (03:09:05 Europe/Rome). HTTP diretto sul VPS SHA `dbdc54753722bee425d9c4e6528455ef7b72d946b69e747ae109621de414ea24`; HTTPS dal VPS e AsusDesktop SHA identico, 11.108.965 byte. QA HTTPS **NATIVA** Edge (documento reale non sostituito): **17/17 PASS**, compreso T16 (Poligoni con D-Flight minimizzato), 0 POST, 305 richieste accessorie bloccate. [Deploy](DEPLOY-RESULT-283.md) · [ABQA](QA-LIVE-283.md).

Nota rete: prime due richieste HTTPS dal PC AsusDesktop incomplete dopo il deploy, successive richieste a contenuto completo e SHA corretto; nessuna modifica Nginx/proxy. Questa variabilità non viene convertita in PASS universale della connettività. Review AI esterna NOT_PERFORMED/backstop.

**Gate residuo:** QA OPERATORE DESKTOP 283, non ricevuta; il PASS precedente della 282 non si trasferisce. Telefono in pausa.

---

## Stato al checkpoint

**STORICO PREDEPLOY (non stato corrente):** runtime LIVE era la Build **282**. Candidata 283 su GitHub, review sostitutiva completata, QA candidata completata. Nessun deploy, nessuna ABQA LIVE 283, nessun PASS operatore 283 attribuito.

| Identità | Valore |
| --- | --- |
| Base 282 | `9f2fe361b249d3b42cddfd5417cc66775d478ebe` · runtime source `6b906869b77a2b3c91c8848012894ffff85399e3` |
| Candidata 283 source | `5795b6711c5690216a2f1862003af29758520101` |
| Blob HTML candidata | `c5d8ee1edaeba2513f897d838b7caa24aa4b4eaa` |
| SHA-256 candidata | `dbdc54753722bee425d9c4e6528455ef7b72d946b69e747ae109621de414ea24` |
| Bytes candidata | 11.108.965 |
| Files modificati | soltanto `coordinate_converter Claude.html` |
| Diff | 6 righe inserite, 6 eliminate; 1 variazione funzionale + 3 metadati |
| CR isolati | 192, invariati |

## Baseline osservata in Edge Windows HTTPS

Apertura D-Flight reale da menu Layer → Zone D-Flight (UAS), minimizzazione dal simbolo −, apertura Poligoni da toolbar mappa Traccia → Poligoni, pressione Escape. Build 282 nativa HTTPS: Poligoni resta aperto e visibile, D-Flight resta minimizzato, chip presente. **T16 FAIL reale**; 16 PASS / 1 FAIL su 17 controlli. D-Flight minimizzato con Mappe Offline, Escape, chip/restore/× erano PASS.

## Correzione candidate

La condizione D-Flight nel gestore Escape viene attivata soltanto se il dialog è aperto e **non minimizzato**. Un dialog D-Flight minimizzato non chiude se stesso e non sottrae Escape a un pannello successivo: il controllo raggiunge Poligoni, Routing e gli handler seguenti. Inalterati i metodi apertura, chiusura, minimizzazione, aria-modal, classi close, mappa, persistenza, OPSEC, rete, dati coordinate, state.mapWaypoints[] e GPS.

## QA candidata e review

- Sintassi JavaScript inline Node: 2/2 PASS (i due script di esecuzione; blocchi JSON esclusi dal parser).
- Ricostruzione byte esatta dalle quattro sostituzioni, reverse diff, diff --check, confronto blob e SHA, 192 CR conservati: PASS.
- Automated Browser QA candidata: **17/17 PASS**, HTTPS origin VPS con sostituzione in memoria del documento HTML a SHA candidato, nessuna modifica al server; nessun POST; 329 accessorie bloccate. [Dettaglio](QA-CANDIDATE-283.md).
- **REVIEW GPT-SOSTITUTIVA:** 18/18 PASS su GitHub raw pinnato a `5795b6711c5690216a2f1862003af29758520101`; checklist lifecycle (apertura, close, minimizzazione, markup, fuori GIS invariato), scope/invarianti e syntactic. [Risultato](REVIEW-GPT-283.json).
- Review AI esterna: **NOT_PERFORMED**; backstop successivo distinto. Non attestare revisione esterna svolta.

## Gate successivo

Preflight deploy GIS-only; verifica source/manifest, backup, fast-forward su main, unico restart `goi-gis-app.service`, HTTP 8000 e HTTPS /gis SHA; poi ABQA nativa HTTPS su Build 283. Solo dopo PASS tecnico e ABQA → QA operatore desktop residua. In caso gate FAIL: non pubblicare/rilasciare ulteriormente. Telefono in pausa.
