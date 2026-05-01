# Riepilogo Pass 1.5 — verifica audit numerico `PROJECT_notes.md`

**Timestamp locale:** 2026-05-01_0157  
**Tipo:** commit documentale misto (`docs/PROJECT_notes.md` + memoria orchestratore), **non** autosync orchestratore puro.

## Cosa è stato fatto

- Verifica incrociata conteggio righe monolite: **`wc -l`** e **`awk 'END{print NR}'`** su `coordinate_converter Claude.html`.
- Confronto con §1 **Righe attuali** in `docs/PROJECT_notes.md`.
- Controllo formato numerico intero senza separatori (**37011**).
- Aggiunta sotto-sezione **§2 «Comandi usati per il calcolo dei range (Pass 1.5)»**: tracciamento `grep` per struttura fisica, macro `#region JS`, marker `SECTION` / LOCAL STORAGE; spot-check dichiarato per confini **6969/6970**, **8640**, **37009**.
- Aggiornamento nota piè documento `PROJECT_notes.md` e riferimento introduttivo §2 (rimosso esempio `rg` non universale in favore di `grep` documentato).
- Aggiornamento **`docs/orchestrator/latest.md`** + questo inbox.

## Sanity check righe (tre valori)

| Fonte | Valore |
|-------|--------|
| `wc -l` | **37011** |
| `awk 'END{print NR}'` | **37011** |
| `docs/PROJECT_notes.md` §1 | **37011** |

**Esito:** tutti e tre coincidono — **nessun errore bloccante**.

## Correzioni formato numerico

Nessuna correzione necessaria (già intero senza migliaia).

## Tracciamento comandi range

**Aggiunto** (sotto-sezione dedicata in §2).

## Spot-check confini CSS / body / script

| Confine | Riga documentata §2 | Esito |
|---------|-------------------|--------|
| Fine `</head>` / dopo CSS | 6969 | OK (`</head>` a riga 6969) |
| Inizio `<body>` | 6970 | OK |
| Apertura `<script>` | 8640 | OK |
| Chiusura `</script>` | 37009 | OK |

## File modificati

- `docs/PROJECT_notes.md`
- `docs/orchestrator/latest.md`
- `docs/orchestrator/inbox/2026-05-01_0157_riepilogo_pass1_5-verifica-audit-numerico.md`

## File NON toccati

- `coordinate_converter Claude.html`
- `docs/checkpoint.md`
- `docs/session-geolocalizzazione-e-mappa.md`
- `docs/roadmap.md`
- `.cursor/rules/*`

## Stato Pass 1

Pass 1 **chiuso con riserva documentale minima:** range tabella SECTION restano con **fine stimata** per costruzione (marker successivo); Pass 1.5 non li ricalcola riga-per-riga.

## Scoperto durante Pass 1.5 (fuori scope)

Nessun problema bloccante aggiuntivo da tracciare qui.

## Prossimo passo consigliato

**Pass 2** (persistenza / cap array / consolidamento), in sessione separata.
