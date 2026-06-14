# WU-0003 — SonarChart overlay

**Stato:** CLOSED

**Scopo:** integrare nel monolite `coordinate_converter Claude.html` l’overlay **SonarChart** come overlay trasparente indipendente.

Dettagli tecnici:

- Endpoint proxy Planet-Clone: `/sonar/{z}/{x}/{y}.png`
- SonarChart = layer 1, **transparent**
- Overlay trasparente indipendente dalla basemap
- Meccanica UI/rendering di riferimento: **OpenSeaMap seamarks**
- Gating di rete: tipo **Navionics / tailnet-proxy**
- Nessuna nuova dipendenza
- Architettura monolite vanilla invariata

---

## Decisioni ratificate

| Ambito | Decisione |
| --- | --- |
| Consenso | Riuso consenso Navionics; nessuno stato di consenso nuovo |
| Persistenza consenso | Nessuna nuova persistenza; segue il consenso Navionics esistente |
| Basemap | Toggle indipendente; nessun cambio automatico di basemap |
| Forced-offline | Prevale sempre; spegne/blocca SonarChart |
| OPSEC strict | Fail-closed; nessun fetch se il gate non consente |
| Endpoint | `/sonar/{z}/{x}/{y}.png` |
| Z-order | basemap < SonarChart < seamarks < waypoint/tracce/poligoni < UI |
| Default | Off |
| i18n | IT/EN/FR obbligatorio |
| Architettura | Monolite vanilla invariato; nessuna dipendenza nuova |

---

## Sequenza blocchi proposta

| Blocco | Contenuto |
| --- | --- |
| **B0** | Docs-only: apertura documentale WU-0003, nessuna modifica al monolite |
| **B1** | Layer + stato + gate: registrare layer/stato/gate, layer non agganciato, zero fetch |
| **B2** | Toggle Layers + wiring add/remove: aggancio al punto-fetch e wiring UI |
| **B3** | i18n IT/EN/FR |
| **B4** | QA + chiusura WU |

**Nota:** B2 è splittabile in rendering/fetch e toggle UI se il wiring seamarks risulta intrecciato o rischioso.

---

## Punti aperti da verificare sul monolite prima di B1

- Navionics consuma `/status`? Questo decide se `charts.sonarchart` diventa precondizione del toggle o solo miglioria.
- Il consenso Navionics è per-sessione/transiente?
- Come gestiscono i seamarks i tile-error, in particolare 404 o tile mancanti?

---

## Acceptance criteria per chiusura WU

- SonarChart disponibile come overlay trasparente indipendente.
- Endpoint usato: `/sonar/{z}/{x}/{y}.png`.
- Default overlay **off**.
- Nessun cambio automatico di basemap.
- Riuso del consenso Navionics esistente, senza nuovo stato consenso SonarChart.
- Forced-offline prevale sempre e blocca/spegne SonarChart.
- OPSEC strict / gate rete in modalità **fail-closed**: nessun fetch se non consentito.
- Z-order rispettato: basemap < SonarChart < seamarks < waypoint/tracce/poligoni < UI.
- i18n IT/EN/FR completo.
- Nessuna nuova dipendenza runtime.
- Architettura monolite vanilla invariata.
- Nessuna regressione prevista su Navionics base, OpenSeaMap seamarks, waypoint, tracce, poligoni.

---

## Stato esecuzione (2026-06-14)

- SonarChart base (toggle indipendente, layer, i18n IT/EN/FR): commit a6c7741.
- Offline download + cached rendering: commit 6c0c18e.
- WU runtime (cache-on-browse, mutua esclusione Navionics/SonarChart,
  contatore cache sessione, minimizzazione pannello Mappe offline): commit 43d9ece.
- Test manuale LOCALE: PASS (esclusione, contatore, minimizzazione/ripristino).
- PENDENTE per chiusura: verifica tile `/sonar/` su VPS tailnet con proxy attivo
  (punti rete/consenso BLOCKED-ENV in locale; da confermare in positivo dopo deploy VPS).

## Chiusura (2026-06-14)

- Test end-to-end su VPS tailnet (proxy Planet-Clone attivo, tokens_ok,
  /status espone charts.sonarchart): PASS.
- SonarChart compare nel menu Layers; i tile /sonar/{z}/{x}/{y}.png
  renderizzano sopra la basemap; Network conferma richieste a /sonar/
  (NON /tiles/) con HTTP 200.
- Finding: i tile /sonar/ sono PNG RGBA con trasparenza reale (alpha
  usato, verificato per ispezione tile). Sotto SonarChart traspare la
  basemap, per design.
- WU-0003 CLOSED: scopo raggiunto (overlay nel monolite, toggle, gating
  OPSEC/consenso nav, cache, tile verificati end-to-end).
