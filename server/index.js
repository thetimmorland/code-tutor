var WebSocket = require("ws");
const port = process.env.PORT || 8080;

var wss = new WebSocket.Server({ port });

let doc = "hello";

wss.on("connection", (ws, req) => {
  ws.send(doc);

  ws.on("message", (msg) => {
    doc = msg;
    wss.clients.forEach((client) => client.send(doc));
  });
});

console.log("Listening on port", port);
