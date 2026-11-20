(() => {
  "use strict";
  function sha256(bytes) {
    const K = [
      0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
      0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
      0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
      0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
      0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
      0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
      0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
      0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
    ];
    const h = new Uint32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]);
    const padded = new Uint8Array(Math.ceil((bytes.length + 9) / 64) * 64);
    padded.set(bytes);
    padded[bytes.length] = 0x80;
    const view = new DataView(padded.buffer);
    view.setUint32(padded.length - 8, Math.floor(bytes.length / 0x20000000));
    view.setUint32(padded.length - 4, (bytes.length * 8) >>> 0);
    const w = new Uint32Array(64);
    const r = (x, n) => (x >>> n) | (x << (32 - n));
    for (let offset = 0; offset < padded.length; offset += 64) {
      for (let t = 0; t < 16; t++) w[t] = view.getUint32(offset + t * 4);
      for (let t = 16; t < 64; t++) {
        const x = w[t - 15], y = w[t - 2];
        w[t] = w[t - 16] + (r(x,7)^r(x,18)^(x>>>3)) + w[t - 7] + (r(y,17)^r(y,19)^(y>>>10));
      }
      let [a,b,c,d,e,f,g,z] = h;
      for (let t = 0; t < 64; t++) {
        const t1 = (z + (r(e,6)^r(e,11)^r(e,25)) + ((e&f)^((~e)&g)) + K[t] + w[t]) >>> 0;
        const t2 = ((r(a,2)^r(a,13)^r(a,22)) + ((a&b)^(a&c)^(b&c))) >>> 0;
        z=g; g=f; f=e; e=(d+t1)>>>0; d=c; c=b; b=a; a=(t1+t2)>>>0;
      }
      [a,b,c,d,e,f,g,z].forEach((v,i) => { h[i] = h[i] + v; });
    }
    return Array.from(h, v => v.toString(16).padStart(8,"0")).join("");
  }
  const origine = location.origin, copertura = "INDEXEDDB_TILES_ONLY";
  const nome = "CoordConvMapTiles", versione = 1, storeName = "tiles";
  const MAX_RECORDS = 150000, MAX_BINARI = 64*1024*1024, MAX_TESTO_UTF16 = 4*1024*1024;
  const termine = performance.now() + 60000;
  let terminato = false, db = null, tx = null, timer;
  let records = [], byteBinari = 0, byteTesto = 0, conteggio = null, cursoreFinito = false;
  const chiaviViste = new Set();

  function chiudi(connessione) { try { connessione.close(); } catch {} }
  function termina(esito, dettagli = {}) {
    if (terminato) return;
    terminato = true;
    if (timer !== undefined) clearTimeout(timer);
    if (tx) { try { tx.abort(); } catch {} tx = null; }
    if (db) { chiudi(db); db = null; }
    records = [];
    chiaviViste.clear();
    console.log(JSON.stringify({origine, copertura, esito, ...dettagli}));
  }
  function scaduto() {
    if (terminato) return true;
    if (performance.now() >= termine) { termina("STOP_TIMEOUT"); return true; }
    return false;
  }
  function base64(bytes) {
    let testo = "";
    for (let i = 0; i < bytes.length; i += 32768)
      testo += String.fromCharCode(...bytes.subarray(i, i + 32768));
    return btoa(testo);
  }
  function scarica() {
    let url, link;
    try {
      if (scaduto()) return;
      const acquisitoUTC = new Date().toISOString();
      const contenuto = {
        formato: "TMAR-GIS-P0-IDB-TILES-V1", origine, acquisitoUTC, copertura,
        database: {name:nome, version:versione},
        store: {name:storeName, keyPath:null, autoIncrement:false, indexes:[]},
        transactionMode: "readonly", numeroRecords:records.length, byteBinari, records
      };
      const bytes = new TextEncoder().encode(JSON.stringify(contenuto) + "\n");
      if (scaduto()) return;
      const impronta = sha256(bytes);
      if (scaduto()) return;
      const file = "TMAR-GIS-P0-HTTPS-IndexedDB-" + acquisitoUTC.replace(/[-:.]/g, "") + ".json";
      url = URL.createObjectURL(new Blob([bytes], {type:"application/json"}));
      link = document.createElement("a");
      link.href = url; link.download = file; link.style.display = "none";
      document.body.appendChild(link);
      if (scaduto()) return;
      link.click();
      termina("DOWNLOAD_AVVIATO", {file, byte:bytes.length, sha256:impronta, records:conteggio, byteBinari});
    } catch { termina("STOP_EXPORT_NON_COMPLETATO"); }
    finally {
      if (link) { try { link.remove(); } catch {} }
      if (url) setTimeout(() => URL.revokeObjectURL(url), 60000);
    }
  }
  function acquisisci(connessione) {
    db = connessione;
    db.onversionchange = () => termina("STOP_VERSIONE_VARIATA");
    db.onclose = () => termina("STOP_CHIUSURA_ANOMALA");
    try {
      if (scaduto()) return;
      const stores = Array.from(db.objectStoreNames);
      if (db.name !== nome || db.version !== versione || stores.length !== 1 || stores[0] !== storeName)
        return termina("STOP_SCHEMA_DATABASE_INATTESO");
      tx = db.transaction([storeName], "readonly");
      tx.onabort = () => termina("STOP_TRANSAZIONE_ABORTITA");
      tx.onerror = () => termina("STOP_ERRORE_TRANSAZIONE");
      tx.oncomplete = () => {
        tx = null;
        if (scaduto()) return;
        if (!cursoreFinito || conteggio === null || conteggio !== records.length)
          return termina("STOP_CONTEGGI_NON_COINCIDENTI");
        const conclusa = db;
        db = null;
        try {
          conclusa.onversionchange = null;
          conclusa.onclose = null;
          conclusa.close();
        } catch { chiudi(conclusa); return termina("STOP_CHIUSURA_DB_NON_CONFERMATA"); }
        scarica();
      };
      const store = tx.objectStore(storeName);
      if (store.keyPath !== null || store.autoIncrement !== false || store.indexNames.length !== 0)
        return termina("STOP_SCHEMA_STORE_INATTESO");
      const countRequest = store.count(), cursorRequest = store.openCursor();
      countRequest.onerror = () => termina("STOP_ERRORE_CONTEGGIO");
      countRequest.onsuccess = () => {
        if (scaduto()) return;
        const n = countRequest.result;
        if (!Number.isSafeInteger(n) || n < 0) return termina("STOP_CONTEGGIO_NON_VALIDO");
        if (n > MAX_RECORDS) return termina("STOP_LIMITE_RECORDS");
        conteggio = n;
      };
      cursorRequest.onerror = () => termina("STOP_ERRORE_CURSORE");
      cursorRequest.onsuccess = () => {
        if (scaduto()) return;
        try {
          const cursor = cursorRequest.result;
          if (cursor === null) { cursoreFinito = true; return; }
          const key = cursor.key, valore = cursor.value;
          if (typeof key !== "string" || cursor.primaryKey !== key || chiaviViste.has(key))
            return termina("STOP_CHIAVE_NON_SUPPORTATA");
          if (!valore || Object.getPrototypeOf(valore) !== Object.prototype)
            return termina("STOP_VALORE_NON_SUPPORTATO");
          const props = Reflect.ownKeys(valore);
          if (props.length !== 2 || !props.includes("b") || !props.includes("ct") ||
              !(valore.b instanceof ArrayBuffer) || typeof valore.ct !== "string")
            return termina("STOP_VALORE_NON_SUPPORTATO");
          const bytes = new Uint8Array(valore.b), testoAggiunto = 2*(key.length + valore.ct.length);
          if (records.length >= MAX_RECORDS) return termina("STOP_LIMITE_RECORDS");
          if (bytes.length > MAX_BINARI - byteBinari) return termina("STOP_LIMITE_BINARI");
          if (testoAggiunto > MAX_TESTO_UTF16 - byteTesto) return termina("STOP_LIMITE_TESTO");
          const impronta = sha256(bytes);
          if (scaduto()) return;
          const bBase64 = base64(bytes);
          if (scaduto()) return;
          records.push({key, ct:valore.ct, bBase64, byteLength:bytes.length, sha256:impronta});
          chiaviViste.add(key);
          byteBinari += bytes.length; byteTesto += testoAggiunto;
          cursor.continue();
        } catch { termina("STOP_ERRORE_ACQUISIZIONE_RECORD"); }
      };
    } catch { termina("STOP_ERRORE_APERTURA_TRANSAZIONE"); }
  }

  if (origine !== "https://ionos-n8n-new.tailc01234.ts.net") return termina("STOP_ORIGINE_INATTESA");
  timer = setTimeout(() => termina("STOP_TIMEOUT"), 60000);
  try {
    const idb = globalThis.indexedDB;
    if (!idb || typeof idb.databases !== "function") return termina("STOP_API_CATALOGO_NON_DISPONIBILE");
    Promise.resolve(idb.databases()).then(elenco => {
      if (scaduto()) return;
      try {
        if (Array.isArray(elenco) && elenco.length === 0)
          return termina("DATABASE_ABSENT", {
            copertura:"IDB_CATALOGO_ONLY", numeroDatabase:0,
            databaseAtteso:nome, versioneRichiesta:versione, attesoPresente:false, attesoVersione:null,
            apertureDatabase:0, file:null, completeOriginBackup:false, acquisitoUTC:new Date().toISOString()
          });
        if (!Array.isArray(elenco) || elenco.length !== 1 ||
            !elenco[0] || elenco[0].name !== nome || elenco[0].version !== versione)
          return termina("STOP_CATALOGO_VARIATO_O_INATTESO");
        const richiesta = idb.open(nome, versione);
        richiesta.onupgradeneeded = () => {
          let abortito = false;
          try { richiesta.transaction.abort(); abortito = true; } catch {}
          try { chiudi(richiesta.result); } catch {}
          termina(abortito ? "STOP_UPGRADE_CREAZIONE_ABORTITO" : "STOP_ABORT_UPGRADE_NON_CONFERMATO");
        };
        richiesta.onblocked = () => termina("STOP_APERTURA_BLOCCATA");
        richiesta.onerror = () => termina("STOP_ERRORE_APERTURA_DB");
        richiesta.onsuccess = () => {
          try {
            const connessione = richiesta.result;
            if (terminato) { chiudi(connessione); return; }
            acquisisci(connessione);
          } catch { termina("STOP_ERRORE_CONNESSIONE_DB"); }
        };
      } catch { termina("STOP_ERRORE_CATALOGO_O_APERTURA"); }
    }, () => termina("STOP_ERRORE_ENUMERAZIONE"));
  } catch { termina("STOP_ERRORE_ACCESSO_API"); }
})()
