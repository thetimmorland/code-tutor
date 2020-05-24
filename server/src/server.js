const { Duplex } = require("stream");
const browserChannel = require("browserchannel").server;
const connect = require("connect");
const livedb = require("livedb");
const sharejs = require("share");

const backend = livedb.client(livedb.memory());
const share = sharejs.server.createClient({ backend });

const webserver = connect();

webserver.use(
  browserChannel({ webserver, sessionTimoutInterval: 5000 }, (client) => {
    var stream = new Duplex({ objectMode: true });

    stream._read = () => {};
    stream._write = (chunk, encoding, callback) => {
      if (client.state !== "closed") {
        client.send(chunk);
      }
      callback();
    };

    client.on("message", (data) => {
      stream.push(data);
    });

    client.on("close", (reason) => {
      stream.push(null);
      stream.emit("close");
    });

    stream.on("end", () => {
      client.close();
    });

    // Give the stream to sharejs
    return share.listen(stream);
  })
);

const PORT = process.env.PORT || 8080;
webserver.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
