const express = require("express");
const router = express.Router();

const Posts = require("../models/post");

router.get('/posts', (req, res) => {
  res.send('모든 포스트 불러오기')
});

// 새 포스트 작성 POST /api/post/new
router.post('/post/new', async (req, res) => {
  try {
    const { title, content, writer, password, date } = req.body;

    let id  = 1;

    const lastPost = await Posts.findOne().sort("-createdAt").exec();
    if(lastPost) {
      id = lastPost.id + 1;
    };

    const newPost = new Posts({ id, title, content, writer, password, createdAt: date, });
    await newPost.save();

    return res.status(201).send({ result: 'success' });
  } catch(error) {
    console.error(error);
    return res.status(404).send({ result: 'fail', error: error });
  }
  
});

module.exports = router;