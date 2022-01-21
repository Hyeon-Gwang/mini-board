const express = require("express");
const bodyParser = require("body-parser");
const ejs = require('ejs');

const app = express();

const apiRouter = require('./routes/api');

// EJS setting
app.set("view engine", "ejs");
app.set('views', "./views");

// assets
app.use(express.static("assets"));

// mongoose
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/mini-board", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongoDB mini-board connection error:"));

// DB
// const Post = require("./models/post");

app.get("/", (req, res) => {
  res.render('index', {
    title: "Mini Board | Home",
    length: 5
  });
});

app.get("/post", (req, res) => {
  res.render('post', {
    title: "Mini Board | Post",
    name: "예시 이름"
  })
})

// APIs
app.use("/api", apiRouter);

app.listen(8080, () => {
  console.log("Mini-board server is running!!");
});