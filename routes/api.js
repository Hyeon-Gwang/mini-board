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

// 회원가입 POST /api/user/new
router.post("/user/new", async (req, res) => {
  try {
    const { email, nickname, password } = req.body;

    const isExist = await Users.findOne({
      $or: [{ email }, { nickname }],
    });
    if(isExist) {
      return res.status(400).send({ result: "fail", message: "이미 사용중인 이메일 혹은 닉네임입니다." });
    };

    // 마지막 user id 값 찾고 + 1 해서 userId 값으로 할당 / 없으면 1로
    const lastUser = await Users.findOne().sort("-id").exec();
    const userId = lastUser
      ? lastUser.id + 1
      : 1;

    // Users에 user 저장
    const user = new Users({ id: userId, email, nickname, password });
    await user.save();

    return res.status(201).send({ result: "success" });
  } catch(error) {
    console.error(error);
    return res.status(400).send({ result: "error", error });
  };
});

// 로그인 POST /api/auth
router.post("/auth", async (req, res) => {
  const { email, password } = req.body;

  const user = await Users.findOne({ email });

  if(!user || password !== user.password) {
    return res.status(400).send({ result: "fail", message: "이메일 또는 패스워드가 맞지 않습니다." });
  }

  const token = jwt.sign({ email }, "Mini-Board-secret-key");

  res.cookie("MiniBoard", token, { path: "/", httpOnly: true });
  return res.status(200).send({
    result: "success",
  });
});


// 새 포스트 작성 POST /api/post/new
router.post("/post/new", async (req, res) => {
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

    const newPost = new Posts({ id,
      title: sanitizedTitle,
      content: sanitizedContent,
      writer: sanitizedWriter,
      password: sanitizedPassword,
      createdAt: date
    });
    await newPost.save();

    return res.status(201).send({ result: "success" });
  } catch(error) {
    console.error(error);
    return res.status().send({ result: "error", error: error });
  };
});

// 포스트 수정 PATCH /api/post/43
router.patch("/post/:postId", async (req, res) => {
  try {
    const id = req.params.postId;
    const { title, writer, content } = req.body

    await Posts.findOneAndUpdate({ id: id }, {
      title, writer, content
    });

    return res.status(201).send({ result: "success", id: id });
  } catch(error) {
    console.error(error);
    return res.status().send({ result: "error", error: error });
  };
});

// 포스트 삭제 DELETE /api/post/43
router.delete("/post/:postId", async (req, res) => {
  try {
    const id = req.params.postId;

    await Posts.findOneAndDelete({ id: id });
    return res.status(200).send({ result: "success" });
  } catch(error) {
    console.error(error);
    return res.send({ result: "error", error: error });
  };
});

// 포스트 비밀번호 확인 GET /api/post/1/password/1234
router.get("/post/:postId/password/:password", async (req, res) => {
  try {
    const { postId, password } = req.params;
    const post = await Posts.findOne({ id: postId });

    const passwordCheck = post.password === password;
    if(passwordCheck) {
      return res.status(200).send({ result: "success" });
    }
    return res.status(200).send({ result: "fail" });
  } catch(error) {
    console.error(error);
    return res.send({ result: "error", error: error });
  };
});

module.exports = router;