const express = require("express");
const router = express.Router();

router.get('/posts', (req, res) => {
  res.send('모든 포스트 불러오기')
})

module.exports = router;