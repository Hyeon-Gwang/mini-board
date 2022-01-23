const express = require("express");
const router = express.Router();

const Posts = require("../models/post");

// 새 포스트 작성 POST /api/post/new
router.post("/post/new", async (req, res) => {
  try {
    const { title, content, writer, password, date } = req.body;

    let id  = 1;

    const lastPost = await Posts.findOne().sort("-createdAt").exec();
    if(lastPost) {
      id = lastPost.id + 1;
    };

    const newPost = new Posts({ id, title, content, writer, password, createdAt: date, });
    await newPost.save();

    return res.status(201).send({ result: "success" });
  } catch(error) {
    console.error(error);
    return res.status().send({ result: "error", error: error });
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