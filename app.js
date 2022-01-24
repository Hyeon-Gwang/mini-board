const express = require("express");
const ejs = require("ejs");

const app = express();

const apiRouter = require("./routes/api");

// EJS setting
app.set("view engine", "ejs");
app.set("views", "./views");

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

// /
app.get("/", async (req, res) => {
  const page = parseInt(req.query.page);                  // 현재 페이지
  const numPosts = await Posts.estimatedDocumentCount();  // 전체 포스트 갯수
  const wholePages = Math.ceil(numPosts / 15)             // 15로 나눠서 필요한 페이지 갯수 구하기

  // 현재 page에 맞춰서 포스트 가져오기
  const wholePosts = await Posts.find().sort("-createdAt").skip(15 * (page - 1)).limit(15).exec();

  res.render("index", {
    posts: wholePosts,
    pages: wholePages,
  });
});

// /search
app.get("/search", async (req, res) => {
  try {
    const { type, value, page } = req.query;
    let numSearchedPosts = 0;                           // 검색된 포스트 갯수

    let searchedPosts = [];

    if(type === "writer") {
      numSearchedPosts = await Posts.countDocuments({ writer: { "$regex": value }, });
      searchedPosts = await Posts
        .find({ writer: { "$regex": value }, })
        .sort("-createdAt")
        .skip(15 * (page - 1)).limit(15)
        .exec();
    } else if(type === "title") {
      numSearchedPosts = await Posts.countDocuments({ title: { "$regex": value }, });
      searchedPosts = await Posts
        .find({ title: { "$regex": value }, })
        .sort("-createdAt")
        .skip(15 * (page - 1)).limit(15)
        .exec();
    } else if(type === "content") {
      numSearchedPosts = await Posts.countDocuments({ content: { "$regex": value }, });
      searchedPosts = await Posts
        .find({ content: { "$regex": value }, })
        .sort("-createdAt")
        .skip(15 * (page - 1)).limit(15)
        .exec();
    } else {
      numSearchedPosts = await Posts.countDocuments({ createdAt: { "$regex": value }, });
      searchedPosts = await Posts
        .find({ createdAt: { "$regex": parseInt(value) } })
        .sort("-createdAt")
        .skip(15 * (page - 1)).limit(15)
        .exec();
    }

    const wholePages = Math.ceil(numSearchedPosts / 15)          // 15로 나눠서 필요한 페이지 갯수 구하기

    return res.render("search", {
      posts: searchedPosts,
      pages: wholePages,
      type,
      value,
    });
  } catch(error) {
    console.error(error);
    return res.status().send({ result: "error", error: error });
  }
});

// /write
app.get("/write", async (req, res) => {
  try {
    const postId = req.query.postId;
    if(postId) { // 수정 하는 경우
      const post = await Posts.findOne({ id: postId }, { _id: false });
      return res.render("write", { post: post });
    }
    // 새로운 포스트 작성하는 경우
    return res.render("write");
  } catch(error) {
    console.error(error);
    return res.send({ result: "error", error: error });
  }
});

// /post?postId=4
app.get("/post", async (req, res) => {
  try {
    const id = req.query.postId;
    const post = await Posts.findOne({ id: id });
  
    return res.render("post", { post: post });
  } catch(error) {
    console.error(error);
    return res.send({ result: "error", error: error});
  }
});

// APIs
app.use("/api", apiRouter);

app.listen(8080, () => {
  console.log("Mini-board server is running!!");
});