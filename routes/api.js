const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");

const jwt = require("jsonwebtoken");

const sanitizeHTML = require("sanitize-html");
function sanitize(text) {
  return sanitizeHTML(text, {
    allowedTags: [
      "address", "article", "aside", "footer", "header", "h1", "h2", "h3", "h4",
      "h5", "h6", "hgroup", "main", "nav", "section", "blockquote", "dd", "div",
      "dl", "dt", "figcaption", "figure", "hr", "li", "main", "ol", "p", "pre",
      "ul", "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn",
      "em", "i", "kbd", "mark", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp",
      "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr", "caption",
      "col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr",
      "img",
    ],
    allowedAttributes: { img: [ "src" ], },
    allowedSchemes: [ "data" ],
  })
}

const Users = require("../models/user");
const Posts = require("../models/post");
const Comments = require("../models/comment");

// 회원가입 POST /api/user/new
router.post("/user/new", async (req, res, next) => {
  try {
    const { email, nickname, password } = req.body;

    const isExist = await Users.findOne({
      $or: [{ email }, { nickname }],
    });
    if(isExist) {
      return res.status(400).send();
    };

    // Users에 user 저장
    const user = new Users({ email, nickname, password });
    await user.save();

    return res.status(201).send({ result: "success" });
  } catch(error) {
    console.error(error);
    next(error);
  };
});

// 로그인 POST /api/auth
router.post("/auth", async (req, res) => {
  const { email, password } = req.body;

  const user = await Users.findOne({ email });

  if(!user || password !== user.password) {
    return res.send({ result: "fail", message: "이메일 또는 패스워드가 맞지 않습니다." });
  }

  const token = jwt.sign({ email }, "Mini-Board-secret-key");

  res.cookie("MiniBoard", token, { path: "/", httpOnly: true, sameSite: "lax" });
  return res.status(200).send({
    result: "success",
  });
});

// 로그아웃 DELETE /api/auth
router.delete("/auth", (req, res) => {
  res.clearCookie("MiniBoard");
  return res.status(200).send({ result: "success" });
});

// 사용자 정보 가져오기
router.get("/user", auth, (req, res) => {
  const user = res.locals.user;
  return res.status(200).send({ user });
});

// 새 포스트 작성 POST /api/post/new
router.post("/post/new", async (req, res, next) => {
  try {
    const { title, content, writer, password, date } = req.body;

    const sanitizedTitle = sanitize(title);
    const sanitizedContent = sanitize(content);
    const sanitizedWriter = sanitize(writer);
    const sanitizedPassword = sanitize(password);

    let id  = 1;

    const lastPost = await Posts.findOne().sort("-createdAt").exec();
    if(lastPost) {
      id = lastPost.id + 1;
    };

    const newPost = new Posts({
      id,
      title: sanitizedTitle,
      content: sanitizedContent,
      writer: sanitizedWriter,
      password: sanitizedPassword,
      createdAt: date,
    });
    await newPost.save();

    return res.status(201).send({ result: "success" });
  } catch(error) {
    console.error(error);
    next(error);
  };
});

// 포스트 수정 PATCH /api/post/43
router.patch("/post/:postId", async (req, res, next) => {
  try {
    const id = req.params.postId;
    const { title, writer, content } = req.body

    await Posts.findOneAndUpdate({ id: id }, {
      title, writer, content
    });

    return res.status(201).send({ result: "success", id: id });
  } catch(error) {
    console.error(error);
    next(error);
  };
});

// 포스트 삭제 DELETE /api/post/43
router.delete("/post/:postId", async (req, res, next) => {
  try {
    const id = req.params.postId;

    await Posts.findOneAndDelete({ id: id });
    return res.status(200).send({ result: "success" });
  } catch(error) {
    console.error(error);
    next(error);
  };
});

// 포스트 비밀번호 확인 GET /api/post/1/password/1234
router.get("/post/:postId/password/:password", async (req, res, next) => {
  try {
    const { postId, password } = req.params;
    const post = await Posts.findOne({ id: postId });

    const passwordCheck = post.password === password;
    if(passwordCheck) {
      return res.status(200).send({ result: "success" });
    };
    return res.status(200).send({ result: "fail" });
  } catch(error) {
    console.error(error);
    next(error);
  };
});

// 댓글 작성 POST /api/post/1/comment/new
router.post("/post/:postId/comment", auth, async (req, res, next) => {
  try {
    const user = res.locals.user;
    if(!user) {
      return res.status(401).send({
        result: "fail", message: "로그인 후 작성 가능합니다."
      })
    };
    const { postId } = req.params;
    const { comment, date } = req.body;
    // 비밀번호 id 만들기
    let id  = 1;
    const lastComment = await Comments.findOne().sort("-createdAt").exec();
    if(lastComment) {
      id = lastComment.id + 1;
    };
    
    const newComment = new Comments({
      id,
      comment,
      postId,
      writer: user.id,
      createdAt: date,
    })
    await newComment.save();
    return res.status(201).send({ result: "success" });
  } catch(error) {
    console.error(error);
    next(error);
  };
});

// 댓글 수정 PATCH /api/post/1/comment/3
router.patch("/post/:postId/comment/:commentId", async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const { comment } = req.body

    await Comments.findOneAndUpdate({ id: commentId }, {
      comment,
    });

    return res.status(201).send({ result: "success" });
  } catch(error) {
    console.error(error);
    next(error);
  };
});

// 댓글 삭제 DELETE /api/post/1/comment
router.delete("/post/:postId/comment/:commentId", async (req, res, next) => {
  try {
    const { commentId } = req.params;
    
    await Comments.findOneAndDelete({ id: commentId });
    return res.status(200).send({ result: "success" });
  } catch(error) {
    console.error(error);
    next(error);
  };
});


module.exports = router;