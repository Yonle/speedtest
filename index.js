const { createReadStream } = require("fs");
const { createServer } = require("http");
const WebSocket = require("ws");
const express = require("express");
const app = express();
const randomData = require("crypto").randomBytes(64000);
const server = createServer(app);

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
  let send = () => {
    if (ws.readyState == 2) return;
  	ws.send(randomData, (err) => {
  		if (err) return ws.close();
  		send();
  	});
  }
  send();
  setTimeout(() => {
    if (ws.readyState == 2) return;
    ws.close();
  }, 8000);
  ws.on('error', () => ws.close());
});
