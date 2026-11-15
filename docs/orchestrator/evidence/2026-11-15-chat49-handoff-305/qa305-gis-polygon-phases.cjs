'use strict';

// One synthetic GIS Polygon fixture, separate from the SavedTrack.closed tests.
// Execute only in an EMPTY isolated profile; reload the same origin between phases.
// Uses the app's import Hub API and its native export serializers/parsers.
// Does not emulate an OS file chooser, click Download, or patch runtime source.
const common=String.raw`
const out={harnessRevision:'gis-polygon-single-fixture-1',checks:[],observations:[]};
const check=(name,ok,detail)=>out.checks.push({name,pass:!!ok,detail});
const copy=x=>JSON.parse(JSON.stringify(x));
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const name='QA305-GIS-square';
const ring=[[9,44],[9.001,44],[9.001,44.001],[9,44.001],[9,44]];
const hasAddon=x=>!!(x&&typeof x==='object'&&(Object.prototype.hasOwnProperty.call(x,'importedElevations')||Object.values(x).some(hasAddon)));
const forbiddenOtherData=()=>['savedTracks','gisTracks','mapWaypoints'].some(k=>Array.isArray(state[k])&&state[k].length)||!!(state.track&&Array.isArray(state.track.points)&&state.track.points.length);
const polygonOnly=parsed=>!!(parsed&&parsed.ok&&parsed.fc&&parsed.fc.features&&parsed.fc.features.length===1&&parsed.fc.features[0].geometry&&parsed.fc.features[0].geometry.type==='Polygon');
`;

const polygonPhase1=`(async()=>{${common}
try{
 if(typeof state!=='object'||typeof gisImportHubAnalyzeFiles!=='function')throw new Error('Application is not ready');
 if(forbiddenOtherData()||(Array.isArray(state.gisPolygons)&&state.gisPolygons.length))throw new Error('GIS polygon QA requires an EMPTY isolated profile; existing geometry found');
 const fc={type:'FeatureCollection',features:[{type:'Feature',properties:{name},geometry:{type:'Polygon',coordinates:[ring]}}]};
 // Set the existing import-Hub selection controls in this empty test profile.
 for(const [id,want] of [['wbImportHubWaypoints',false],['wbImportHubSavedTracks',false],['wbImportHubPolygons',true]]){
   const input=document.getElementById(id);if(input&&input.checked!==want)input.click();
 }
 const file=new File([JSON.stringify(fc)],name+'.geojson',{type:'application/geo+json'});
 const preview=await gisImportHubAnalyzeFiles([file]);
 out.preview=preview?{phase:preview.phase,totals:copy(preview.totals),selection:copy(preview.selection)}:null;
 check('GIS polygon classified by application importer',preview&&preview.phase==='preview'&&preview.totals.polygons===1&&preview.totals.tracks===0&&preview.totals.waypoints===0&&preview.totals.errors===0);
 if(!out.checks[out.checks.length-1].pass)throw new Error('Polygon import preview did not match the fixture');
 const applied=gisImportHubApplyPreview();out.apply=copy(applied);
 check('GIS polygon application import and persist succeeds',applied&&applied.ok===true&&applied.added.polygons===1&&applied.added.tracks===0&&applied.added.waypoints===0);
 if(!applied||!applied.ok)throw new Error('Polygon import apply failed');
 const p=state.gisPolygons&&state.gisPolygons[0];
 check('GIS polygon uses canonical polygon store and kind',state.gisPolygons.length===1&&p.type==='Feature'&&p.geometry.type==='Polygon'&&p.properties.kind==='polygon'&&p.properties.name===name);
 check('GIS polygon closed square geometry retained',eq(p.geometry.coordinates,[ring]));
 check('GIS polygon carries no imported elevation addon',!hasAddon(p));
 check('GIS polygon did not create a SavedTrack or other geometry',!forbiddenOtherData());
 const persisted=JSON.parse(localStorage.getItem(STORAGE_KEY));
 out.storageKey=STORAGE_KEY;out.polygon=copy(p);out.persistedPolygon=copy(persisted.gisPolygons||[]);
 check('GIS polygon persisted in canonical field without addon',persisted.gisPolygons&&persisted.gisPolygons.length===1&&eq(persisted.gisPolygons[0].geometry,p.geometry)&&!hasAddon(persisted.gisPolygons));
}catch(e){out.fatal={message:e.message,stack:e.stack};}
out.pass=!out.fatal&&out.checks.every(c=>c.pass);return out;
})()`;

const polygonPhase2=`(async()=>{${common}
try{
 if(typeof state!=='object'||typeof polygonBuildGeoJson!=='function')throw new Error('Reloaded application is not ready');
 if(forbiddenOtherData()||!Array.isArray(state.gisPolygons)||state.gisPolygons.length!==1||state.gisPolygons[0].properties.name!==name)throw new Error('Expected only the isolated GIS polygon fixture after reload');
 const p=state.gisPolygons[0];
 check('GIS polygon reload restores polygon kind and geometry',p.type==='Feature'&&p.geometry.type==='Polygon'&&p.properties.kind==='polygon'&&eq(p.geometry.coordinates,[ring]));
 check('GIS polygon reload does not introduce imported addon',!hasAddon(p));
 const geo=polygonBuildGeoJson();const geoText=JSON.stringify(geo);
 const parsedGeo=spatialTextToFeatureCollection(geoText,name+'-export.geojson');
 check('GIS polygon native GeoJSON exporter retains square',geo.type==='FeatureCollection'&&geo.features.length===1&&geo.features[0].geometry.type==='Polygon'&&eq(geo.features[0].geometry.coordinates,[ring]));
 check('GIS polygon GeoJSON export is import-compatible',polygonOnly(parsedGeo)&&eq(parsedGeo.fc.features[0].geometry.coordinates,[ring]));
 check('GIS polygon GeoJSON roundtrip has no imported addon',!hasAddon(geo)&&!hasAddon(parsedGeo.fc));
 const kml=polygonBuildKml();
 const parsedKml=spatialTextToFeatureCollection(kml,name+'-export.kml');
 check('GIS polygon native KML export is import-compatible',polygonOnly(parsedKml));
 const kmlRing=polygonOnly(parsedKml)?parsedKml.fc.features[0].geometry.coordinates[0].map(c=>c.slice(0,2)):null;
 check('GIS polygon KML roundtrip retains XY and closed ring',eq(kmlRing,ring));
 check('GIS polygon KML roundtrip has no imported addon',!kml.includes('importedElevations')&&!hasAddon(parsedKml.fc));
 check('GIS polygon export/parse does not mutate canonical geometry',state.gisPolygons.length===1&&eq(state.gisPolygons[0].geometry.coordinates,[ring])&&!forbiddenOtherData());
 out.exports={geojson:geoText,kml};
 out.parsed={geojson:parsedGeo.ok?copy(parsedGeo.fc):copy(parsedGeo),kml:parsedKml.ok?copy(parsedKml.fc):copy(parsedKml)};
}catch(e){out.fatal={message:e.message,stack:e.stack};}
out.pass=!out.fatal&&out.checks.every(c=>c.pass);return out;
})()`;

module.exports={polygonPhase1,polygonPhase2};
