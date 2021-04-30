const { createReadStream } = require("fs");
console.log("[Module] Loaded fs");
const { createServer } = require("http");
console.log("[Module] Loaded http module");
const WebSocket = require("ws");
console.log("[Module] Loaded ws module");
const express = require("express");
console.log("[Module] Loaded express module");
const app = express();
console.log("[Express] Created app");
const megabyte = require("crypto").randomBytes(1024 * 1024); // This is 1 MB block of random data
console.log("[Crypto] Generated random 1MB data");
const server = createServer(app);
console.log("[Server] Server created");

const listener = server.listen(process.env.PORT, () => {
	console.log("Now listening on port:", listener.address().port);
});

app.use(express.static("public"));
app.use((req, res) => res.redirect("/"));
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
//	let duplex = WebSocket.createWebSocketStream(ws);
//	let stream = createReadStream("/dev/zero").pipe(duplex);
	if (req.url == "/__upload") {
		return setTimeout(() => {
			ws.close();
		}, 8000);
	}
	let mb = 0;
	let int = setInterval(() => {
		if (mb === 300) ws.close();
		ws.send(megabyte);
		mb++;
	});
	setTimeout(() => {
		if (ws.readyState == 2) return;
		clearInterval(int);
		ws.close();
	}, 8000);
	
	ws.on('close', () => {
		clearInterval(int);
	});
	ws.on('error', console.error);
});
