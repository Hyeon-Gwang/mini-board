const jwt = require("jsonwebtoken");
const Users = require("../models/user");

module.exports = async (req, res, next) => {
  const token = req.cookies.MiniBoard;

  if(token) {
    try {
      const { email } = jwt.verify(token,  "Mini-Board-secret-key");
      
      const user = await Users.findOne({ email });
      res.locals.user = user;
      return next();
    } catch(error) {
      console.error();
      return res.status(400).send({ result: "error", error });
    };
  };
  next();
};