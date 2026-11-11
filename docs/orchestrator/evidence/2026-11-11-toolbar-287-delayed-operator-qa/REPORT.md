# Attestazione operatore tardiva — GIS Toolbar FIX2, Build 287

**Data ricezione:** 11 novembre 2026. **Tipo evidenza:** dichiarazione esplicita in chat, non nuovo collaudo automatizzato, non ritorno alla versione storica.

## Attestazione ricevuta

`QA GIS-DESKTOP-RIGHT-TOOLBAR-LABELS-A-FIX2 PASS operatore`

Si registra la riga esatta, riferita al blocco `GIS-DESKTOP-RIGHT-TOOLBAR-LABELS-A-FIX2` e alla Build **287** (source `d69a21a1cb3f09828a51b342c91bec50f2e88380`, SHA-256 runtime `fdb28dd544a4f138b4e249b6fbc1d2257029e9fecff0fa5fd93fddf27fc559db`). La verifica di utente è attestazione umana, distinta dalla QA automatizzata 60/60 e dai gate tecnici registrati originariamente per la 287.

## Riconciliazione con lo stato successivo

Al momento della ricezione l'HEAD canonica è `064b3cde41185eefa58fbdc767ee3c1d65b078fb`; runtime LIVE Build **290**, SHA-256 `7d69fc145779f223c570e9596e23b497ab678329d4b495ebc03567301f010e69`, servizio GIS attivo. In precedenza la 287 era stata superata dalla richiesta successiva di **orientamento verticale, non orizzontale**, documentata nella Build 288, e poi dal restyling 290. Il rapporto 288 diceva correttamente che **al tempo** la QA operatore 287 non era ancora stata approvata. La ricezione postuma non cambia tale cronologia.

**Decisione di stato:** attribuire il PASS esclusivamente alla 287 come evidenza tardiva; non reinterpretarlo come approvazione del layout attualmente LIVE, non chiudere il gate aperto 290, non alterare geometria/stile delle toolbar più recenti, non avviare rollback o deploy. La regola H non va applicata al blocco LIVE 290 sulla base di un ID di QA differente.

## Gate che rimane aperto

`GIS-DESKTOP-TOOLBAR-DUAL-GROUPS-A` — QA OPERATORE DESKTOP, **PENDING**. L'operatore dovrà valutare i gruppi di navigazione blu in alto e strumenti verde acqua in basso, Livelli allineato e GPS/Nuovo punto sopra il footer. L'esatto eventuale trigger successivo è `QA GIS-DESKTOP-TOOLBAR-DUAL-GROUPS-A PASS operatore`.

Questa registrazione è docs-only. Nessun runtime, processo, servizio, OPSEC, GPS, dati o mobile modificato.

[FRONTIER](../../../FRONTIER.md) · [Report Build 287 originale](../2026-11-11-desktop-toolbar-287/REPORT.md) · [Report Build 290](../2026-11-11-toolbar-dual-groups-290/REPORT.md).
