"use strict";
const fs = require('fs'), crypto = require('crypto'), net = require('net'), path = require('path');
const ORIGIN = 'https://ionos-n8n-new.tailc01234.ts.net';
const PAGE_PATH = '/gis';
const EXPECTED_SHA = '70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde';
const QA_MODE = process.env.GIS_QA_MODE || 'prepublication';
const CANDIDATE_URL = ORIGIN + PAGE_PATH + (QA_MODE==='postdeploy'?'?v='+EXPECTED_SHA:'');
const MAX_REAL_POSTS = QA_MODE==='postdeploy'?2:7;
const APP = 'C:/Users/Utente/Downloads/Documents/ChatGPT/TMART GIS Tool/work/gpt-resume-20261109/candidate-280-70553e52.html';
const SYNTHETIC = [{lon:9.8236,lat:44.1024},{lon:9.829,lat:44.107}];
const STATIC_ASSETS = new Set();
const SOFT_SNAP_M=50, MAX_NEAREST_DELTA_M=5, MAX_GEOMETRY_VERTICES=2000, MAX_ALTERNATIVES=3;
const GEOMETRY_MARGIN_DEGREES=0.02, MAX_ROUTE_RESPONSE_BYTES=2*1024*1024;
const CONNECT_AUTHORITY = new URL(ORIGIN).hostname + ':443';
const SSH_FORWARD_HOST='127.0.0.1', SSH_FORWARD_PORT=Number(process.env.QA_TLS_FORWARD_PORT || '0');
const CONNECT_PROXY_HEADER_LIMIT=16*1024, CONNECT_PROXY_MAX_CONNECTIONS=8, CONNECT_PROXY_TIMEOUT_MS=15000;
const TRANSPORT=process.env.QA_TRANSPORT || 'direct';
const summary={candidateSha256:EXPECTED_SHA,origin:ORIGIN,fixture:SYNTHETIC,startedAtUtc:new Date().toISOString(),
  mode:QA_MODE,documentInterception:QA_MODE!=='postdeploy',transport:TRANSPORT,tlsVerification:true,responseBodiesModified:false,
  browserNetwork:{externalBlocked:0,disallowedSameOriginBlocked:0,policyBlocked:0,websocketsBlocked:0},
  localConnectProxy:{accepted:0,rejected:0,upstreamFailures:0},runs:[]};
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const assert=(ok,msg)=>{if(!ok)throw new Error(msg);};
let routePostsTotal=0;

function startRestrictedConnectProxy() {
  const username = 'routing-qa';
  const password = crypto.randomBytes(32).toString('hex');
  const expectedCredentials = Buffer.from(`${username}:${password}`, 'utf8');
  const activeClients = new Set();

  const server = net.createServer(client => {
    if (activeClients.size >= CONNECT_PROXY_MAX_CONNECTIONS) {
      summary.localConnectProxy.rejected++;
      client.once('error', () => {});
      client.end('HTTP/1.1 503 Service Unavailable\r\nConnection: close\r\nContent-Length: 0\r\n\r\n');
      return;
    }

    activeClients.add(client);
    let upstream = null;
    let state = 'headers';
    let pending = Buffer.alloc(0);
    let closed = false;
    client.setTimeout(CONNECT_PROXY_TIMEOUT_MS);

    const cleanup = () => {
      if (closed) return;
      closed = true;
      activeClients.delete(client);
      if (upstream && !upstream.destroyed) upstream.destroy();
    };
    const reject = (status, label) => {
      if (state === 'rejected') return;
      if (closed || client.destroyed) return cleanup();
      summary.localConnectProxy.rejected++;
      const challenge = status === 407 ? 'Proxy-Authenticate: Basic realm="routing-qa"\r\n' : '';
      client.end(`HTTP/1.1 ${status} ${label}\r\n${challenge}Connection: close\r\nContent-Length: 0\r\n\r\n`);
      if (upstream && !upstream.destroyed) upstream.destroy();
      state = 'rejected';
    };
    const onHeaderData = chunk => {
      if (state !== 'headers') return;
      pending = Buffer.concat([pending, chunk]);
      if (pending.length > CONNECT_PROXY_HEADER_LIMIT) return reject(431, 'Request Header Fields Too Large');
      const boundary = pending.indexOf('\r\n\r\n');
      if (boundary < 0) return;

      const header = pending.subarray(0, boundary).toString('latin1');
      const trailing = pending.subarray(boundary + 4);
      const lines = header.split('\r\n');
      const requestLine = lines.shift() || '';
      const requestMatch = /^CONNECT ([^\s]+) HTTP\/1\.[01]$/.exec(requestLine);
      if (!requestMatch || requestMatch[1] !== CONNECT_AUTHORITY) return reject(403, 'Forbidden');

      const headerRows = [];
      for (const line of lines) {
        if (!line || /^[ \t]/.test(line)) return reject(400, 'Bad Request');
        const match = /^([!#$%&'*+.^_`|~0-9A-Za-z-]+):[ \t]*(.*)$/.exec(line);
        if (!match) return reject(400, 'Bad Request');
        headerRows.push([match[1].toLowerCase(), match[2].trim()]);
      }
      const hostHeaders = headerRows.filter(([name]) => name === 'host');
      if (hostHeaders.length !== 1 || hostHeaders[0][1].toLowerCase() !== CONNECT_AUTHORITY) return reject(403, 'Forbidden');
      const authHeaders = headerRows.filter(([name]) => name === 'proxy-authorization');
      const authMatch = authHeaders.length === 1 ? /^Basic ([A-Za-z0-9+/=]+)$/i.exec(authHeaders[0][1]) : null;
      if (!authMatch) return reject(407, 'Proxy Authentication Required');
      const supplied = Buffer.from(authMatch[1], 'base64');
      if (supplied.length !== expectedCredentials.length || !crypto.timingSafeEqual(supplied, expectedCredentials)) return reject(407, 'Proxy Authentication Required');
      if (headerRows.some(([name, value]) => name === 'authorization' || name === 'cookie' ||
          name === 'content-length' && value !== '0' || name === 'transfer-encoding')) return reject(400, 'Bad Request');

      state = 'connecting';
      client.pause();
      client.removeListener('data', onHeaderData);
      upstream = net.createConnection({ host: SSH_FORWARD_HOST, port: SSH_FORWARD_PORT });
      upstream.setTimeout(CONNECT_PROXY_TIMEOUT_MS);
      upstream.once('connect', () => {
        if (closed || client.destroyed) return cleanup();
        state = 'tunnel';
        summary.localConnectProxy.accepted++;
        client.setTimeout(0);
        upstream.setTimeout(0);
        client.write('HTTP/1.1 200 Connection Established\r\nConnection: keep-alive\r\n\r\n');
        if (trailing.length) upstream.write(trailing);
        client.pipe(upstream);
        upstream.pipe(client);
        client.resume();
      });
      upstream.once('error', () => {
        if (state === 'connecting' && !client.destroyed) {
          summary.localConnectProxy.upstreamFailures++;
          client.end('HTTP/1.1 502 Bad Gateway\r\nConnection: close\r\nContent-Length: 0\r\n\r\n');
        } else if (!client.destroyed) client.destroy();
        cleanup();
      });
      upstream.once('timeout', () => {
        if (state === 'connecting' && !client.destroyed) {
          summary.localConnectProxy.upstreamFailures++;
          client.end('HTTP/1.1 504 Gateway Timeout\r\nConnection: close\r\nContent-Length: 0\r\n\r\n');
        } else if (!client.destroyed) client.destroy();
        cleanup();
      });
      upstream.once('close', () => {
        if (!closed && state === 'tunnel' && !client.destroyed) client.destroy();
        cleanup();
      });
    };

    client.on('data', onHeaderData);
    client.once('timeout', () => reject(504, 'Gateway Timeout'));
    client.once('error', cleanup);
    client.once('close', cleanup);
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      server.removeListener('error', reject);
      const address = server.address();
      if (!address || typeof address === 'string') {
        server.close(() => reject(new Error('connect_proxy_listen_failed')));
        return;
      }
      resolve({
        url: `http://127.0.0.1:${address.port}`,
        username,
        password,
        close: async () => {
          for (const client of activeClients) client.destroy();
          await new Promise(done => server.close(() => done()));
        }
      });
    });
  });
}

function haversineM(a, b) {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const lat1 = a.lat * rad;
  const lat2 = b.lat * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 6371000 * 2 * Math.asin(Math.min(1, Math.sqrt(h)));
}

function coordinateEqual(a, b, tolerance = 1e-9) {
  return Array.isArray(a) && a.length === 2 && Array.isArray(b) && b.length === 2 &&
    a.every(Number.isFinite) && b.every(Number.isFinite) &&
    Math.abs(a[0] - b[0]) <= tolerance && Math.abs(a[1] - b[1]) <= tolerance;
}

function approvedRoutePoints(points, run) {
  if (!Array.isArray(points) || points.length !== 2) return false;
  return points.every((point, i) => {
    if (!Array.isArray(point) || point.length !== 2 || !point.every(Number.isFinite)) return false;
    const original = [SYNTHETIC[i].lon, SYNTHETIC[i].lat];
    const approvedSnap = run.nearestReceived[i];
    return coordinateEqual(point, original) || (approvedSnap && coordinateEqual(point, approvedSnap));
  });
}

function exactKeys(value, keys) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const actual = Object.keys(value).sort();
  const expected = keys.slice().sort();
  return actual.length === expected.length && actual.every((key, i) => key === expected[i]);
}

function withinGeometryWindow(point) {
  if (!Array.isArray(point) || point.length < 2 || point.length > 3 || !point.every(Number.isFinite)) return false;
  const lons = SYNTHETIC.map(p => p.lon);
  const lats = SYNTHETIC.map(p => p.lat);
  return point[0] >= Math.min(...lons) - GEOMETRY_MARGIN_DEGREES &&
    point[0] <= Math.max(...lons) + GEOMETRY_MARGIN_DEGREES &&
    point[1] >= Math.min(...lats) - GEOMETRY_MARGIN_DEGREES &&
    point[1] <= Math.max(...lats) + GEOMETRY_MARGIN_DEGREES;
}

function containsSensitiveKey(value, depth = 0) {
  if (depth > 12 || value == null) return false;
  if (Array.isArray(value)) return value.some(v => containsSensitiveKey(v, depth + 1));
  if (typeof value !== 'object') return false;
  for (const [key, child] of Object.entries(value)) {
    if (/(authorization|api[-_]?key|access[-_]?token|secret|password|credential)/i.test(key)) return true;
    if (containsSensitiveKey(child, depth + 1)) return true;
  }
  return false;
}

function safeJson(bytes) {
  try { return JSON.parse(bytes.toString('utf8')); } catch (_) { return null; }
}

function safeNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function safeLine(value) {
  if (!value || value.type !== 'LineString' || !Array.isArray(value.coordinates)) return null;
  if (value.coordinates.length < 2 || value.coordinates.length > MAX_GEOMETRY_VERTICES || !value.coordinates.every(withinGeometryWindow)) return null;
  const coordinates = value.coordinates.map(c => c.slice());
  return { type: 'LineString', coordinates };
}

function safeIntervals(value, allowed) {
  if (!Array.isArray(value) || value.length > MAX_GEOMETRY_VERTICES) return [];
  return value.map(row => {
    if (!Array.isArray(row) || row.length !== 3) return null;
    const start = Number.isInteger(row[0]) ? row[0] : -1;
    const end = Number.isInteger(row[1]) ? row[1] : -1;
    const item = allowed(row[2]) ? row[2] : 'unknown';
    return [start, end, item];
  }).filter(Boolean);
}

function strictIntervals(value, allowed) {
  if (!Array.isArray(value) || value.length > MAX_GEOMETRY_VERTICES) return null;
  const rows = [];
  for (const row of value) {
    if (!Array.isArray(row) || row.length !== 3 || !Number.isInteger(row[0]) ||
        !Number.isInteger(row[1]) || row[0] < 0 || row[1] <= row[0] || !allowed(row[2])) return null;
    rows.push([row[0], row[1], row[2]]);
  }
  return rows;
}

function safeRouteMetric(value) {
  return value == null || (typeof value === 'number' && Number.isFinite(value) && value >= 0);
}

function requiredRouteMetric(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function coveredByLandIntervals(intervals, pointCount, allowed) {
  if (!Array.isArray(intervals) || !intervals.length || !Number.isInteger(pointCount) || pointCount < 2) return false;
  let end = 0;
  for (const row of intervals) {
    if (!Array.isArray(row) || row.length !== 3 || !Number.isInteger(row[0]) || !Number.isInteger(row[1]) ||
        row[0] !== end || row[1] <= row[0] || row[1] >= pointCount || !allowed(row[2])) return false;
    end = row[1];
  }
  return end === pointCount - 1;
}

function snapWaypointsOk(routePoints, snappedPoints) {
  if (!Array.isArray(routePoints) || routePoints.length !== 2 || !Array.isArray(snappedPoints) || snappedPoints.length !== 2) return false;
  return snappedPoints.every((point, i) => {
    const source = routePoints[i];
    const target = point;
    if (!Array.isArray(source) || !Array.isArray(target)) return false;
    const sourceLL = { lon: Number(source[0]), lat: Number(source[1]) };
    const targetLL = { lon: Number(target[0]), lat: Number(target[1]) };
    if (![sourceLL.lon, sourceLL.lat, targetLL.lon, targetLL.lat].every(Number.isFinite)) return false;
    if (haversineM(sourceLL, targetLL) > SOFT_SNAP_M) return false;
    return true;
  });
}

function sanitizeGhResponse(data, requestPoints) {
  const paths = data && Array.isArray(data.paths) ? data.paths : null;
  if (!paths || paths.length < 1) return { body: { paths: [] }, noFerry: false, snapVerified: false, previewPointCount: 0, alternativeCount: 0, valid: false };
  if (paths.length > MAX_ALTERNATIVES) return { body: { paths: [] }, noFerry: false, snapVerified: false, previewPointCount: 0, alternativeCount: paths.length, valid: false };
  const result = [];
  let previewPointCount = 0;
  for (const pathObj of paths) {
    const line = safeLine(pathObj && pathObj.points);
    const snapped = safeLine(pathObj && pathObj.snapped_waypoints);
    const intervals = strictIntervals(pathObj && pathObj.details && pathObj.details.road_environment,
      v => typeof v === 'string' && ['road', 'bridge', 'tunnel', 'ford', 'ferry'].includes(v.toLowerCase()));
    const sourcePoints = Array.isArray(snapped && snapped.coordinates) ? snapped.coordinates : [];
    const linePoints = Array.isArray(line && line.coordinates) ? line.coordinates : [];
    const routeNoFerry = !!line && !!intervals && coveredByLandIntervals(intervals, linePoints.length,
      v => typeof v === 'string' && ['road', 'bridge', 'tunnel', 'ford'].includes(v.toLowerCase()));
    const routeSnap = !!line && !!snapped && snapWaypointsOk(requestPoints, sourcePoints) &&
      linePoints.length >= 2 && haversineM({ lon: sourcePoints[0][0], lat: sourcePoints[0][1] }, { lon: linePoints[0][0], lat: linePoints[0][1] }) <= 1 &&
      haversineM({ lon: sourcePoints[1][0], lat: sourcePoints[1][1] }, { lon: linePoints[linePoints.length - 1][0], lat: linePoints[linePoints.length - 1][1] }) <= 1;
    const metricsValid = ['distance', 'time'].every(key => requiredRouteMetric(pathObj && pathObj[key])) &&
      ['ascend', 'descend'].every(key => safeRouteMetric(pathObj && pathObj[key]));
    if (!line || !snapped || !intervals || !routeNoFerry || !routeSnap || !metricsValid) {
      return { body: { paths: [] }, noFerry: false, snapVerified: false, previewPointCount: 0, alternativeCount: paths.length, valid: false };
    }
    previewPointCount = Math.max(previewPointCount, linePoints.length);
    result.push({
      distance: safeNumber(pathObj && pathObj.distance),
      time: safeNumber(pathObj && pathObj.time),
      ascend: safeNumber(pathObj && pathObj.ascend),
      descend: safeNumber(pathObj && pathObj.descend),
      points: line || { type: 'LineString', coordinates: [] },
      snapped_waypoints: snapped || { type: 'LineString', coordinates: [] },
      details: { road_environment: intervals }
    });
  }
  return { body: { paths: result }, noFerry: true, snapVerified: true, previewPointCount, alternativeCount: result.length, valid: true };
}

function sanitizeOrsResponse(data, requestPoints) {
  const features = data && data.type === 'FeatureCollection' && Array.isArray(data.features) ? data.features : null;
  if (!features || features.length < 1) return { body: { type: 'FeatureCollection', features: [] }, noFerry: false, snapVerified: false, previewPointCount: 0, alternativeCount: 0, valid: false };
  if (features.length > MAX_ALTERNATIVES) return { body: { type: 'FeatureCollection', features: [] }, noFerry: false, snapVerified: false, previewPointCount: 0, alternativeCount: features.length, valid: false };
  const result = [];
  let previewPointCount = 0;
  for (const feature of features) {
    const line = safeLine(feature && feature.geometry);
    const properties = feature && feature.properties && typeof feature.properties === 'object' ? feature.properties : {};
    const summary = properties.summary && typeof properties.summary === 'object' ? properties.summary : {};
    const indexes = Array.isArray(properties.way_points) && properties.way_points.length === 2 && properties.way_points.every(Number.isInteger)
      ? properties.way_points.slice() : [];
    const waytype = properties.extras && properties.extras.waytype && properties.extras.waytype.values;
    const intervals = strictIntervals(waytype, v => Number.isInteger(v));
    const points = line ? line.coordinates : [];
    const mapped = indexes.length === 2 && indexes[0] === 0 && indexes[1] === points.length - 1 ? indexes.map(i => points[i]) : [];
    const routeNoFerry = !!line && !!intervals && coveredByLandIntervals(intervals, points.length,
      v => Number.isInteger(v) && ((v >= 1 && v <= 8) || v === 10));
    const routeSnap = feature && feature.type === 'Feature' && !!line && indexes.length === 2 && indexes[0] === 0 &&
      indexes[1] === points.length - 1 && snapWaypointsOk(requestPoints, mapped);
    const metricsValid = ['distance', 'duration'].every(key => requiredRouteMetric(summary[key])) &&
      ['ascent', 'descent'].every(key => safeRouteMetric(summary[key]));
    if (!line || !intervals || !routeNoFerry || !routeSnap || !metricsValid) {
      return { body: { type: 'FeatureCollection', features: [] }, noFerry: false, snapVerified: false, previewPointCount: 0, alternativeCount: features.length, valid: false };
    }
    previewPointCount = Math.max(previewPointCount, points.length);
    result.push({
      type: 'Feature',
      geometry: line || { type: 'LineString', coordinates: [] },
      properties: {
        summary: {
          distance: safeNumber(summary.distance), duration: safeNumber(summary.duration),
          ascent: safeNumber(summary.ascent), descent: safeNumber(summary.descent)
        },
        way_points: indexes,
        extras: { waytype: { values: intervals } }
      }
    });
  }
  return { body: { type: 'FeatureCollection', features: result }, noFerry: true, snapVerified: true, previewPointCount, alternativeCount: result.length, valid: true };
}


function classifyRequest(request, candidateUrl, run) {
  let url;
  try { url = new URL(request.url()); } catch (_) { return null; }
  if (url.username || url.password) {
    summary.browserNetwork.policyBlocked++;
    run.counts.blockedPolicy++;
    return null;
  }
  if (url.origin !== ORIGIN) {
    summary.browserNetwork.externalBlocked++;
    return null;
  }
  const method = request.method().toUpperCase();
  const pathname = url.pathname;
  if (method === 'GET' && request.url() === candidateUrl && pathname === PAGE_PATH) return { kind: 'document' };
  if (method === 'GET' && STATIC_ASSETS.has(pathname) && !url.search) return { kind: 'asset', assetPath: pathname };
  if (method === 'GET' && pathname === '/_routing/gh/info' && !url.search) return { kind: 'ghInfo' };
  if (method === 'GET' && pathname === '/_routing/gh/nearest' && url.searchParams.size === 1 && url.searchParams.has('point')) {
    const values = url.searchParams.getAll('point');
    if (values.length !== 1) return null;
    const numbers = values[0].split(',').map(Number);
    if (numbers.length !== 2 || !numbers.every(Number.isFinite)) return null;
    const queryPoint = [numbers[1], numbers[0]];
    const targetIndex = SYNTHETIC.findIndex(p => coordinateEqual(queryPoint, [p.lon, p.lat]));
    if (targetIndex < 0 || run.nearestRequested[targetIndex] >= 2) {
      summary.browserNetwork.policyBlocked++;
      run.counts.blockedPolicy++;
      return null;
    }
    run.nearestRequested[targetIndex]++;
    return { kind: 'ghNearest', targetIndex };
  }
  if (method === 'GET' && pathname === '/ors/status' && !url.search) return { kind: 'orsStatus' };
  if (method === 'POST' && pathname === '/_routing/gh/route' && !url.search) {
    let body;
    const postData = request.postData() || '';
    if (Buffer.byteLength(postData) > 65536) { summary.browserNetwork.policyBlocked++; run.counts.blockedPolicy++; return null; }
    try { body = JSON.parse(postData); } catch (_) { return null; }
    const priority = body && body.custom_model && body.custom_model.priority;
    const ghAlternativeKeys = ['profile', 'points', 'elevation', 'points_encoded', 'instructions', 'custom_model', 'ch.disable', 'details', 'snap_preventions',
      'algorithm', 'alternative_route.max_paths', 'alternative_route.max_weight_factor', 'alternative_route.max_share_factor'];
    const ghAlternativesOk = exactKeys(body, ghAlternativeKeys) &&
      body.algorithm === 'alternative_route' && body['alternative_route.max_paths'] === 3 &&
      body['alternative_route.max_weight_factor'] === 1.4 && body['alternative_route.max_share_factor'] === 0.6;
    const priorityOk = exactKeys(body && body.custom_model, ['priority']) && Array.isArray(priority) && priority.length === 1 &&
      exactKeys(priority[0], ['if', 'multiply_by']) && priority[0].if === 'road_environment == FERRY' && priority[0].multiply_by === '0';
    const safe = ghAlternativesOk &&
      body.profile === run.expectedGhProfile && approvedRoutePoints(body.points, run) && body.elevation === true &&
      body.points_encoded === false && body.instructions === false && body['ch.disable'] === true &&
      Array.isArray(body.snap_preventions) && body.snap_preventions.length === 1 && body.snap_preventions[0] === 'ferry' &&
      Array.isArray(body.details) && body.details.length === 1 && body.details[0] === 'road_environment' &&
      priorityOk && !containsSensitiveKey(body);
    run.requestPolicyValid = run.requestPolicyValid && !!safe;
    if (!safe) { summary.browserNetwork.policyBlocked++; run.counts.blockedPolicy++; return null; }
    return { kind: 'ghRoute', requestBody: body };
  }
  if (method === 'POST' && pathname === '/ors/v2/directions/' + run.expectedOrsProfile + '/geojson' && !url.search) {
    let body;
    const postData = request.postData() || '';
    if (Buffer.byteLength(postData) > 65536) { summary.browserNetwork.policyBlocked++; run.counts.blockedPolicy++; return null; }
    try { body = JSON.parse(postData); } catch (_) { return null; }
    const options = body && body.options;
    const orsAlternativeKeys = ['coordinates', 'elevation', 'instructions', 'options', 'extra_info', 'alternative_routes'];
    const alternatives = body && body.alternative_routes;
    const orsAlternativesOk = exactKeys(body, orsAlternativeKeys) &&
      exactKeys(alternatives, ['target_count', 'share_factor', 'weight_factor']) && alternatives.target_count === 3 &&
      alternatives.share_factor === 0.6 && alternatives.weight_factor === 1.4;
    const safe = orsAlternativesOk &&
      approvedRoutePoints(body.coordinates, run) && body.elevation === true && body.instructions === false &&
      exactKeys(options, ['avoid_features']) && Array.isArray(options.avoid_features) && options.avoid_features.length === 1 &&
      options.avoid_features[0] === 'ferries' && Array.isArray(body.extra_info) && body.extra_info.length === 1 &&
      body.extra_info[0] === 'waytype' && !containsSensitiveKey(body);
    run.requestPolicyValid = run.requestPolicyValid && !!safe;
    if (!safe) { summary.browserNetwork.policyBlocked++; run.counts.blockedPolicy++; return null; }
    return { kind: 'orsRoute', requestBody: body };
  }
  summary.browserNetwork.disallowedSameOriginBlocked++;
  return null;
}


function pointsEqual(actual, reference, tolerance=1e-8) {
  return Array.isArray(actual) && actual.length===reference.length && actual.every((p,i)=>
    Number.isFinite(p.lat) && Number.isFinite(p.lon) && Math.abs(p.lat-reference[i][1])<=tolerance && Math.abs(p.lon-reference[i][0])<=tolerance);
}

function reducedError(data) {
  const result={keys:data&&typeof data==='object'?Object.keys(data).slice(0,12):[]};
  const code=data&&data.error&&typeof data.error==='object'?data.error.code:data&&data.error;
  if(typeof code==='number'||typeof code==='string'&&/^[a-zA-Z0-9_. -]{1,64}$/.test(code)) result.code=code;
  if(data&&Array.isArray(data.hints)) result.hintTypes=data.hints.map(h=>h&&typeof h.details==='string'?h.details.slice(0,160):null);
  return result;
}

async function verifyInput(page,run,label,expectedPolicy) {
  await page.waitForFunction(points=>{
    const r=state._routing;
    return r&&Array.isArray(r.points)&&r.points.length===2&&r.points.every((p,i)=>
      Math.abs(Number(p.lat)-points[i].lat)<1e-8&&Math.abs(Number(p.lon)-points[i].lon)<1e-8);
  },SYNTHETIC,{timeout:10000});
  const check=await page.evaluate(points=>{
    const r=state._routing;
    const rows=Array.from(document.querySelectorAll('#routingPointsList .routing-point-row'));
    return {statePoints:r.points.map(p=>({lat:p.lat,lon:p.lon,snapStatus:p.snapStatus||'unverified'})),
      stateMatch:r.points.length===2&&r.points.every((p,i)=>Math.abs(Number(p.lat)-points[i].lat)<1e-8&&Math.abs(Number(p.lon)-points[i].lon)<1e-8),
      inputValues:rows.map(row=>({lat:row.querySelector('input[data-routing-coord="lat"]')?.value,
                                lon:row.querySelector('input[data-routing-coord="lon"]')?.value})),
      profile:document.querySelector('#routingProfileSelect').value,
      forcedOffline:!!state.forceOffline,opsecStrict:!!state.opsecStrict,
      pending:!!r.infoLoading||!!r.requestLoading};
  },SYNTHETIC);
  check.label=label;
  run.inputChecks.push(check);
  assert(check.stateMatch,'state_points_mismatch_'+label);
  assert(check.inputValues.length===2&&check.inputValues.every((p,i)=>
    Math.abs(Number(p.lat)-SYNTHETIC[i].lat)<1e-8&&Math.abs(Number(p.lon)-SYNTHETIC[i].lon)<1e-8),'visible_input_points_mismatch_'+label);
  const expected=expectedPolicy||{forcedOffline:false,opsecStrict:false};
  assert(check.forcedOffline===expected.forcedOffline&&check.opsecStrict===expected.opsecStrict,'network_policy_does_not_match_scenario');
}

async function enterUi(page,run,scenario) {
  const previousRequests=run.requests.length;
  await page.goto(CANDIDATE_URL,{waitUntil:'domcontentloaded',timeout:60000});
  await page.locator('[data-role="track-map-toggle"]').click();
  await page.waitForSelector('#trackModal[open]');
  if(scenario.service==='ors'){
    await page.locator('#btnRoutingServiceMenu').click();
    await page.locator('#routingServiceMenu [data-routing-service="ors"]').click();
  } else await page.locator('#btnRoutingPlannerOpen').click();
  await page.waitForSelector('#routingPlannerPanel[open]');
  await page.locator('#routingProfileSelect').selectOption(scenario.profile);
  await page.locator('#routingCoordEditBtn').click();
  for(let i=0;i<2;i++){
    const row=page.locator('#routingPointsList .routing-point-row').nth(i);
    await row.locator('input[data-routing-coord="lat"]').fill(String(SYNTHETIC[i].lat));
    await row.locator('input[data-routing-coord="lon"]').fill(String(SYNTHETIC[i].lon));
    await row.locator('button[data-routing-act="apply-coords"]').click();
    await page.waitForFunction(({i,p})=>{
      const q=state._routing.points[i];return q&&Math.abs(Number(q.lat)-p.lat)<1e-8&&Math.abs(Number(q.lon)-p.lon)<1e-8;
    },{i,p:SYNTHETIC[i]},{timeout:10000});
  }
  await verifyInput(page,run,'before_calculation');
  assert(run.requests.slice(previousRequests).every(r=>!r.kind.endsWith('Route')),'routing_post_before_explicit_action');
}

async function readUi(page) {
  return page.evaluate(()=>{
    const r=state._routing, cmp=_routingCompareSession;
    return {status:document.querySelector('#routingPlannerStatus')?.textContent||'',
      routeError:r.routeError||null,loading:!!r.requestLoading,infoLoading:!!r.infoLoading,
      resultVisible:!document.querySelector('#routingResultCard').hidden,
      summary:document.querySelector('#routingResultSummary').textContent,
      detailsVisible:!document.querySelector('#routingResultDetails').hidden,
      preview:r.previewCoordinates||[],previewLines:document.querySelectorAll('.routing-route-preview-line').length,
      selectedAlternative:r.selectedAlternative,activeOverlayKey:r.activeOverlayKey||null,
      snap:r.points.map(p=>({status:p.snapStatus||'unverified',distanceM:p.snapDistanceM??null,lat:p.lat,lon:p.lon})),
      saveEnabled:!document.querySelector('#routingSaveAsTrackBtn').disabled,
      compare:{loading:!!cmp.loading,gh:cmp.gh?.status||null,ors:cmp.ors?.status||null,
        ghProfile:cmp.gh?.profile||null,orsProfile:cmp.ors?.profile||null,
        ghError:cmp.gh?.errorKey||cmp.gh?.errKey||null,orsError:cmp.ors?.errorKey||cmp.ors?.errKey||null,
        ghUiText:document.querySelector('#routingCompareGhBody')?.textContent||'',
        orsUiText:document.querySelector('#routingCompareOrsBody')?.textContent||'',
        statusUiText:document.querySelector('#routingCompareStatus')?.textContent||'',
        chosen:cmp.chosen||null},
      originals:r.points.map(p=>({lat:p.lat,lon:p.lon})),
      alternatives:Array.from(document.querySelectorAll('#routingAlternativesChips [data-routing-alt-index]')).map(e=>
        ({provider:e.dataset.routingAltProvider,index:Number(e.dataset.routingAltIndex),pressed:e.getAttribute('aria-pressed')}))};
  });
}

async function saveAndCheck(page,run,provider,expectedCoordinates) {
  const name='QA REAL 280 '+run.name+' '+provider;
  await page.locator('#routingSaveAsTrackBtn').click();
  await page.locator('#routingSaveAsTrackName').fill(name);
  await page.locator('#routingSaveAsTrackConfirmBtn').click();
  await page.waitForFunction(n=>state.savedTracks&&state.savedTracks.some(t=>t.name===n),name,{timeout:10000});
  const saved=await page.evaluate(n=>{
    const track=state.savedTracks.find(t=>t.name===n);
    const stored=JSON.parse(localStorage.getItem('coordconv_v2')||'{}');
    const persisted=stored.savedTracks?.find(t=>t.name===n);
    return {name:n,id:track?.id,points:track?.points?.map(p=>({lat:p.lat,lon:p.lon})),
      persistedPoints:persisted?.points?.map(p=>({lat:p.lat,lon:p.lon})),
      elevationPresent:!!persisted?.elevationProfile,
      status:document.querySelector('#routingPlannerStatus').textContent,
      formHidden:document.querySelector('#routingSaveAsTrackForm').hidden};
  },name);
  assert(saved.formHidden&&/salvat|saved/i.test(saved.status),'save_ui_not_confirmed');
  assert(pointsEqual(saved.points,expectedCoordinates)&&pointsEqual(saved.persistedPoints,expectedCoordinates),'saved_points_differ_from_provider');
  run.saved.push({name,id:saved.id,points:saved.points.length,persistedPoints:saved.persistedPoints.length,
    geometryMatchesProvider:true,elevationPresent:saved.elevationPresent,status:saved.status,
    geometrySha256:hash(JSON.stringify(saved.persistedPoints))});
  run.savedExpected.push({name,coordinates:expectedCoordinates});
}

async function selectAndSave(page,run,provider,routeResult,fromCompare) {
  assert(routeResult&&routeResult.status>=200&&routeResult.status<300,'missing_success_response_'+provider);
  assert(routeResult.verified.valid,'independent_response_validation_failed_'+provider);
  if(fromCompare) await page.locator(provider==='gh'?'#routingCompareChooseGh':'#routingCompareChooseOrs').click();
  const geometries=routeResult.geometries;
  for(let i=0;i<geometries.length;i++){
    if(geometries.length>1){
      const chip=page.locator('#routingAlternativesChips [data-routing-alt-provider="'+provider+'"][data-routing-alt-index="'+i+'"]');
      await chip.click();
    }
    await page.waitForFunction(({count})=>state._routing.previewCoordinates?.length===count,{count:geometries[i].length},{timeout:5000});
    const ui=await readUi(page);
    const equal=pointsEqual(ui.preview,geometries[i]);
    run.selections.push({provider,index:i,points:ui.preview.length,geometryMatchesProvider:equal,
      resultVisible:ui.resultVisible,saveEnabled:ui.saveEnabled,previewLines:ui.previewLines,
      status:ui.status,activeOverlayKey:ui.activeOverlayKey});
    assert(equal&&ui.resultVisible&&ui.saveEnabled&&ui.detailsVisible,'alternative_ui_mismatch_'+provider+'_'+i);
  }
  const selected=geometries.length-1;
  await saveAndCheck(page,run,provider,geometries[selected]);
}

async function setForcedOfflineUi(page,enabled){
  await page.locator('#appTopbar [data-tab="layers"]').click();
  const details=page.locator('#offlineTilePanel');
  if(!await details.evaluate(e=>e.open))await details.locator(':scope > summary').click();
  await page.locator('#chkForceOffline').setChecked(enabled);
  await page.waitForFunction(v=>state.forceOffline===v,enabled);
  await page.locator('#layersPanelClose').click();
}

async function policyChecksUi(page,run,scenario){
  await enterUi(page,run,scenario);
  run.phase='policy';run.policyChecks=[];
  await setForcedOfflineUi(page,true);
  for(const which of ['offline','opsec']){
    if(which==='opsec'){
      await setForcedOfflineUi(page,false);
      await page.locator('#btnHeaderSettings').click();
      await page.locator('#btnHelp').click();
      await page.locator('#setOpsecStrict').check();
      await page.waitForFunction(()=>state.opsecStrict===true);
      await page.locator('#helpClose').click();
    }
    const expectedPolicy={forcedOffline:which==='offline',opsecStrict:which==='opsec'};
    await verifyInput(page,run,'before_'+which+'_comparison',expectedPolicy);
    const before=run.policyProviderAttempts.length;
    await page.locator('#routingCompareBtn').click();
    await page.waitForFunction(()=>!_routingCompareSession.loading&&!!_routingCompareSession.gh&&!!_routingCompareSession.ors,null,{timeout:10000});
    const ui=await readUi(page),expectedError=which==='offline'?'routing.errorOffline':'routing.errorOpsec';
    const check={policy:which,expectedPolicy,compare:ui.compare,status:ui.status,
      providerAttempts:run.policyProviderAttempts.length-before,postsTotal:routePostsTotal};
    run.policyChecks.push(check);
    assert(check.providerAttempts===0,'policy_triggered_provider_request_'+which);
    assert(ui.compare.gh==='fail'&&ui.compare.ors==='fail'&&ui.compare.ghError===expectedError&&ui.compare.orsError===expectedError,'policy_ui_mismatch_'+which);
    const message=await page.evaluate(k=>routingT(k,''),expectedError);
    check.visibleMessagesMatch=!!message&&ui.compare.ghUiText.includes(message)&&ui.compare.orsUiText.includes(message)
      &&await page.locator('#routingCompareGhBody').isVisible()&&await page.locator('#routingCompareOrsBody').isVisible();
    assert(check.visibleMessagesMatch,'policy_visible_message_mismatch_'+which);
    await page.screenshot({path:path.join(__dirname,run.name+'-'+which+'-pass.png')});
  }
}

async function executeScenario(browser,bytes,scenario) {
  const run={name:scenario.name,service:scenario.service,profile:scenario.profile,compare:!!scenario.compare,
    expectedGhProfile:scenario.service==='ors'?null:scenario.profile,
    expectedOrsProfile:scenario.compare?'cycling-mountain':scenario.service==='ors'?scenario.profile:null,
    passed:false,phase:'startup',inputChecks:[],requests:[],responses:[],pageErrors:[],requestFailures:[],
    nearestGuardChecks:[],rejectedProviderRequests:[],consoleErrors:[],policyProviderAttempts:[],documentChecks:[],
    nearestRequested:[0,0],nearestReceived:[null,null],requestPolicyValid:true,
    counts:{ghInfo:0,ghNearest:0,orsStatus:0,ghRoute:0,orsRoute:0,blockedPolicy:0},
    selections:[],saved:[],savedExpected:[],documentServes:0,documentRequests:0,
    favicon:{blockedByCdp:true,requests:[],responses:[],failures:[]}};
  const ctx=await browser.newContext({viewport:{width:1440,height:1000},serviceWorkers:'block',
    acceptDownloads:false,permissions:[],ignoreHTTPSErrors:false});
  const pending=new Set(), requestMeta=new Map(), validRoutes=new Map();
  const nearestReady=[Promise.resolve(),Promise.resolve()];
  const responsesDir=path.join(__dirname,'responses');fs.mkdirSync(responsesDir,{recursive:true});
  await ctx.routeWebSocket('**/*',ws=>{summary.browserNetwork.websocketsBlocked++;ws.close();});
  await ctx.route('**/*',async route=>{
    const req=route.request();
    if(req.url()===CANDIDATE_URL&&req.method()==='GET'){
      run.documentRequests++;
      if(QA_MODE==='postdeploy'){
        requestMeta.set(req,{policy:{kind:'document'},record:{kind:'document'}});
        return route.continue();
      }
      run.documentServes++;
      return route.fulfill({status:200,contentType:'text/html; charset=utf-8',body:bytes});
    }
    if(run.phase==='policy'){
      const u=new URL(req.url());
      if(/^\/(?:_routing\/gh\/|ors\/|v2\/directions\/)|^\/(?:info|nearest|route)$/.test(u.pathname)){
        run.policyProviderAttempts.push({method:req.method(),origin:u.origin,pathname:u.pathname});
        return route.abort('blockedbyclient');
      }
    }
    if(req.method()==='POST'&&req.url()===ORIGIN+'/_routing/gh/route'){
      const before=run.nearestReceived.map(p=>p&&p.slice());
      await Promise.all(nearestReady);
      run.nearestGuardChecks.push({before,after:run.nearestReceived.map(p=>p&&p.slice())});
    }
    const policy=classifyRequest(req,CANDIDATE_URL,run);
    if(!policy){
      const u=new URL(req.url());
      if(u.origin===ORIGIN&&req.method()==='POST'&&(/\/_routing\/gh\/route$|\/ors\/v2\/directions\//.test(u.pathname))){
        let body;try{body=JSON.parse(req.postData()||'null');}catch(_){}
        run.rejectedProviderRequests.push({pathname:u.pathname,keys:body&&typeof body==='object'?Object.keys(body):[],
          nearestObserved:run.nearestReceived.map(p=>p&&p.slice())});
      }
      return route.abort('blockedbyclient');
    }
    if(policy.kind.endsWith('Route')&&(run.phase!=='action'||routePostsTotal>=MAX_REAL_POSTS)){
      run.counts.blockedPolicy++;return route.abort('blockedbyclient');
    }
    let documentGate;
    if(QA_MODE==='postdeploy'&&policy.kind.endsWith('Route')){
      const doc=run.documentChecks.at(-1);
      if(run.responseObservationError||!doc||doc.sha256!==EXPECTED_SHA||run.documentChecks.length!==run.documentRequests){
        run.counts.blockedPolicy++;return route.abort('blockedbyclient');
      }
      documentGate={sha256:doc.sha256,url:doc.url,documentLoadsVerified:run.documentChecks.length};
    }
    if(policy.kind.endsWith('Route'))routePostsTotal++;
    run.counts[policy.kind]++;
    const record={kind:policy.kind,phase:run.phase,method:req.method(),pathname:new URL(req.url()).pathname,
      ...(policy.requestBody?{body:policy.requestBody}:{}),...(documentGate?{documentGate}:{}),startedAtUtc:new Date().toISOString()};
    let resolveNearest;
    if(policy.kind==='ghNearest')nearestReady[policy.targetIndex]=new Promise(resolve=>{resolveNearest=resolve;});
    run.requests.push(record);requestMeta.set(req,{policy,record,resolveNearest});
    return route.continue();
  });
  ctx.on('response',res=>{
    const known=requestMeta.get(res.request());if(!known)return;
    const work=(async()=>{
      const {policy}=known;
      const dataBytes=await res.body();
      if(policy.kind==='document'){
        const record={status:res.status(),bytes:dataBytes.length,sha256:hash(dataBytes),tls:await res.securityDetails(),
          contentType:res.headers()['content-type'],url:res.url(),intercepted:false};
        run.documentChecks.push(record);
        assert(record.sha256===EXPECTED_SHA,'deployed_document_hash_mismatch');
        assert(record.status===200&&dataBytes.includes(Buffer.from('const APP_BUILD_NUM = 280;')),'deployed_document_build_mismatch');
        return;
      }
      assert(dataBytes.length<=(policy.kind.endsWith('Route')?MAX_ROUTE_RESPONSE_BYTES:256*1024),'response_size_limit');
      const parsed=safeJson(dataBytes);
      const r={kind:policy.kind,status:res.status(),bytes:dataBytes.length,sha256:hash(dataBytes),
        tls:await res.securityDetails(),finishedAtUtc:new Date().toISOString()};
      if(policy.kind==='ghNearest'&&r.status===200){
        const point=parsed?.coordinates;
        assert(Array.isArray(point)&&point.length>=2&&point.slice(0,2).every(Number.isFinite),'nearest_invalid');
        const target=SYNTHETIC[policy.targetIndex];
        const distance=haversineM(target,{lon:point[0],lat:point[1]});
        r.snapDistanceM=distance;r.coordinates=point.slice(0,2);
        assert(distance<=MAX_NEAREST_DELTA_M,'nearest_exceeds_fixture_contract_5m');
        run.nearestReceived[policy.targetIndex]=point.slice(0,2);
      }
      if(policy.kind==='ghInfo'&&r.status===200)r.profiles=parsed?.profiles?.map(p=>p.name);
      if(policy.kind==='orsStatus'&&r.status===200)r.gatewayStatus=parsed?.status;
      if(policy.kind.endsWith('Route')){
        const provider=policy.kind==='ghRoute'?'gh':'ors';
        if(r.status>=200&&r.status<300){
          const checked=provider==='gh'?sanitizeGhResponse(parsed,policy.requestBody.points):sanitizeOrsResponse(parsed,policy.requestBody.coordinates);
          r.verified={valid:checked.valid,noFerry:checked.noFerry,snapVerified:checked.snapVerified,
            alternativeCount:checked.alternativeCount,previewPointCount:checked.previewPointCount};
          const geometries=provider==='gh'?parsed?.paths?.map(p=>p.points?.coordinates):parsed?.features?.map(f=>f.geometry?.coordinates);
          if(checked.valid&&!containsSensitiveKey(parsed)){
            const name=run.name+'-'+provider+'.json';
            fs.writeFileSync(path.join(responsesDir,name),dataBytes);
            r.rawResponseFile='responses/'+name;
          }
          validRoutes.set(provider,{status:r.status,verified:r.verified,geometries});
        }else r.error=reducedError(parsed);
      }
      run.responses.push(r);
    })().catch(e=>{run.responseObservationError=String(e.message||e);}).finally(()=>known.resolveNearest?.());
    pending.add(work);work.finally(()=>pending.delete(work));
  });
  ctx.on('requestfailed',q=>{if(requestMeta.has(q)){
    const known=requestMeta.get(q);known.resolveNearest?.();
    run.requestFailures.push({kind:known.policy.kind,error:q.failure()?.errorText||'unknown'});
  }});
  const page=await ctx.newPage();page.setDefaultTimeout(15000);
  const cdp=await ctx.newCDPSession(page),faviconIds=new Set();
  cdp.on('Network.requestWillBeSent',e=>{if(e.request.url===ORIGIN+'/favicon.ico'){
    faviconIds.add(e.requestId);run.favicon.requests.push({method:e.request.method,url:e.request.url});
  }});
  cdp.on('Network.responseReceived',e=>{if(e.response.url===ORIGIN+'/favicon.ico')run.favicon.responses.push({status:e.response.status,url:e.response.url});});
  cdp.on('Network.loadingFailed',e=>{if(faviconIds.has(e.requestId))run.favicon.failures.push({error:e.errorText,blockedReason:e.blockedReason});});
  await cdp.send('Network.enable');
  await cdp.send('Network.setBlockedURLs',{urls:[ORIGIN+'/favicon.ico']});
  page.on('pageerror',e=>run.pageErrors.push(String(e.message||e).slice(0,500)));
  page.on('console',m=>{if(m.type()==='error')run.consoleErrors.push({text:m.text().slice(0,500),url:m.location().url?.split('?')[0]||''});});
  page.on('dialog',d=>d.dismiss());
  try{
    await enterUi(page,run,scenario);
    await Promise.all([...pending]);
    if(QA_MODE==='postdeploy'){
      assert(!run.responseObservationError&&run.documentChecks.length===1,'initial_deployed_document_not_verified');
      run.buildUi=await page.evaluate(()=>({build:APP_BUILD_NUM,id:APP_BUILD_ID,title:document.title}));
      assert(run.buildUi.build===280,'deployed_browser_build_mismatch');
    }
    run.phase='action';
    const button=scenario.compare?'#routingCompareBtn':'#routingCalculateBtn';
    await page.locator(button).click();
    await page.waitForFunction(compare=>{
      if(compare)return !_routingCompareSession.loading&&!!(_routingCompareSession.gh||_routingCompareSession.ors);
      const r=state._routing;return !r.requestLoading&&!r.infoLoading&&
        (!!r.routeError||r.previewCoordinates?.length>1||r.points.some(p=>['rejected','no-road','out-of-coverage','confirm-required'].includes(p.snapStatus)));
    },!!scenario.compare,{timeout:45000});
    await Promise.all([...pending]);
    run.ui=await readUi(page);
    assert(!run.responseObservationError,'response_observation_failed');
    assert(run.requestFailures.length===0,'provider_transport_failed');
    assert(run.responses.every(r=>r.tls&&r.tls.protocol),'tls_details_missing');
    assert(run.ui.originals.length===2&&run.ui.originals.every((p,i)=>Math.abs(p.lat-SYNTHETIC[i].lat)<1e-8&&Math.abs(p.lon-SYNTHETIC[i].lon)<1e-8),'original_points_changed');
    if(scenario.compare){
      assert(run.ui.compare.gh==='pass'&&run.ui.compare.ors==='pass','compare_not_both_pass');
      assert(run.counts.ghRoute===1&&run.counts.orsRoute===1,'unexpected_compare_post_count');
      await selectAndSave(page,run,'gh',validRoutes.get('gh'),true);
      await selectAndSave(page,run,'ors',validRoutes.get('ors'),true);
    }else{
      const provider=scenario.service==='ors'?'ors':'gh';
      assert(run.counts.ghRoute+run.counts.orsRoute===1,'unexpected_single_post_count');
      await selectAndSave(page,run,provider,validRoutes.get(provider),false);
    }
    if(QA_MODE==='postdeploy')await page.screenshot({path:path.join(__dirname,run.name+'-routing-pass.png')});
    run.phase='reload';
    await page.reload({waitUntil:'domcontentloaded',timeout:60000});
    const restored=await page.evaluate(names=>names.map(n=>{
      const t=state.savedTracks?.find(t=>t.name===n);return {name:n,points:t?.points?.map(p=>({lat:p.lat,lon:p.lon}))};
    }),run.savedExpected.map(s=>s.name));
    run.reloadChecks=restored.map((r,i)=>({name:r.name,points:r.points?.length||0,matchesProvider:pointsEqual(r.points,run.savedExpected[i].coordinates)}));
    assert(run.reloadChecks.every(x=>x.matchesProvider),'reload_geometry_mismatch');
    if(QA_MODE==='postdeploy'){
      await policyChecksUi(page,run,scenario);
      await Promise.all([...pending]);
      assert(!run.responseObservationError&&run.documentChecks.length===run.documentRequests&&run.documentServes===0,'deployed_documents_not_verified');
      assert(run.documentChecks.every(d=>d.tls&&d.tls.protocol),'deployed_document_tls_missing');
      assert(run.favicon.responses.length===0,'favicon_bypassed_cdp_block');
      assert(run.consoleErrors.every(e=>e.text.includes('ERR_BLOCKED_BY_CLIENT')),'unexpected_browser_console_error');
    }
    assert(run.pageErrors.length===0,'page_errors');
    assert(run.counts.blockedPolicy===0&&run.requestPolicyValid,'request_policy_failed');
    run.passed=true;
  }catch(e){
    run.failure=String(e.message||e).slice(0,500);
    try{run.ui=await readUi(page);}catch(_){}
    try{await page.screenshot({path:path.join(__dirname,run.name+'-failure.png'),fullPage:false});run.failureScreenshot=run.name+'-failure.png';}catch(_){}
  }finally{
    await Promise.all([...pending]);
    await ctx.close();
    delete run.nearestRequested;delete run.nearestReceived;delete run.savedExpected;
    if(run.ui)delete run.ui.preview;
  }
  return run;
}

async function main(){
  assert(['prepublication','postdeploy'].includes(QA_MODE),'invalid_qa_mode');
  assert(process.env.GIS_REAL_QA_AUTHORIZED===(QA_MODE==='postdeploy'?'D2BIS_DEPLOY_PASS':'HTTPS443_PASS'),'real_network_not_authorized_by_parent');
  const bytes=fs.readFileSync(APP);assert(hash(bytes)===EXPECTED_SHA,'candidate_hash_mismatch');
  assert(['direct','ssh_forward'].includes(TRANSPORT),'invalid_transport');
  if(TRANSPORT==='ssh_forward')assert(Number.isInteger(SSH_FORWARD_PORT)&&SSH_FORWARD_PORT>1024&&SSH_FORWARD_PORT<65536,'invalid_dedicated_forward_port');
  const {chromium}=require('C:/goi-pw-probe/node_modules/playwright');
  let connect=null,browser=null;
  try{
    if(TRANSPORT==='ssh_forward')connect=await startRestrictedConnectProxy();
    const options={headless:true,executablePath:'C:/Users/Utente/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',
      args:['--disable-background-networking','--disable-component-update','--disable-sync','--disable-default-apps',
        '--disable-features=MediaRouter,OptimizationHints,AutofillServerCommunication','--no-first-run']};
    if(connect)options.proxy={server:connect.url,username:connect.username,password:connect.password};
    browser=await chromium.launch(options);
    const initial=QA_MODE==='postdeploy'?[{name:'postdeploy-compare-mtb',service:'graphhopper',profile:'mtb_trail',compare:true}]:[
      {name:'gh-hiking',service:'graphhopper',profile:'hiking'},
      {name:'ors-foot-hiking',service:'ors',profile:'foot-hiking'},
      {name:'compare-mtb',service:'graphhopper',profile:'mtb_trail',compare:true}
    ];
    for(const s of initial){
      const r=await executeScenario(browser,bytes,s);summary.runs.push(r);
      console.log(JSON.stringify({scenario:r.name,passed:r.passed,failure:r.failure,counts:r.counts}));
    }
    if(QA_MODE!=='postdeploy'&&summary.runs.every(r=>r.passed))for(const s of [
      {name:'gh-hiking-easy',service:'graphhopper',profile:'hiking_easy'},
      {name:'gh-mtb-touring',service:'graphhopper',profile:'mtb_touring'},
      {name:'ors-foot-walking',service:'ors',profile:'foot-walking'}
    ]){
      const r=await executeScenario(browser,bytes,s);summary.runs.push(r);
      console.log(JSON.stringify({scenario:r.name,passed:r.passed,failure:r.failure,counts:r.counts}));
    }
  }finally{
    if(browser)await browser.close();
    if(connect)await connect.close();
    summary.finishedAtUtc=new Date().toISOString();summary.routePostsTotal=routePostsTotal;
    summary.candidateAfterSha256=hash(fs.readFileSync(APP));
    summary.passed=summary.runs.length===(QA_MODE==='postdeploy'?1:6)&&summary.runs.every(r=>r.passed)&&summary.candidateAfterSha256===EXPECTED_SHA;
    fs.writeFileSync(path.join(__dirname,'results.json'),JSON.stringify(summary,null,2)+'\n');
  }
  console.log(JSON.stringify({passed:summary.passed,cases:summary.runs.length,routePostsTotal}));
  if(!summary.passed)process.exitCode=1;
}
main().catch(e=>{summary.fatal=String(e.message||e);summary.passed=false;fs.writeFileSync(path.join(__dirname,'results.json'),JSON.stringify(summary,null,2)+'\n');console.error(summary.fatal);process.exitCode=1;});
