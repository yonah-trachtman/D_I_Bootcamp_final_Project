const jwt = require("jsonwebtoken");
require("dotenv").config();

const { ACCESS_TOKEN_SECRET } = process.env;

const verifyToken = (req, res, next) => {
  const accesstoken = req.cookies.token || req.headers["x-accees-token"];

  console.log("accesstoken=>", accesstoken);

  if (!accesstoken) return res.status(401).json({ message: "unauthorized" });

  jwt.verify(accesstoken, ACCESS_TOKEN_SECRET, (err, decode) => {
    if (err)
      return res.status(403).json({ message: "forbidden", error: err.message });

    const { userid, board_user } = decode;
    req.userid = userid;
    req.board_user = board_user;


    next();
  });
};

module.exports = {
  verifyToken,
};
