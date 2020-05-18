var http = require("http");
var express = require("express");
const ShareDB = require("sharedb");
var WebSocket = require("ws");
var WebSocketJSONStream = require("@teamwork/websocket-json-stream");

const backend = new ShareDB({ presence: true });

var app = express();
var server = http.createServer(app);

// Connect any incoming WebSocket connection to ShareDB
var wss = new WebSocket.Server({ server: server });
wss.on("connection", function (ws) {
  var stream = new WebSocketJSONStream(ws);
  backend.listen(stream);
});

server.listen(8080);
console.log("Listening on http://localhost:8080");
