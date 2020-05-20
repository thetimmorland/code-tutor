import express from "express";
import socketIO from "socket.io";
import Rope from "jumprope";
import assert from "assert";

const PORT = process.env.PORT || 8080;

const server = express()
  .use((req, res) => {
    res.sendStatus(200);
  })
  .listen(PORT, () => console.log(`listening on ${PORT}`));

const io = socketIO(server);

let doc = new Rope("");

io.on("connection", (socket: any) => {
  socket.emit("sync", doc.toString());

  socket.on("sync", () => {
    socket.emit("sync", doc.toString());
  })

  socket.on("insert", (event: any) => {
    try {
      doc.insert(event.offset, event.value);
      socket.broadcast.emit("insert", event);
    } catch (err) {
      console.log(err);
      socket.emit("sync", doc.toString());
    }
  });

  socket.on("remove", (event: any) => {
    try {
      assert(event.value === doc.substring(event.offset, event.count));
      doc.del(event.offset, event.count);
      socket.broadcast.emit("remove", event);
    } catch (err) {
      console.log(err);
      socket.emit("sync", doc.toString());
    }
  });
});
