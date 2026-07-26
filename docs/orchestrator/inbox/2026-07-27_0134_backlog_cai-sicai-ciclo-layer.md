# Backlog — CAI-SICAI-CICLO-LAYER-A

**Data:** 2026-07-27 01:34 Europe/Rome  
**Tipo:** docs-only / registrazione backlog  
**Stato:** **BACKLOG / NON APERTO**  
**Priorità:** da valutare dopo i blocchi runtime correnti  
**Runtime:** invariato; nessuna modifica al monolite

## Obiettivo

Valutare l'integrazione nel GOI GIS Tool del percorso **Sentiero Italia CAI Cicloescursionismo** pubblicato nel visualizzatore Lizmap/QGIS Server del CAI.

Sorgente operatore:

- `https://sentieroitaliamappe.cai.it/index.php/view/map?repository=sicaipubblico&project=SICAI_ciclo`
- layer visibile di interesse: **SICAI Ciclo - SUD/NORD**

## Ipotesi tecnica da verificare

Prima opzione candidata:

- overlay **WMS online e opt-in**, mantenendo la simbologia pubblicata dal CAI.

Opzione secondaria, solo se esposta e riutilizzabile:

- accesso **WFS** alla geometria vettoriale e agli attributi.

Endpoint candidati, non ancora assunti come contratto stabile:

```text
https://sentieroitaliamappe.cai.it/index.php/lizmap/service/?repository=sicaipubblico&project=SICAI_ciclo&SERVICE=WMS&REQUEST=GetCapabilities
https://sentieroitaliamappe.cai.it/index.php/lizmap/service/?repository=sicaipubblico&project=SICAI_ciclo&SERVICE=WFS&REQUEST=GetCapabilities
```

## Verifiche obbligatorie prima dell'apertura runtime

1. Recuperare e leggere le capabilities WMS/WFS correnti.
2. Identificare il `Name` tecnico esatto del layer, non solo il titolo UI.
3. Confermare disponibilità WMS e, separatamente, WFS.
4. Verificare CRS supportati, in particolare `EPSG:3857` e/o strategia compatibile con il motore mappa esistente.
5. Verificare CORS dal browser e comportamento da `file://`, localhost e VPS tailnet.
6. Verificare limiti di scala, dimensioni richiesta, rate limit e stabilità endpoint.
7. Chiarire licenza, attribuzione, riuso, redistribuzione e autorizzazione alla cache/offline.
8. Verificare se `GetFeatureInfo` è disponibile e utile.
9. Stabilire se il layer deve essere solo visuale WMS o importabile come vettore.

## Vincoli GOI GIS Tool

- singolo file HTML standalone; vanilla JS; nessuna dipendenza runtime aggiuntiva;
- layer classificato `external: "internet"` o equivalente coerente con il catalogo corrente;
- disattivato per default e attivato solo dall'operatore;
- nessuna richiesta automatica all'avvio;
- `state.opsecStrict` e `state.forceOffline` devono bloccare ogni fetch del layer;
- nessun bypass di `tileFetchAllowed`/gate rete senza decisione esplicita;
- niente cache o download massivo finché licenza e condizioni d'uso non sono confermate;
- attribuzione CAI sempre visibile quando il layer è attivo;
- i18n IT/EN/FR per ogni stringa UI;
- nessun refactor generale del motore tile o dello state model.

## Fuori scope della registrazione

- nessuna implementazione;
- nessun test invasivo o download massivo;
- nessun deploy;
- nessuna modifica a `coordinate_converter Claude.html`;
- nessuna decisione definitiva WMS vs WFS;
- nessuna autorizzazione implicita alla cache offline.

## Gate di apertura futuro

Aprire un blocco diagnostico read-only dedicato solo dopo aver chiuso il lavoro runtime corrente. L'output dovrà produrre:

- capabilities salvate o riassunte;
- nome layer e CRS;
- prova CORS;
- condizioni di licenza/attribuzione;
- proposta minimale di integrazione;
- classificazione OPSEC/cache;
- piano QA e decisione GO / NO-GO.
