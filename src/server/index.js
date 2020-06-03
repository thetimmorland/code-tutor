require("dotenv").config();
const port = process.env.PORT || 3000;

const express = require("express");
const WebSocketJSONStream = require("@teamwork/websocket-json-stream");
const ShareDb = require("sharedb");
const uuid = require("uuid");
const shareDbMongo = require("sharedb-mongo");

const codeTemplate = `function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  circle(mouseX, mouseY, 50);
}`;

ShareDb.logger.setMethods({
  info: () => console.log(),
  warn: () => console.log(),
  error: () => console.log(),
});

const db = new shareDbMongo(
  process.env.DATABASE + (process.env.NODE_ENV || "development"),
  { mongoOptions: { useUnifiedTopology: true } }
);

const app = express();
const expressWs = require("express-ws")(app);
const share = new ShareDb({ db });

app.use(express.static("dist"));

expressWs.getWss().on("connection", (ws) => {
  const stream = new WebSocketJSONStream(ws);
  share.listen(stream);
});

app.ws("/socket", () => {});

app.get("/api/createSketch", (req, res) => {
  const connection = share.connect();
  const id = uuid.v4();
  const doc = connection.get("collection", id);

  doc.fetch((err) => {
    if (err) throw err;
    doc.create({ code: codeTemplate }, (err) => {
      if (err) throw err;
      res.send(id);
    });
  });
});

app.listen(port, () => {
  console.log(`listening on port: ${port}`);
});
