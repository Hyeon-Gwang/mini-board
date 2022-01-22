const express = require("express");
// const bodyParser = require("body-parser");
const ejs = require('ejs');

const app = express();

const apiRouter = require('./routes/api');

// EJS setting
app.set("view engine", "ejs");
app.set('views', "./views");

// assets
app.use(express.static("assets"));

app.use(express.json());

// mongoose
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/dbMiniBoard", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongoDB mini-board connection error:"));

const Posts = require("./models/post");

app.get("/", async (req, res) => {
  const page = parseInt(req.query.page);                  // 현재 페이지
  const numPosts = await Posts.estimatedDocumentCount();  // 전체 포스트 갯수
  const wholePages = Math.ceil(numPosts / 15)          // 15로 나눠서 필요한 페이지 갯수 구하기

  // 현재 page에 맞춰서 포스트 가져오기
  const wholePosts = await Posts.find().sort("-createdAt").skip(15 * (page - 1)).limit(15).exec();

  res.render('index', {
    posts: wholePosts,
    pages: wholePages,
  });
});

app.get("/post", (req, res) => {
  res.render('post', {
    title: "Mini Board | Post",
    name: "예시 이름"
  });
});

// APIs
app.use("/api", apiRouter);

app.listen(8080, () => {
  console.log("Mini-board server is running!!");
});