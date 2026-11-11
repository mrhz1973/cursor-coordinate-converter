# LAST_CURSOR_REPORT — pass GPT, Waypoint Build 289 LIVE

Filename storico. GPT tramite TMAR Desktop Commander Win su AsusDesktop; fonte LIVE: [FRONTIER](../FRONTIER.md).

## A. Header
BLOCK: GIS-WAYPOINT-CLOSE-UNSAVED-A OPEN.
GATE: QA OPERATORE DESKTOP PENDING.
NEXT: Waypoint chiude dal proprio pulsante e X senza dati; con coordinate o waypoint posizionati non salvati compare conferma, Annulla conserva bozza e Scarta chiude.
RUNTIME: Build 289 source 214e6ea248f4d390bfd1c79b12b95123f93642f0; blob 6a4a2639e6b2a205ee26ab38778e5b85b3ad6d0b; SHA256 19be22d478262c6ad7f1dbb9ef4c7a0706a8d58bf2a39236fb02750129e45107; bytes 11.116.484.
REVIEW GPT routine 20/20 PASS, DEPLOY GIS-only e backup 288 PASS, ABQA HTTPS nativa 25/25 PASS, zero POST.
TELEFONO: PAUSA. FIX3 toolbar 288 QA non conclusa; redesign estetico alto/basso backlog.

## B. Evidenza
La Build 288 attivava automaticamente pickMode su apertura Waypoint, interpretato erroneamente come modifica non salvata. Inoltre il pulsante Waypoint con pannello aperto rilanciava Nuovo waypoint invece di chiudere. La 289 rimuove solo il false positive, conserva verifica trackWaypointDraft/editor dirty e usa requestWaypointModalClose sul pulsante. Test nativi 25/25 PASS. Un contratto deterministico sullo stato di punto posizionato e stato testato 32/32 nella candidata; clic reale sulla mappa non validato dal primo harness, non millantare PASS di tale percorso. Nessun dato salvato nei test; servizi esterni bloccati.

Autosync F3: latest, singola inbox e LAST; senza autocitazione HEAD finale.
real_task_commit=d1a11c117e8d6f7ea0d045f88fa239b54f8abdb6; current_report_container=PENDING_SELF_REFERENCE; final_remote_head_after_report_push=EXTERNAL_ONLY.

[Evidence](../orchestrator/evidence/2026-11-11-waypoint-close-289/REPORT.md).
