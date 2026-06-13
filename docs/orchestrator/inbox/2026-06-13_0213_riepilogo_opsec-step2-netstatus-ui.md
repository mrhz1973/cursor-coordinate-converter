# OPSEC Step 2 — net status UI / tooltip / i18n (completato)

**Data:** 2026-06-13  
**Commit codice:** `feat(opsec): show contacted hosts in net status`  
**Perimetro:** solo monolite `coordinate_converter Claude.html`

## Step 2 completato

- `#netStatus` tooltip (`data-tip`) mostra sezione **Rete:** con host fusi in presentazione da:
  - `_nominatim.hostsContacted` (Set, invariato);
  - `state._netEvents` (Map transiente, invariata).
- Helper UI-only: `_mergedNetworkHostsForDisplay()` — merge solo per tooltip, store separati.
- `refreshHostsContactedUI()` aggiornata: legge entrambi gli store quando invocata (flusso esistente: geocoding, `updateNetStatus`, `applyLanguage`).
- Host da `_netEvents`: contatore `(count)`; `ok=false` → suffisso i18n `net.hostFailed`.
- Host solo Nominatim: nome senza contatore.
- Nessun timestamp dettagliato in v1.
- **Riga Cache omessa:** non esiste contatore cache-hit globale già disponibile senza aggiungere registrazioni nei rami cache; raffinamento futuro.
- **Limite v1 accettabile:** tooltip tile/seamarks/API si aggiorna al prossimo refresh già esistente (geocoding, toggle offline, cambio lingua), non dopo ogni singolo tile fetch — nessun timer/polling aggiunto.

## i18n aggiunte (IT/EN/FR)

- `net.hostsNetwork`
- `net.hostFailed`
- `net.noneContacted`
- `net.hostsCache` **non aggiunta** (riga Cache non implementata)
- Nessuna chiave `opsec.strict.*`

## Step 1 non modificato

- `recordNetEvent`, `ensureNetEventsStore`, `_normalizeNetHost`, forma store, punti di registrazione: **invariati**.
- Nessun bugfix Step 1 necessario.

## Non implementato (come da vincoli)

- Gate OPSEC, consenso Navionics, warning strict, blocchi seamarks/basemap/Navionics.
- Persistenza `_netEvents`.
- Integrazione `/sonar/`.

## Validazione statica

- 2× `<script>` inline → `node --check` → **NODE_CHECK=OK**.

## Decisione utente ratificata (contesto Step 3+, non codice)

Opzione 3 strict graduato: seamarks bloccati secchi; Navionics consenso per-sessione; download offline con conferma; Esri/Open-Meteo in gate; futuro `/sonar/` tailnet-proxy eredita consenso Navionics.

## Step successivi

| Step | Scope |
|---|---|
| **Step 3** | Gate / avvisi strict graduato |
| **Step 4** | QA finale, i18n rifinitura, docs se necessario |

## Righe patch

- Monolite: ~+47 / −3 (sotto soglia 50 net).
