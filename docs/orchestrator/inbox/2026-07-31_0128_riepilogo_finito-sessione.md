# Riepilogo finito sessione — ROUTING-SUMMARY-DEDUP-A

Timestamp: 2026-07-31 ~01:28 (locale)

## Blocco chiuso

**ROUTING-SUMMARY-DEDUP-A** — **CLOSED / PASS end-to-end**

## Runtime tip (task reale)

- Commit: `58197bb14e1f5eb7f00abbe348500f2d093ff381`
- Subject: `fix(routing): remove duplicate route metrics from status`
- Parent: `8e0a3aa4f5bf34d6551458014548b3d2c7343ac6`
- Blob: `79ba3e6556198c1a2509594f4947f8526e2872d6`
- Byte LF: `3129462`
- SHA-256 LF: `db113b40cd179f24230a831dc86a7ce6f57ac4c7532b23e9b29ccd4c0934b26d`
- Build: `B6.1RSD-A · build 84`
- Monolite incluso nel commit runtime tip: **sì** (già pushato prima del finito docs)

## Storia QA/review

1. Implementazione runtime `58197bb` (build 84)
2. Bundle ROUTINE — nessun hop Claude
3. Deploy GIS-only PASS (solo `goi-gis-app`; GH/nav-proxy/Docker invariati)
4. `QA ROUTING-SUMMARY-DEDUP-A PASS operatore` (2026-07-31, UI italiana) → Regola H / `finito`

## Docs aggiornati (commit task docs, pre-autosync)

- Commit docs: `973a44b5d8c09ae9478635c74eb18da5f9474bfa`
- `docs/OPERATING_MEMORY.md` §7
- `docs/HANDOFF.md`
- `docs/QA-CHECKLIST.md`
- `docs/work-units/WU-0010-outdoor-routing-graphhopper.md`
- `docs/work-units/WU-0005-0009-roadmap.md`
- Push docs task: riuscito (HEAD locale post-docs = `973a44b` pre-autosync)

## git status --short (dopo docs commit, prima autosync)

```
(clean docs tree; solo artefatti autosync in staging successivo)
```

Monolite: **non** modificato / **non** incluso nel commit docs né nell’autosync.

## Funzionalità chiuse

- `routingFmtRouteStatusMessage` restituisce solo `routing.routeReady` («Percorso pronto»)
- Metriche distanza/tempo/dislivelli restano nelle card
- Messaggi operativi / loading / errori / save invariati
- Nessuna modifica CSS/markup card

## Backlog UX (non aperti / non implementati)

1. OUTDOOR-ROUTING-POINT-UNDO-A
2. OUTDOOR-ROUTING-UNITS-A
3. ROUTING-PROFILE-EDIT-A
4. TRACK-PROFILE-POINTS-DISPLAY-A
5. MAP-CENTER-VIEWPORT-AWARE-A
6. QA-OPERATOR-IT-ONLY-PREF
7. Bundle F

## QA

- Provenienza: operatore
- Ambiente: VPS Tailscale `http://100.114.7.53:8000/...html?v=58197bb`, UI italiana
- Risultato: PASS (status senza metriche duplicate; card metriche OK)

## Limiti

- Fatti del commit autosync corrente: **EXTERNAL_ONLY** (SHA/push/HEAD finale non autorati qui)
- WU-0010 resta OPEN (Bundle F futuro)

## Prossimo passo

Candidati: OUTDOOR-ROUTING-POINT-UNDO-A / UNITS-A / ROUTING-PROFILE-EDIT-A / TRACK-PROFILE-POINTS-DISPLAY-A / MAP-CENTER-VIEWPORT-AWARE-A / Bundle F.
