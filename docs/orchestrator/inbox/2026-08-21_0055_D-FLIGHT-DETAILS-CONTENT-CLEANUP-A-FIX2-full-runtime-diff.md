# D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX2 — FULL RUNTIME DIFF

## Confirmed

| Key | Value |
|---|---|
| BASE | `d67d37f75e89a1f522f778424d4c7175dd316bdb` |
| CANDIDATE | `d899cff2c7ac24f1b9bba3eb99d10e08d2442b25` |
| BLOB | `c36109d1ebda7470748a3284089bf11b262d01cf` |
| BUILD | 238 / `D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX2` |

```text
git diff d67d37f75e89a1f522f778424d4c7175dd316bdb..d899cff2c7ac24f1b9bba3eb99d10e08d2442b25 -- "coordinate_converter Claude.html"
```

## --numstat
```text
69	11	coordinate_converter Claude.html
```

## --stat
```text
coordinate_converter Claude.html | 80 ++++++++++++++++++++++++++++++++++------
 1 file changed, 69 insertions(+), 11 deletions(-)
```

## --check
```text
(empty — PASS)
```

## FULL DIFF

```diff
diff --git a/coordinate_converter Claude.html b/coordinate_converter Claude.html
index 4d8c2b3..c36109d 100644
--- a/coordinate_converter Claude.html	
+++ b/coordinate_converter Claude.html	
@@ -24305,10 +24305,10 @@ const UI_STORAGE_KEY = "coordconv_ui_v1";
 /** Strong-confirm word for full local wipe (same in IT/EN/FR UI). */
 const APP_FULL_RESET_CONFIRM_WORD = "CANCELLA";
 /** Visible runtime build label ÔÇö update before each runtime `finito`. */
-const APP_BUILD_ID = "D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX1";
-const APP_BUILD_DETAIL = "Dettagli zona: normalizza anche markup entity-encoded (bounded decode+strip).";
+const APP_BUILD_ID = "D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX2";
+const APP_BUILD_DETAIL = "ATM09 Dettagli: Rule/Regola display-only (reuse helper 237; keep link text/URL).";
 /** Monotonic runtime build counter ÔÇö increment on each runtime patch (not persisted). */
-const APP_BUILD_NUM = 237;
+const APP_BUILD_NUM = 238;
 const APP_BUILD_LABEL = APP_BUILD_ID + " ┬À build " + APP_BUILD_NUM + " ÔÇö " + APP_BUILD_DETAIL;
 function applyAppBuildLabel(){
   try {
@@ -36848,6 +36848,15 @@ function dflightDetailsMarkupPass(s){
   s = s.replace(/<\s*\/\s*(div|tr|h[1-6]|li)\s*>/gi, "\n");
   s = s.replace(/<\s*(div|tr|h[1-6])\b[^>]*>/gi, "");
   s = s.replace(/<\s*li\b[^>]*>/gi, "\u2022 ");
+  /* Anchors: keep link text + href URL when useful (display-only). */
+  s = s.replace(/<\s*a\b([^>]*)>([\s\S]*?)<\s*\/\s*a\s*>/gi, function(_m, attrs, inner){
+    let href = "";
+    const am = String(attrs || "").match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
+    if (am) href = String(am[1] || am[2] || am[3] || "").trim();
+    let t = String(inner == null ? "" : inner).replace(/<[^>]+>/g, "").trim();
+    if (href && t && t.indexOf(href) < 0) return t + " " + href;
+    return t || href || "";
+  });
   /* Strip remaining tags; remove leftover angle brackets. */
   s = s.replace(/<[^>]+>/g, "");
   s = s.replace(/[<>]/g, "");
@@ -38648,6 +38657,52 @@ function dflightSelfTestCDE(){
     add("DC_markup_pass_helper", typeof dflightDetailsMarkupPass === "function");
     add("DC_open_wired", String(dflightOpenDetailsPanel).indexOf("dflightDetailsDisplayText") >= 0
       && String(dflightBuildDetailsHtml).indexOf("dflightDetailsEscDisplay") >= 0);
+    add("DC_ATM09_open_wired", String(dflightAtm09OpenDetails).indexOf("dflightDetailsDisplayText") >= 0);
+    add("DC_ATM09_rule_literal", (function(){
+      const raw = "<p align='justify'><b>Within the geographic area</b><br>"
+        + "<a target='_blank' href='https://www.enac.gov.it'>AIP ITALIA ENR 5.6.1</a></p>";
+      const t = dflightDetailsDisplayText(raw);
+      return t.indexOf("Within the geographic area") >= 0
+        && t.indexOf("AIP ITALIA ENR 5.6.1") >= 0
+        && t.indexOf("www.enac.gov.it") >= 0
+        && t.indexOf("<p") < 0 && t.indexOf("<b") < 0 && t.indexOf("<a") < 0
+        && t.indexOf("href=") < 0 && t.indexOf("target=") < 0 && t.indexOf("align=") < 0;
+    })());
+    add("DC_ATM09_rule_encoded", (function(){
+      const t = dflightDetailsDisplayText("&lt;p&gt;UAS operations are prohibited&lt;br&gt;OK&lt;/p&gt;");
+      return t.indexOf("UAS operations are prohibited") >= 0 && t.indexOf("OK") >= 0
+        && t.indexOf("<p") < 0 && t.indexOf("&lt;") < 0;
+    })());
+    add("DC_ATM09_panel_sink", (function(){
+      if (typeof dflightAtm09OpenDetails !== "function") return false;
+      const feat = { properties: {
+        id: 545212, name: "PARCO NAZIONALE DELLE 5 TERRE (SP)", type: "ATM03", subtype: "NATURE",
+        rule: "<p><b>Within the geographic area</b> UAS operations are prohibited "
+          + "<a href='https://www.enac.gov.it'>AIP ITALIA ENR 5.6.1</a></p>",
+        regola: "&lt;p&gt;Regola test &lt;b&gt;X&lt;/b&gt;&lt;/p&gt;"
+      }};
+      const rawRule = feat.properties.rule;
+      const rawRegola = feat.properties.regola;
+      dflightAtm09OpenDetails(feat);
+      const body = document.getElementById("dflightDetailsPanelBody");
+      const text = body ? (body.textContent || "") : "";
+      const bad = body ? body.querySelectorAll("img,script,iframe,style,link,a") : [];
+      let onLeak = false;
+      if (body) body.querySelectorAll("*").forEach(function(el){
+        for (let i = 0; i < (el.attributes || []).length; i++){
+          if (/^on/i.test(el.attributes[i].name)) onLeak = true;
+        }
+      });
+      const okText = text.indexOf("Within the geographic area") >= 0
+        && text.indexOf("UAS operations are prohibited") >= 0
+        && text.indexOf("AIP ITALIA ENR 5.6.1") >= 0
+        && text.indexOf("www.enac.gov.it") >= 0
+        && text.indexOf("Regola test") >= 0 && text.indexOf("X") >= 0
+        && text.indexOf("<p") < 0 && text.indexOf("href=") < 0;
+      const okRaw = feat.properties.rule === rawRule && feat.properties.regola === rawRegola;
+      try { if (typeof dflightCloseDetailsPanel === "function") dflightCloseDetailsPanel(); } catch(_){}
+      return okText && okRaw && bad.length === 0 && !onLeak;
+    })());
     // restore
     _dflightOverlayVisible = prevVis;
     _dflightOverlaySession = prevSess;
@@ -39851,8 +39906,8 @@ function dflightSelfTestF(){
     })());
 
     add("F_mvisa_build_199",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 237
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX1");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 238
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX2");
 
     _dflightHelperBaseUrlOverride = "http://example.test:8010";
     if (typeof state !== "undefined") state.forceOffline = true;
@@ -40873,8 +40928,8 @@ function dflightSelfTestTf(){
       && String(dflightEnsurePanelGeometryResize).indexOf("dflightSyncAdaptivePanelGeometry") >= 0);
 
     add("Tf_build_196",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 237
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX1");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 238
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX2");
   } catch (e){
     add("selftest_tf_exception", false, String(e && e.message ? e.message : e));
   } finally {
@@ -42112,7 +42167,10 @@ function dflightAtm09OpenDetails(feat){
   const dlg = document.getElementById("dflightDetailsPanel");
   if (!body || !dlg) return;
   _dflightAtm09SelectedId = p.id != null ? String(p.id) : (feat.id != null ? String(feat.id) : null);
-  if (title) title.textContent = p.name ? String(p.name) : ("ATM09 ┬À " + (_dflightAtm09SelectedId || "ÔÇö"));
+  if (title){
+    const nm = (p.name != null) ? dflightDetailsDisplayText(p.name) : "";
+    title.textContent = nm || ("ATM09 ┬À " + (_dflightAtm09SelectedId || "ÔÇö"));
+  }
   const rows = [
     ["ID", p.id],
     ["Nome", p.name],
@@ -42138,7 +42196,7 @@ function dflightAtm09OpenDetails(feat){
     const dt = document.createElement("dt");
     dt.textContent = k;
     const dd = document.createElement("dd");
-    dd.textContent = String(v);
+    dd.textContent = dflightDetailsDisplayText(v);
     dl.appendChild(dt);
     dl.appendChild(dd);
   }
@@ -42804,8 +42862,8 @@ function dflightSelfTestH(){
       } catch(_){ return false; }
     })());
 
-    add("H_build_214", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 237
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX1");
+    add("H_build_214", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 238
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX2");
     add("VR_FIX1_sync_loading_passes_zoom", (function(){
       if (typeof dflightSyncLoadingUi !== "function") return false;
       const src = String(dflightSyncLoadingUi);
```
