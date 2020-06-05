const port = process.env.PORT || 8080;

const express = require("express");
const app = express();
const expressWs = require("express-ws")(app);

const uuid = require("uuid");
const ShareDb = require("sharedb");
const shareDbMongo = require("sharedb-mongo");
const WebSocketJSONStream = require("@teamwork/websocket-json-stream");

// configure express

app.get("/api/createSketch", (req, res) => {
  const connection = share.connect();
  const id = uuid.v4();
  const doc = connection.get("collection", id);

  doc.fetch((err) => {
    if (err) throw err;
    doc.create(
      {
        code:
          "function setup() {\n  createCanvas(windowWidth, windowHeight);\n}\n\n" +
          "function draw() {\n  background(220);\n  circle(mouseX, mouseY, 100);\n}",
      },
      (err) => {
        if (err) throw err;
        res.send(id);
      }
    );
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// configure sharedb

app.ws("/websocket", () => {});

const db = new shareDbMongo(
  process.env.DATABASE + (process.env.NODE_ENV || "development"),
  { mongoOptions: { useUnifiedTopology: true } }
);

const share = new ShareDb({ db });

expressWs.getWss().on("connection", (ws) => {
  const stream = new WebSocketJSONStream(ws);
  share.listen(stream);
});

// start server

app.listen(port, () => {
  console.log(`listening on port: ${port}`);
});
