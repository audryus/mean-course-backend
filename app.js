const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const postsRoutes = require("./routes/posts");
const app = express();

mongoose
  .connect("mongodb://aubay:AwXzSA5dVCq7S6Wq@192.168.56.3/node-angular", {
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

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/post/", postsRoutes);

module.exports = app;
