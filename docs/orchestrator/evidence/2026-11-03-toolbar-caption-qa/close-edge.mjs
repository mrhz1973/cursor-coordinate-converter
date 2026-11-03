const info = await (await fetch('http://127.0.0.1:19451/json/version')).json();
const ws = new WebSocket(info.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen=resolve; ws.onerror=reject; });
const result = await new Promise((resolve, reject) => {
  ws.onmessage = e => resolve(JSON.parse(typeof e.data==='string'?e.data:'{}'));
  ws.send(JSON.stringify({id:1,method:'Browser.close'}));
  setTimeout(()=>reject(new Error('Browser.close timeout')),5000).unref?.();
});
console.log(JSON.stringify({closed:true,response:result}));
