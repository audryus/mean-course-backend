const path = require("path")
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const postRoutes = require("./routes/post.routes");
const userRoutes = require("./routes/user.routes");
const app = express();

mongoose
  .connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/node-angular`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to dataBase.");
  })
  .catch(err => {
    console.error("Erro to connect to database.", err);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("images")));

app.use("/v1/api/post/", postRoutes);
app.use("/v1/api/user/", userRoutes);

module.exports = app;
