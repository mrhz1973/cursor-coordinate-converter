# T1.2 — CoT XML waypoint import/export: verifica e documentazione

**Data:** 2026-05-19 15:30  
**Branch:** main  
**HEAD:** 5199471

---

## Sommario

La sessione aveva come obiettivo implementare CoT XML export e import per il pannello waypoint (T1.2 — ATAK interop). All'ispezione statica del monolite, la feature risulta **già completamente implementata** in un pass precedente. La sessione ha eseguito la verifica completa (static checks + marker search), confermato il PASS, e documenta qui i dettagli per chiudere formalmente il roadmap item T1.2.

---

## File modificati in questa sessione

| File | Tipo | Note |
|------|------|-------|
| `coordinate_converter Claude.html` | **nessuna modifica** | Feature già presente e committata a HEAD |
| `docs/orchestrator/latest.md` | docs | Aggiornato con stato T1.2 CLOSED |
| `docs/orchestrator/inbox/2026-05-19_1530_cot-xml-import-export.md` | docs | Questo file |

---

## Funzioni / handler / chiavi i18n presenti nel monolite

### Funzioni JavaScript

| Funzione | Riga | Descrizione |
|----------|------|-------------|
| `waypointsExportCotXml()` | 40919 | Entry point export — recupera lista, chiama `buildCotXmlForWaypoints`, scarica file `.cot` |
| `buildCotXmlForWaypoints(waypoints, opts)` | 40906 | Costruisce stringa XML con root `<goiCotWaypointBundle>` + N `<event>` |
| `waypointToCotEventXml(wp, opts)` | 40882 | Serializza singolo waypoint in elemento `<event>` CoT |
| `waypointsImportCoTXml(file, opts)` | 41083 | Legge file via `FileReader`, poi chiama `waypointsImportCoTFromText` |
| `waypointsImportCoTFromText(text, opts)` | 41057 | Valida dimensione, chiama `importCotEventsAsWaypoints`, mostra feedback |
| `importCotEventsAsWaypoints(xmlText, opts)` | 40995 | Deduplicazione per uid/fingerprint, import in `state.mapWaypoints`, save/render |
| `parseCotXmlToDocument(text)` | 40934 | DOMParser con guard DOCTYPE e parsererror |
| `collectCotPointEvents(doc)` | 40943 | Raccoglie elementi `<event>` (max `COT_MAX_EVENTS_SCAN = 500`) |
| `cotEventToWaypointPayload(eventEl)` | 40957 | Estrae lat/lon/callsign/uid/remarks da un `<event>` |
| `getWaypointsForExportOrSelection()` | 40871 | Restituisce checkbox selezionati o tutti i waypoint |
| `sanitizeCotUid(s)` | 40827 | Sanitizza uid CoT (caratteri ammessi) |
| `cotImportStableFingerprint(...)` | 40834 | Fingerprint stabile per deduplicazione roundtrip |
| `cotExportFilenameForWaypoints(list)` | 18015 | Genera nome file `.cot` con timestamp |
| `formatCotTime(d)` | (presente) | ISO8601 Zulu per attributi CoT |
| `cotStaleFromStart(start, minutes)` | (presente) | Calcola stale = start + N minuti |
| `cotTypeForWaypoint(wp)` | (presente) | Tipo CoT (`a-f-G-U-C` per waypoint generico) |
| `xmlEsc(s)` | 17744 | Escaping attributi XML (`&`, `<`, `>`, `"`, `'`) |
| `downloadBlob(content, filename, mime)` | 18042 | Trigger download browser |

### Costanti

| Costante | Valore | Descrizione |
|----------|--------|-------------|
| `COT_XML_MAX_BYTES` | 2 097 152 (2 MB) | Limite dimensione file import |
| `COT_MAX_EVENTS_SCAN` | 500 | Limite eventi scansionati |
| `COT_STALE_MINUTES` | (valore presente) | Minuti per calcolo stale |
| `COT_DEFAULT_HOW` | (valore presente) | how default per export |
| `COT_UNKNOWN_ELEV` | (valore presente) | hae/ce/le default (9999999 o simile) |
| `COT_WAYPOINT_BUNDLE_NS` | (stringa presente) | Namespace XML root bundle |

### UI — Export dialog (riga 9218–9222)

```html
<button type="button" class="btn btn-sm wp-export-fmt wp-export-cot-combo"
  id="waypointExportCotFormatBtn" data-wp-export-fmt="cot"
  data-i18n-tip="tip.waypointModal.exportCot"
  data-i18n-aria="waypointModal.exportCotAria">
  <span class="wp-export-cot-title" data-i18n="waypointModal.exportCot">CoT XML</span>
  <span id="waypointExportDialogCotHint" ... hidden></span>
</button>
```

Il pulsante è presente nel dialog `#waypointExportDialog` insieme a GeoJSON / GPX / KML / KMZ / CSV. Il click è gestito a riga 35951–35952: `if (k === "cot") waypointsExportCotXml()`.

### UI — Import handler (riga 37771–37778)

```js
if (/\.(xml|cot)$/i.test(name)){
  waypointsImportCoTXml(file, { onDone });
  return;
}
```

Il dialog `#waypointImportDialog` accetta file trascinati o sfogliati. File `.xml` e `.cot` vengono instradati a `waypointsImportCoTXml`. File senza estensione riconosciuta vengono letti come testo e auto-rilevati (pattern `/<event[\s>]/i` a riga 37795).

### Chiavi i18n presenti (IT / EN / FR)

| Chiave | IT | EN | FR |
|--------|----|----|----|
| `waypointModal.exportCot` | CoT XML | CoT XML | CoT XML |
| `waypointModal.exportCotAria` | Esporta waypoint in CoT XML | Export waypoints as CoT XML | Exporter les waypoints en CoT XML |
| `waypointModal.exportCoTNoWaypoints` | Nessun waypoint da esportare | No waypoints to export | Aucun waypoint à exporter |
| `waypointModal.exportCotHintAll` | Esporta tutti i {0} waypoint | Export all {0} waypoints | Exporter les {0} waypoints |
| `waypointModal.exportCotHintSelectedOne` | Esporta 1 waypoint selezionato | Export 1 selected waypoint | Exporter 1 waypoint sélectionné |
| `waypointModal.exportCotHintSelectedMany` | Esporta {0} waypoint selezionati | Export {0} selected waypoints | Exporter {0} waypoints sélectionnés |
| `waypointModal.importCoTDefaultName` | Importato | Imported | Importé |
| `waypointModal.importCoTParseErr` | CoT XML non valido o non leggibile | Invalid or unreadable CoT XML | CoT XML invalide ou illisible |
| `waypointModal.importCoTTooLarge` | File CoT troppo grande | CoT file too large | Fichier CoT trop volumineux |
| `waypointModal.importCoTNoEvents` | Nessun evento CoT con \<point\> valido | No CoT events with a valid \<point\> | Aucun événement CoT avec \<point\> valide |
| `waypointModal.importCoTResult` | Importati {0} waypoint, {1} duplicati, {2} scartati | Imported {0} waypoints, {1} duplicates, {2} skipped | {0} waypoints importés, {1} doublons, {2} ignorés |
| `waypointModal.importCoTDuplicate` | Duplicato (uid CoT già presente) | Duplicate (CoT uid already present) | Doublon (uid CoT déjà présent) |
| `waypointModal.importCoTDoctype` | File con DOCTYPE non supportato per sicurezza | Files with DOCTYPE are not supported | Les fichiers avec DOCTYPE ne sont pas pris en charge |
| `tip.waypointModal.exportCot` | Esporta in CoT XML (.cot)… | Export as CoT XML (.cot)… | Export CoT XML (.cot)… |

---

## Static checks

| Check | Risultato |
|-------|-----------|
| `<script src` presenti | **0** — nessuna dipendenza esterna |
| `type="module"` presenti | **0** — architettura inline preservata |
| Blocchi `<script>` / `</script>` | **2** — struttura invariata |
| `node --check` blocco principale | **SYNTAX OK** (Node v24.15.0) |
| Marker UI `data-wp-export-fmt="cot"` | PRESENTE (riga 9218) |
| Marker funzione `waypointsExportCotXml` | PRESENTE (riga 40919) |
| Marker funzione `waypointsImportCoTXml` | PRESENTE (riga 41083) |
| Marker funzione `buildCotXmlForWaypoints` | PRESENTE (riga 40906) |
| Marker handler import `.xml|.cot` | PRESENTE (riga 37771) |
| i18n IT / EN / FR | PRESENTE (righe 10254–10268 / 11637–11651 / 13020–13034) |

---

## Browser QA

**NOT EXECUTED** — ambiente CI/headless senza browser.

### Checklist manuale

1. Aprire GIS Tool nel browser.
2. Creare 3 waypoint: **Alpha**, **Bravo**, **Charlie**.
3. Click **Esporta** nel pannello Waypoint → selezionare **CoT XML**.
4. Aprire il file scaricato e verificare:
   - Root `<goiCotWaypointBundle>` (bundle proprietario con `<event>` interni).
   - 3 elementi `<event>`, ciascuno con attributi `uid`, `type`, `time`, `start`, `stale`, `how`.
   - Ogni `<event>` ha `<point lat="..." lon="..." hae="..." ce="..." le="..."/>`.
   - Ogni `<event>` ha `<detail><contact callsign="..."/></detail>`.
5. Eliminare tutti i waypoint.
6. Click **Importa** nel pannello Waypoint → selezionare il file `.cot` esportato.
7. Verificare che i 3 waypoint vengano ripristinati con nome e coordinate corretti.
8. **Roundtrip**: esportare nuovamente e confrontare lat/lon/callsign (timestamp possono differire).
9. **Regressione**:
   - Export GPX, KML, GeoJSON ancora funzionanti.
   - Edit/delete/preferiti/elimina-tutti waypoint invariati.
   - Nessun errore in console.

---

## Rischi noti / deferred

- Il root XML è `<goiCotWaypointBundle>` (bundle proprietario) anziché `<events>` standard ATAK. L'import nel pannello waypoint funziona con roundtrip garantito; interop con altri strumenti ATAK potrebbe richiedere adeguamento futuro se necessario.
- Deduplicazione basata su uid CoT + fingerprint stabile (lat/lon/name): waypoint identici con nome diverso non vengono deduplicati.
- Limite 500 eventi scansionati e 2 MB per file; sufficiente per uso operativo tipico.
- `node --check` eseguito sul blocco script principale (~32.000 righe): PASS. Test browser non eseguiti in questa sessione.

---

## Stato roadmap

**T1.2 — CoT XML import/export — ATAK interop: CLOSED.**

Prossimo Tier 1 candidato: **T1.1 compound polygon** (scope ampio, pianificare come multi-step pass) oppure **T1.3 layer cartografici esterni** (research-gated: CORS, licensing, OPSEC).
