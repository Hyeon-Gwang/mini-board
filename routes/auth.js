const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const auth = require("../middlewares/auth");

const Users = require("../models/user");

// 회원가입 POST /api/auth/new
router.post("/new", async (req, res, next) => {
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

// 사용자 정보 가져오기
router.get("/", auth, (req, res) => {
  const user = res.locals.user;
  return res.status(200).send({ user });
});

// 로그인 POST /api/auth
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  const user = await Users.findOne({ email });

  if(!user || password !== user.password) {
    return res.send({ result: "fail", message: "이메일 또는 패스워드가 맞지 않습니다." });
  };

  const token = jwt.sign({ email }, "Mini-Board-secret-key");

  res.cookie("MiniBoard", token, { path: "/", httpOnly: true, sameSite: "lax" });
  return res.status(200).send({
    result: "success",
  });
});

// 로그아웃 DELETE /api/auth
router.delete("/", (req, res) => {
  res.clearCookie("MiniBoard");
  return res.status(200).send({ result: "success" });
});

module.exports = router;