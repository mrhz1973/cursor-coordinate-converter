# Handoff operativo — POLY-PARITY-P1 QA FAIL operatore

**Data:** 2026-06-23  
**Repo:** `mrhz1973/cursor-coordinate-converter`  
**Runtime P1:** `7a668d7b0fe745e1b86fa99af8ae9bdeef6e7e86`  
**HEAD prima di questo handoff:** `1f938b045e3467ff05340ff688df176901afd8db`  
**APP_BUILD_ID:** `B5.5Z`  
**Deploy VPS:** non eseguito  
**Stato:** review byte P1 PASS; QA operatore P1 FAIL; nessun rollback

## Contesto

POLY-PARITY-P1 ha aggiunto alla barra edit poligono:

- nome modificabile e salvabile;
- numero vertici;
- area;
- perimetro;
- unità;
- dettaglio lati con distanza e bearing, incluso closing leg;
- stato transiente nome + dirty composito;
- Salva con una sola `gisFeatureUpdate(id,{geometry,properties})`;
- Annulla senza toccare il canonico;
- nessun timestamp/sanitizer modificato.

La review byte sul commit `7a668d7` è PASS:

- una sola `gisFeatureUpdate` nel percorso Salva;
- proprietà canoniche preservate e modificato solo `name`;
- nessun `saveStore` diretto;
- nessun timestamp toccato;
- `_polyEdit` conservato su fallimento e azzerato solo su successo.

## Esito QA operatore

**QA WU-0006 POLY-PARITY-P1: FAIL operatore.**

### Parti funzionanti verificate

- Input nome valorizzato entrando in Modifica.
- Numero vertici, area, perimetro e lista lati visibili.
- Closing leg presente come `N → 1 (chiusura)`.
- Cambio nome + Annulla: il nome canonico resta invariato.
- Cambio nome + Salva: il nome viene aggiornato nella lista.
- Reload: il nome salvato persiste.

### Problemi reali riscontrati

1. **Chiave i18n grezza mostrata come nome predefinito**
   - UI mostrava `gis.polygonPanel.defaultName` nel titolo, nell’input e nella lista.
   - Il problema riguarda almeno i poligoni creati con il nome predefinito storico.

2. **Formattazione unità errata**
   - Esempio visibile: `4.335k m` invece di `4.335 km` oppure `4335 m`.
   - La riga `Unità: m` risultava incoerente con area in km² e perimetro in km.
   - Va riusato correttamente il formatter reale, senza concatenare abbreviazioni incompatibili.

3. **Barra errore rossa vuota visibile**
   - `#polygonPanelEditErr` appare come fascia rossa senza messaggio.
   - Deve restare realmente nascosta quando non c’è errore.

4. **Testo tecnico esposto all’utente**
   - Visibile: `Vertici visibili; trascinamento nel blocco successivo.`
   - Va sostituito con testo operativo neutro o rimosso.

5. **Riapertura Modifica bloccata dopo Salva/reload**
   - Premendo `Modifica` non accadeva nulla.
   - Premendo `Esc`, il pulsante tornava a funzionare.
   - Possibile stato transiente/modalità disegno/focus/overlay non ripulito o blocco `polygonDrawMode` rimasto attivo.
   - Serve diagnosi mirata prima del fix; non assumere la causa.

6. **Percezione lista incompleta chiarita**
   - Alcune geometrie poligonali visibili sulla mappa non comparivano nella lista Poligoni.
   - Verifica operatore: erano poligoni appartenenti a **Tracce**, non a `state.gisPolygons`.
   - Non è perdita dati GIS e non va fuso lo storage.
   - Resta un debito UX: sorgente delle geometrie visibili poco distinguibile, ma non è il bug principale P1-FIX.

## Decisione operativa

Non procedere con:

- P8 resize;
- P2 drag vertici;
- deploy della runtime P1;
- chiusura PASS di P1.

Aprire prima un blocco localizzato:

**POLY-PARITY-P1-FIX — correzione QA FAIL P1**

Scope atteso:

- risoluzione/fallback sicuro del nome predefinito i18n storico;
- correzione formatter area/perimetro/lati/unità;
- barra errore realmente hidden senza errore;
- rimozione del testo tecnico;
- diagnosi e fix della riapertura `Modifica` che richiede `Esc`;
- nessun drag vertici;
- nessun resize;
- nessun timestamp/sanitizer;
- nessuna fusione tra poligoni GIS e poligoni Tracce.

## Ordine dei blocchi dopo il fix

1. P1-FIX e QA operatore PASS.
2. P8 resize modal Poligoni.
3. P2 drag vertici.
4. P3 cancellazione vertice.
5. P4 traslazione intero poligono.
6. P6 cancellazione intero poligono.
7. P7 metadata data legacy-safe.
8. P5 parità creazione.

## Regole dati invarianti

- `state.gisPolygons` resta canonico.
- `state._polyEdit` resta transiente e fuori da `saveStore`.
- Durante edit/drag futuro cambia solo `_polyEdit.working`.
- Salva = una sola `gisFeatureUpdate`.
- Annulla scarta `_polyEdit`.
- Nessuna persistenza durante pointermove.
- `APP_BUILD_ID B5.5Z` invariato salvo decisione separata.

## Istruzioni per la prossima sessione

1. Leggere il read-set vivo:
   - `README.md`
   - `docs/OPERATING_MEMORY.md` §7
   - `docs/work-units/WU-0005-0009-roadmap.md`
2. Leggere questo handoff.
3. Verificare `origin/main` e working tree.
4. Preparare prima una diagnosi localizzata del bug `Modifica`/`Esc` se i byte non rendono la causa evidente.
5. Implementare solo P1-FIX.
6. Eseguire review byte e una sola QA operatore completa prima di proseguire.

## Frontiera

`POLY-PARITY-P1 — review byte PASS; QA operatore FAIL; prossimo blocco P1-FIX; nessun deploy`
