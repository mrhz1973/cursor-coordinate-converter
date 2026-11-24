# P0 — verifica contesto browser richiesto

UTC: 2026-11-24T23:27:48.673Z. Base verificata c59fb6809304239d59027016642c62a6fb3ea91d. Build329 CLOSED; runtime SHA256 2d5371cbd446424a0db98d0d907631b651e964c181ffa2d7ca8d02f43e7c52b2 invariato.

- Esito corrente: Browser.list_tabs non disponibile: «Browser access requires the originating browser context. Open ChatGPT in the browser with the connected extension and try again.»
- Nessun tab acquisito; nessuna lettura/scrittura storage, backup corrente, migrazione, pulizia, accesso a contenuti archivio o nuovo deploy. Nessun cambio browser per aggirare il blocco.
- Qualificazione sulle copie riusata, non ripetuta: [report](../2026-11-21-edge-owned-roundtrip/REPORT.md). Precedente blocco: [accesso browser](../2026-11-22-internal-browser-operator-access/REPORT.md).
- Stato invariato: APPLICATION_AUTHORIZED_NOT_EXECUTED / AGENT_BROWSER_CONTEXT_UNAVAILABLE / CURRENT_BACKUP_PENDING / WRITER_INVENTORY_INCOMPLETE. P1/P2/P3/P4 CLOSED. DTM HOLD.
- NEXT: ripristinare il contesto del browser effettivo richiesto; acquisire identita della sorgente/destinazione, inventario istanze scriventi e backup completo verificato, prima di qualsiasi applicazione. Nessuna Build330 aperta.
