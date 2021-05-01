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
const server = createServer(app);
console.log("[Server] Server created");

const listener = server.listen(process.env.PORT, () => {
  console.log("Now listening on port:", listener.address().port);
});

app.use(express.static("public"));
app.use((req, res) => res.redirect("/"));
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws, req) => {
  ws.on("message", m => ws.send(m.length));
  if (req.url == "/__upload") {
    return setTimeout(() => {
      if (ws.readyState == 2) return;
      ws.close();
    }, 8000);
  }
  let duplex = WebSocket.createWebSocketStream(ws);
  let stream = createReadStream("/dev/zero").pipe(duplex);
  let mb = 0;
  setTimeout(() => {
    if (ws.readyState == 2) return;
    stream.destroy();
    ws.close();
  }, 8000);

  ws.on("close", () => {
    stream.destroy();
  });
  duplex.on("error", () => stream.destroy());
});
