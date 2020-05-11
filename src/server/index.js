const express = require("express");
const app = express();

const models = require("./models");

app.use(express.static("dist"));

models.sequelize.sync().then(() => {
  app.listen(process.env.PORT || 8080, () => {
    console.log(`Listening on port ${process.env.PORT || 8080}!`);
  })
});
