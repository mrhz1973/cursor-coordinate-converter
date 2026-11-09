# Raccolta selettiva delle evidenze — Build 280

Raccolta preparata il **9 novembre 2026** per il checkpoint finale. Comprende 20 artefatti originali copiati senza modifiche nelle sottocartelle `review/`, `selection/` e `storage/`. Tutte le copie sono state confrontate byte per byte con le rispettive fonti. Il manifest `manifest-sha256.txt` contiene gli SHA256 dei 20 artefatti e di questo indice.

## Identità dei runtime

| Riferimento | Commit locale | SHA256 runtime |
|---|---|---|
| Candidato iniziale, Build 280 | `fb10709eddffaf8ce57cfba7e892618f0d2533df` | `1e6c11cf0825d5c76dd06147cec2378f023a4c323ba4dfcdb623cdce2a57576a` |
| Candidato definitivo, Build 280 | `c33f58c956e9630b03f9ff86eb35eccd35879a4a` | `70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde` |

Queste identità qualificano i contenuti verificati; non sono una dichiarazione sullo stato corrente di `origin/main`.

## Quale evidenza riguarda quale SHA

| Artefatti inclusi | Riferimento e portata |
|---|---|
| `review/REVIEW-GPT-SOSTITUTIVA.md`, `review/review.json`, `review/review-artifact-manifest.json`, `review/runtime.diff`, `review/unchanged-sensitive-paths.json` | **Candidato iniziale 1e6.** Review completa e confronto con la base 279. I test preesistenti acquisiti in quella review restano attribuiti allo SHA iniziale. |
| `storage/STORAGE-ORIGIN-REVIEW.md`, `storage/storage-contract-comparison.json` | **Confronto diretto base 279 → iniziale 1e6**, senza accesso ai dati browser reali. L’applicabilità al definitivo è sostenuta dall’integrità del delta, che non modifica questi percorsi. |
| `review/REVIEW-GPT-SOSTITUTIVA-70553e52.md`, `review/review-final-70553e52.json`, `review/review-final-artifact-manifest.json` | **Definitivo 70553**, tramite review compositiva: review iniziale, delta completo e regressioni mirate. |
| `review/final-delta-integrity.json`, `review/final-ui-delta.diff` | **Ponte 1e6 → 70553.** Ricostruzione esatta del definitivo mediante due funzioni UI e la nota di rilascio; resto byte-identico. |
| `review/acquired-final-offline-qa-summary.json` | **Definitivo 70553.** Proiezione dell’evidenza offline del collega sul pulsante Compare e sul guard dell’osservatore GH. Identità SHA256 della fonte completa registrata nel file. |
| `selection/selection-regression.cjs`, `selection/adaptation-manifest.json`, `selection/results.json`, `selection/REGRESSIONE-SELEZIONE-70553e52.md`, `selection/evidence-manifest.json` | **Entrambi.** Difetto riprodotto su 1e6; selezione/salvataggio/riapertura sul definitivo 70553; confronto degli overlay su entrambi. Otto scenari mirati, nessun test dell’intermedio 68fb. |
| `selection/ors-foot-hiking-ors.json` | **Risposta catturata nella QA dell’iniziale 1e6**, riprodotta senza modifica nei test di entrambi i candidati. Fixture necessaria al runner, non nuova richiesta provider. |
| `selection/preexisting-source-proof.json` | **Identità sorgente base 279 ↔ iniziale 1e6.** Non costituisce test browser della base 279. |

## Selezione e deduplicazione

Le fonti delle tre sottocartelle sono rispettivamente `qa-gis-runtime-review-280`, `qa-gis-selection-regression` e `qa-gis-storage-origin` nello scratch di lavoro.

- Il confronto storage è conservato **una sola volta**, in `storage/storage-contract-comparison.json`. La copia omonima originariamente presente in `review/` aveva byte identici. Il manifest storico della review iniziale resta immutato e cita la posizione originaria: il medesimo hash si trova ora sotto `storage/`.
- Il frammento `selection-body.cjs` è escluso perché è già incorporato nel runner eseguibile completo `selection-regression.cjs`. Il manifest storico della selezione resta immutato e documenta anche quel frammento nell’insieme di lavoro originale; il manifest della presente raccolta elenca soltanto i file effettivamente inclusi.
- Esclusi il patch di trasferimento dell’intermedio, payload codificati/di trasporto, copie complete degli HTML runtime e altre copie inutilmente duplicate.
- La fonte completa `final-offline-regression.json` del collega è gestita dal root con gli altri rapporti; qui è incluso soltanto il riepilogo acquisito e la sua provenienza verificabile.

La raccolta conserva le qualificazioni e i limiti contenuti nei rapporti originali. Non contiene un rapporto di deploy o post-deploy.

## Verifica delle copie

Dalla radice della raccolta è possibile verificare il manifest con:

```sh
sha256sum -c manifest-sha256.txt
```
