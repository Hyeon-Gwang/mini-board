const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

// middlewares
const auth = require("./middlewares/auth");

const apiRouter = require("./routes/api");

// EJS setting
app.set("view engine", "ejs");
app.set("views", "./views");

// assets
app.use(express.static("assets"));

app.use(express.json());
app.use(cookieParser());

// mongoose
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/dbMiniBoard", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongoDB mini-board connection error:"));

const Posts = require("./models/post");
const Comments = require("./models/comment");

// /
app.get("/", auth, async (req, res) => {
  const page =  req.query.page ? parseInt(req.query.page) : 1;          // 현재 페이지
  const numPosts = await Posts.estimatedDocumentCount();                // 전체 포스트 갯수
  const wholePages = numPosts === 0 ? 1 : Math.ceil(numPosts / 15)      // 15로 나눠서 필요한 페이지 갯수 구하기
  // 현재 page에 맞춰서 포스트 가져오기
  const wholePosts = await Posts.find().sort("-createdAt").skip(15 * (page - 1)).limit(15).exec();

  const user = res.locals.user;
  res.render("index", {
    posts: wholePosts,
    pages: wholePages,
    user,
  });
});

app.get("/login", (req, res) => {
  res.render("login");
})

app.get("/signup", (req, res) => {
  res.render("signup");
});

// /search
app.get("/search", auth, async (req, res) => {
  try {
    const { type, value } = req.query;
    const page =  req.query.page ? parseInt(req.query.page) : 1;      // 현재 페이지
    let numSearchedPosts = 0;                                         // 검색된 포스트 갯수

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

    const user = res.locals.user;
    return res.render("search", {
      posts: searchedPosts,
      pages: wholePages,
      type,
      value,
      user,
    });
  } catch(error) {
    console.error(error);
    return res.status().send({ result: "error", error: error });
  }
});

// /write
app.get("/write", auth, (req, res) => {
  const user = res.locals.user;
  if(!user) {
    return res.redirect("/login");
  };
  return res.render("write");
});

// /edit
app.get("/edit", auth, (req, res) => {
  const user = res.locals.user;
  if(!user) {
    return res.redirect("/login");
  };

  return res.render("edit");
});

// /post?postId=4
app.get("/post", auth, async (req, res) => {
  try {
    const id = req.query.postId;
    const post = await Posts.findOne({ id: id }).exec();

    const comments = await Comments.find({ postId: post.id })
      .sort("-createdAt")
      .populate("writer", "_id nickname")
      .exec();

    const user = res.locals.user;
    return res.render("post", { post, user, comments });
  } catch(error) {
    console.error(error);
    return res.send({ result: "error", error: error});
  }
});

// APIs
app.use("/api", apiRouter);

app.listen(3000, () => {
  console.log("Mini-board server is running!!");
});