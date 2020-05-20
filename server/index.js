const express = require("express");
const socketIO = require("socket.io");

const PORT = process.env.PORT || 8080;

const server = express()
  .use((req, res) => {
    res.sendStatus(200);
  })
  .listen(PORT, () => console.log(`listening on ${PORT}`));

const io = socketIO(server);

let doc = "";

io.on("connection", (socket) => {
  socket.emit("sync", doc);

  socket.on("insert", (insert) => {
    socket.broadcast.emit("insert", insert);
  });

  socket.on("remove", (remove) => {
    socket.broadcast.emit("remove", remove);
  });
});
