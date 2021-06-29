const { createServer } = require("http");
const WebSocket = require("ws");
const express = require("express");
const app = express();
const { createReadStream } = require("fs");
const server = createServer(app);

const listener = server.listen(process.env.PORT, () => {
  console.log("Now listening on port:", listener.address().port);
});

app.use(express.static(__dirname + "/public"));
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws, req) => {
  ws.on("message", m => ws.send(m.length));
  if (req.url == "/__upload") {
    return setTimeout(() => {
      if (ws.readyState == 2) return;
      ws.close();
    }, 8000);
  }

  let stream = createReadStream("/dev/urandom").pipe(WebSocket.createWebSocketStream(ws));
  setTimeout(() => {
    if (ws.readyState == 2) return;
    stream.destroy();
    ws.close();
  }, 8000);
  ws.on('error', () => ws.close());
});
