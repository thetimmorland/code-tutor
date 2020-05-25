const port = process.env.PORT || 8080;

const WebSocket = require("ws");
const WebSocketJSONStream = require("@teamwork/websocket-json-stream");
const ShareDB = require("sharedb");

const server = new WebSocket.Server({ port });
const share = new ShareDB();

server.on("connection", (ws) => {
  const stream = new WebSocketJSONStream(ws);
  share.listen(stream);
});

console.log("listening on port: " + port);
