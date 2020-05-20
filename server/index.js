const express = require("express");
const socketIO = require("socket.io");
const Rope = require("jumprope");

const PORT = process.env.PORT || 8080;

const server = express()
  .use((req, res) => {
    res.sendStatus(200);
  })
  .listen(PORT, () => console.log(`listening on ${PORT}`));

const io = socketIO(server);

let doc = new Rope("");

io.on("connection", (socket) => {
  socket.emit("sync", doc.toString());

  socket.on("insert", (event) => {
    socket.broadcast.emit("insert", insert);
    console.log(insert.offset, insert.value);
    doc.insert(insert.offset, insert.value);
  });

  socket.on("remove", (event) => {
    doc.del(remove.offset, remove.count, (deleted) => {
      if (deleted !== remove.value) {
      }
    });

    socket.broadcast.emit("remove", remove);
  });
});
