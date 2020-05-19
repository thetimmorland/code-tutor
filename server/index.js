const express = require("express");
const expressWs = require("express-ws");

const app = express();
expressWs(app);

app.ws("/socket", (ws, req) => {
  ws.on("open", () => {
    ws.send("Hello World!");
  });

  ws.on("message", (msg) => {
    console.log(msg);
  });

  ws.on("close", () => {
    console.log("goodbye");
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
