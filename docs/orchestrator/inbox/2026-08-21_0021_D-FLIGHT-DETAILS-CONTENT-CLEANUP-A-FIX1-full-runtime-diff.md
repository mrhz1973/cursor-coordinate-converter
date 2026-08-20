# D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX1 — FULL RUNTIME DIFF (evidence repair)

**Purpose:** Persist the complete runtime monolite diff on GitHub for REVIEW GPT-SOSTITUTIVA.
**Code edit:** none · **Runtime candidate:** immutable
**Generated:** evidence repair pass (docs-only)

## Confirmed identifiers

| Key | Value |
|---|---|
| BASE (main) | `8a9bd27b8a738b046ffbfde91318ec2d8b030969` |
| CANDIDATE_FULL_SHA | `8a350f7a9654fe1de0b6757c31ae39fa6c07ac05` |
| Parent | `8a9bd27b8a738b046ffbfde91318ec2d8b030969` |
| CANDIDATE_BLOB | `4d8c2b3a68c348b30c8683319c31df3cb01e138a` |
| CANDIDATE_BUILD | `237` |
| CANDIDATE_APP_BUILD_ID | `D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX1` |
| Review branch | `review/D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX1-237` |
| origin/main at evidence | `8a9bd27b8a738b046ffbfde91318ec2d8b030969` |
| origin push | `DISABLED_PUSH` |

Command:

```text
git diff 8a9bd27b8a738b046ffbfde91318ec2d8b030969..8a350f7a9654fe1de0b6757c31ae39fa6c07ac05 -- "coordinate_converter Claude.html"
```

## git diff --numstat

```text
153	16	coordinate_converter Claude.html
```

## git diff --stat

```text
coordinate_converter Claude.html | 169 +++++++++++++++++++++++++++++++++++----
 1 file changed, 153 insertions(+), 16 deletions(-)
```

## git diff --check

```text
(empty — PASS, no whitespace/conflict markers reported)
```

## FULL runtime diff (complete text)

```diff
diff --git a/coordinate_converter Claude.html b/coordinate_converter Claude.html
index d2b7e1c..4d8c2b3 100644
--- a/coordinate_converter Claude.html	
+++ b/coordinate_converter Claude.html	
@@ -24305,10 +24305,10 @@ const UI_STORAGE_KEY = "coordconv_ui_v1";
 /** Strong-confirm word for full local wipe (same in IT/EN/FR UI). */
 const APP_FULL_RESET_CONFIRM_WORD = "CANCELLA";
 /** Visible runtime build label ÔÇö update before each runtime `finito`. */
-const APP_BUILD_ID = "D-FLIGHT-CLOSE-CLEANUP-A-FIX1";
-const APP_BUILD_DETAIL = "Close X: teardown visual ATM09/zone sincrono immediato (no pan/timer); reopen no auto-reload.";
+const APP_BUILD_ID = "D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX1";
+const APP_BUILD_DETAIL = "Dettagli zona: normalizza anche markup entity-encoded (bounded decode+strip).";
 /** Monotonic runtime build counter ÔÇö increment on each runtime patch (not persisted). */
-const APP_BUILD_NUM = 235;
+const APP_BUILD_NUM = 237;
 const APP_BUILD_LABEL = APP_BUILD_ID + " ┬À build " + APP_BUILD_NUM + " ÔÇö " + APP_BUILD_DETAIL;
 function applyAppBuildLabel(){
   try {
@@ -36817,6 +36817,70 @@ function dflightEscHtml(s){
     .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
 }
 
+/**
+ * D-FLIGHT-DETAILS-CONTENT-CLEANUP-A ÔÇö DISPLAY-ONLY text for Dettagli zona.
+ * Strips markup to plain text, decodes entities, preserves useful newlines.
+ * Does NOT mutate raw zone fields. Does NOT execute HTML.
+ */
+function dflightDetailsDecodeEntities(s){
+  const t = String(s == null ? "" : s);
+  if (!t) return "";
+  /* Fail-closed: never feed angle brackets into an HTML sink. */
+  if (/[<>]/.test(t)) return t.replace(/[<>]/g, "");
+  try {
+    const ta = document.createElement("textarea");
+    ta.innerHTML = t;
+    return ta.value;
+  } catch(_){
+    return t;
+  }
+}
+function dflightDetailsMarkupPass(s){
+  s = String(s == null ? "" : s);
+  if (!s) return "";
+  /* Drop hostile/non-text containers entirely (content included). */
+  s = s.replace(/<\s*(script|style|iframe|object|embed|link|meta)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "");
+  s = s.replace(/<\s*(script|style|iframe|object|embed|link|meta)\b[^>]*\/?\s*>/gi, "");
+  /* Structural breaks to newline before tag strip. */
+  s = s.replace(/<\s*br\s*\/?\s*>/gi, "\n");
+  s = s.replace(/<\s*\/\s*p\s*>/gi, "\n");
+  s = s.replace(/<\s*p\b[^>]*>/gi, "");
+  s = s.replace(/<\s*\/\s*(div|tr|h[1-6]|li)\s*>/gi, "\n");
+  s = s.replace(/<\s*(div|tr|h[1-6])\b[^>]*>/gi, "");
+  s = s.replace(/<\s*li\b[^>]*>/gi, "\u2022 ");
+  /* Strip remaining tags; remove leftover angle brackets. */
+  s = s.replace(/<[^>]+>/g, "");
+  s = s.replace(/[<>]/g, "");
+  return s;
+}
+function dflightDetailsDisplayText(raw){
+  if (raw == null) return "";
+  let s = String(raw);
+  if (!s) return "";
+  s = s.replace(/\r\n?/g, "\n");
+  /* Bounded: markup strip then entity decode so entity-encoded markup is also normalized. */
+  const DFLIGHT_DETAILS_DISPLAY_MAX_PASSES = 4;
+  for (let pass = 0; pass < DFLIGHT_DETAILS_DISPLAY_MAX_PASSES; pass++){
+    const prev = s;
+    s = dflightDetailsMarkupPass(s);
+    s = dflightDetailsDecodeEntities(s);
+    if (s === prev) break;
+  }
+  /* Fail-closed residual angle brackets (should be rare after bounded passes). */
+  s = s.replace(/[<>]/g, "");
+  s = s.replace(/[ \t]+\n/g, "\n").replace(/\n[ \t]+/g, "\n");
+  s = s.replace(/\n{3,}/g, "\n\n");
+  s = s.replace(/[ \t]{2,}/g, " ");
+  return s.trim();
+}
+/** Escape for HTML structure sink; newlines become <br> after escape (safe). */
+function dflightDetailsEscDisplay(raw, fallback){
+  const fb = (fallback == null) ? "ÔÇö" : String(fallback);
+  const plain = dflightDetailsDisplayText(raw);
+  if (!plain) return dflightEscHtml(fb);
+  return dflightEscHtml(plain).replace(/\n/g, "<br>");
+}
+
 let _dflightOverlaySession = null; // { dataset }
 let _dflightOverlayVisible = false; // default OFF
 let _dflightSelectedZoneId = null;
@@ -37450,21 +37514,21 @@ function dflightBuildDetailsHtml(zone){
   const ts = zone.temporal_state || "UNKNOWN";
   const badgeCls = dflightTemporalBadgeClass(ts);
   const warnings = Array.isArray(zone.warnings) && zone.warnings.length
-    ? ("<p class=\"dflight-details-warnings\">" + dflightEscHtml(zone.warnings.join(", ")) + "</p>")
+    ? ("<p class=\"dflight-details-warnings\">" + dflightDetailsEscDisplay(zone.warnings.join(", ")) + "</p>")
     : "";
   return ""
-    + "<p class=\"dflight-details-meta\">" + dflightEscHtml(zone.name || "ÔÇö") + "</p>"
+    + "<p class=\"dflight-details-meta\">" + dflightDetailsEscDisplay(zone.name) + "</p>"
     + "<dl class=\"dflight-details-grid\">"
     + "<dt>" + dflightEscHtml(dflightScopedT("dflight.field.zoneId")) + "</dt><dd>" + dflightEscHtml(zone.zone_id || "ÔÇö") + "</dd>"
     + "<dt>" + dflightEscHtml(dflightScopedT("dflight.field.restriction")) + "</dt><dd>" + dflightEscHtml(restr) + "</dd>"
-    + "<dt>" + dflightEscHtml(dflightScopedT("dflight.field.reasons")) + "</dt><dd>" + dflightEscHtml(reasons) + "</dd>"
+    + "<dt>" + dflightEscHtml(dflightScopedT("dflight.field.reasons")) + "</dt><dd>" + dflightDetailsEscDisplay(reasons) + "</dd>"
     + "<dt>" + dflightEscHtml(dflightScopedT("dflight.field.zoneType")) + "</dt><dd>" + dflightEscHtml(zone.zone_type || "ÔÇö") + "</dd>"
     + "<dt>" + dflightEscHtml(dflightScopedT("dflight.field.temporal")) + "</dt><dd><span class=\"dflight-temporal-badge " + badgeCls + "\">" + dflightEscHtml(dflightTemporalLabel(ts)) + "</span></dd>"
     + "<dt>" + dflightEscHtml(dflightScopedT("dflight.field.applicability")) + "</dt><dd>" + dflightEscHtml(dflightFormatApplicability(zone.applicability)) + "</dd>"
     + "<dt>" + dflightEscHtml(dflightScopedT("dflight.field.volumes")) + "</dt><dd>" + vols.length + volHtml + "</dd>"
-    + "<dt>" + dflightEscHtml(dflightScopedT("dflight.field.message")) + "</dt><dd>" + dflightEscHtml(zone.message || "ÔÇö") + "</dd>"
-    + "<dt>" + dflightEscHtml(dflightScopedT("dflight.field.authority")) + "</dt><dd>" + dflightEscHtml(auth) + "</dd>"
-    + "<dt>" + dflightEscHtml(dflightScopedT("dflight.field.owner")) + "</dt><dd>" + dflightEscHtml(zone.owner_raw || "ÔÇö") + "</dd>"
+    + "<dt>" + dflightEscHtml(dflightScopedT("dflight.field.message")) + "</dt><dd>" + dflightDetailsEscDisplay(zone.message) + "</dd>"
+    + "<dt>" + dflightEscHtml(dflightScopedT("dflight.field.authority")) + "</dt><dd>" + dflightDetailsEscDisplay(auth) + "</dd>"
+    + "<dt>" + dflightEscHtml(dflightScopedT("dflight.field.owner")) + "</dt><dd>" + dflightDetailsEscDisplay(zone.owner_raw) + "</dd>"
     + "<dt>" + dflightEscHtml(dflightScopedT("dflight.field.sourceUrl")) + "</dt><dd>" + dflightEscHtml(zone.source_url || "ÔÇö") + "</dd>"
     + "<dt>" + dflightEscHtml(dflightScopedT("dflight.field.updated")) + "</dt><dd>" + dflightEscHtml(zone.source_updated_at || "ÔÇö") + "</dd>"
     + "</dl>"
@@ -38210,7 +38274,10 @@ function dflightOpenDetailsPanel(zone){
   const body = document.getElementById("dflightDetailsPanelBody");
   const title = document.getElementById("dflightDetailsPanelTitle");
   if (!dlg || !body) return false;
-  if (title) title.textContent = (zone && zone.name) ? String(zone.name) : dflightScopedT("dflight.detailsTitle");
+  if (title){
+    const nm = (zone && zone.name != null) ? dflightDetailsDisplayText(zone.name) : "";
+    title.textContent = nm || dflightScopedT("dflight.detailsTitle");
+  }
   body.innerHTML = dflightBuildDetailsHtml(zone);
   try { if (typeof dlg.show === "function") dlg.show(); else dlg.setAttribute("open", ""); } catch(_){ dlg.setAttribute("open", ""); }
   try { dlg.setAttribute("aria-modal", "false"); } catch(_){}
@@ -38511,6 +38578,76 @@ function dflightSelfTestCDE(){
     const htmlU = dflightBuildDetailsHtml(dsUnk.zones[0]);
     add("E_unknown_restriction_label", htmlU.indexOf(dflightRestrictionLabel(null)) >= 0);
     add("E_owner_raw", htmlU.indexOf("ENAC") >= 0);
+    /* D-FLIGHT-DETAILS-CONTENT-CLEANUP-A ÔÇö display normalizer */
+    add("DC_helpers_present", typeof dflightDetailsDisplayText === "function"
+      && typeof dflightDetailsEscDisplay === "function"
+      && typeof dflightDetailsDecodeEntities === "function"
+      && typeof dflightDetailsMarkupPass === "function");
+    add("DC_plain_identity", dflightDetailsDisplayText("Hello zone") === "Hello zone");
+    add("DC_html_markup", (function(){
+      const t = dflightDetailsDisplayText("<p>Alpha</p><br>Beta<strong>!</strong>");
+      return t.indexOf("<") < 0 && t.indexOf("Alpha") >= 0 && t.indexOf("Beta") >= 0 && t.indexOf("!") >= 0 && /\n/.test(t);
+    })());
+    add("DC_entity", dflightDetailsDisplayText("Citt&agrave; &amp; porto") === "Citt\u00e0 & porto"
+      || dflightDetailsDisplayText("Citt&agrave; &amp; porto").indexOf("&") >= 0);
+    add("DC_entity_exact", (function(){
+      const t = dflightDetailsDisplayText("Citt&agrave; &amp; porto");
+      return t === "Citt\u00e0 & porto";
+    })());
+    add("DC_hostile_no_tags", (function(){
+      const rawMsg = "<scr" + "ipt>alert(1)</scr" + "ipt><img src=x onerror=alert(1)><ifr" + "ame></ifr" + "ame><p onclick=evil()>X</p>";
+      const plain = dflightDetailsDisplayText(rawMsg);
+      const esc = dflightDetailsEscDisplay(rawMsg);
+      return plain.indexOf("<") < 0 && plain.indexOf("script") < 0 && esc.indexOf("<script") < 0
+        && esc.indexOf("onerror") < 0 && esc.indexOf("<iframe") < 0 && esc.indexOf("onclick") < 0
+        && esc.indexOf("X") >= 0;
+    })());
+    add("DC_build_html_safe_sink", (function(){
+      const z = {
+        zone_id: "dc:1", name: "<b>N</b>", restriction: "PROHIBITED", temporal_state: "ACTIVE_NOW",
+        volumes: [], reasons: ["AIR"], zone_authority: [{ name: "A" }],
+        message: "<p>Msg</p><scr" + "ipt>x</scr" + "ipt>", warnings: ["<img onerror=1>w"],
+        owner_raw: "Own&amp;er", source_url: "http://example.test", source_updated_at: null
+      };
+      const html = dflightBuildDetailsHtml(z);
+      return html.indexOf("<script") < 0 && html.indexOf("onerror") < 0 && html.indexOf("<img") < 0
+        && html.indexOf("Msg") >= 0 && html.indexOf("&lt;script") < 0;
+    })());
+    add("DC_raw_preserved", (function(){
+      const msg = "<p>RAW</p>";
+      const z = { zone_id: "dc:2", name: "Z", restriction: null, temporal_state: "UNKNOWN", volumes: [], message: msg, warnings: [] };
+      const before = z.message;
+      dflightBuildDetailsHtml(z);
+      return z.message === before && z.message === msg;
+    })());
+    add("DC_multiline_br", (function(){
+      const esc = dflightDetailsEscDisplay("A<br>B<p>C</p>");
+      return esc.indexOf("<br>") >= 0 && esc.indexOf("&lt;br") < 0 && esc.indexOf("A") >= 0 && esc.indexOf("C") >= 0;
+    })());
+    add("DC_empty_null", dflightDetailsDisplayText(null) === "" && dflightDetailsDisplayText("") === ""
+      && dflightDetailsEscDisplay(null).indexOf("ÔÇö") >= 0);
+    add("DC_encoded_markup", (function(){
+      const t = dflightDetailsDisplayText("&lt;p&gt;Prima&lt;br&gt;Seconda&lt;/p&gt;");
+      return t.indexOf("Prima") >= 0 && t.indexOf("Seconda") >= 0
+        && t.indexOf("<p") < 0 && t.indexOf("<br") < 0 && t.indexOf("&lt;") < 0
+        && /Prima\s*\n\s*Seconda/.test(t);
+    })());
+    add("DC_numeric_hostile", (function(){
+      const raw = "&#60;img src=x onerror=alert(1)&#62;Safe&#60;scr"+"ipt&#62;x&#60;/scr"+"ipt&#62;";
+      const plain = dflightDetailsDisplayText(raw);
+      const esc = dflightDetailsEscDisplay(raw);
+      return plain.indexOf("Safe") >= 0 && plain.indexOf("<") < 0 && plain.indexOf(">") < 0
+        && /<img\b/i.test(esc) === false && /<scr/i.test(esc) === false
+        && esc.indexOf("onerror") < 0;
+    })());
+    add("DC_mixed_encoded", (function(){
+      const t = dflightDetailsDisplayText("A <b>B</b> &amp; &lt;i&gt;C&lt;/i&gt;");
+      return t.indexOf("A") >= 0 && t.indexOf("B") >= 0 && t.indexOf("C") >= 0
+        && t.indexOf("&") >= 0 && t.indexOf("<") < 0 && t.indexOf("&lt;") < 0;
+    })());
+    add("DC_markup_pass_helper", typeof dflightDetailsMarkupPass === "function");
+    add("DC_open_wired", String(dflightOpenDetailsPanel).indexOf("dflightDetailsDisplayText") >= 0
+      && String(dflightBuildDetailsHtml).indexOf("dflightDetailsEscDisplay") >= 0);
     // restore
     _dflightOverlayVisible = prevVis;
     _dflightOverlaySession = prevSess;
@@ -39714,8 +39851,8 @@ function dflightSelfTestF(){
     })());
 
     add("F_mvisa_build_199",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 235
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A-FIX1");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 237
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX1");
 
     _dflightHelperBaseUrlOverride = "http://example.test:8010";
     if (typeof state !== "undefined") state.forceOffline = true;
@@ -40736,8 +40873,8 @@ function dflightSelfTestTf(){
       && String(dflightEnsurePanelGeometryResize).indexOf("dflightSyncAdaptivePanelGeometry") >= 0);
 
     add("Tf_build_196",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 235
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A-FIX1");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 237
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX1");
   } catch (e){
     add("selftest_tf_exception", false, String(e && e.message ? e.message : e));
   } finally {
@@ -42667,8 +42804,8 @@ function dflightSelfTestH(){
       } catch(_){ return false; }
     })());
 
-    add("H_build_214", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 235
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A-FIX1");
+    add("H_build_214", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 237
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX1");
     add("VR_FIX1_sync_loading_passes_zoom", (function(){
       if (typeof dflightSyncLoadingUi !== "function") return false;
       const src = String(dflightSyncLoadingUi);
```

