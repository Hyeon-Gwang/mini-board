const express = require("express");
const router = express.Router();

router.get('/posts', (req, res) => {
  res.send('모든 포스트 불러오기')
});

// 새 포스트 작성 POST /api/post/new
router.post('/post/new', async (req, res) => {
  // const { title, content, password } = req.body;

  // await miniBoardPosts.create({ title, content, password });

  // return res.status(201).send({ result: 'success' });
});

router.post('/test', (req, res) => {
  const { title, content, password } = req.body;

  console.log('api server:', title, content, password)

  return res.status(201).send({ title, content, password});
})

module.exports = router;