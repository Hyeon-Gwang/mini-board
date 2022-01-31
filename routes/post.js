const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");

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

const Posts = require("../models/post");
const Comments = require("../models/comment");

// 새 포스트 작성 POST /api/post/new
router.post("/new", async (req, res, next) => {
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

    return res.status(201).send({ result: "success", postId: id });
  } catch(error) {
    console.error(error);
    next(error);
  };
});

// 포스트 정보 불러오기
router.get("/:postId", async (req, res, next) => {
  try {
    const id = req.params.postId;

    const post = await Posts.findOne({ id: id });
    return res.status(200).send(post);
  } catch(error) {
    console.error(error);
    next(error);
  }
});

// 포스트 수정 PATCH /api/post/43
router.patch("/:postId", async (req, res, next) => {
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
router.delete("/:postId", async (req, res, next) => {
  try {
    const id = req.params.postId;

    // 포스트 삭제
    await Posts.findOneAndDelete({ id: id });

    // 포스트의 댓글 삭제
    await Comments.deleteMany({ postId: id });
    return res.status(200).send({ result: "success" });
  } catch(error) {
    console.error(error);
    next(error);
  };
});

// 포스트 비밀번호 확인 GET /api/post/1/password/1234
router.get("/:postId/password/:password", async (req, res, next) => {
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
router.post("/:postId/comment", auth, async (req, res, next) => {
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
router.patch("/:postId/comment/:commentId", async (req, res, next) => {
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
router.delete("/:postId/comment/:commentId", async (req, res, next) => {
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