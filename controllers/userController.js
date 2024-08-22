const userModel = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  registerUser: async (req, res) => {
    const { password, board_user } = req.body;

    const user = { password, board_user };

    try {
      const userInfo = await userModel.createUser(user);
      res.status(201).json({
        message: "User registered successfully",
        user: userInfo,
      });
    } catch (error) {
      console.log(error);
      if (error.code == 23505) {
        return res.status(200).json({ message: "User already exist" });
      }
      res.status(500).json({ message: "internal server error" });
    }
  },
  loginUser: async (req, res) => {
    const { board_user, password } = req.body;

    try {
      const user = await userModel.getUserByName(board_user);

      if (!user) {
        return res.status(404).json({ message: "User not found, ...." });
      }

      const passwordMatch = await bcrypt.compare(password + "", user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Authentication failed..." });
      }


      const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

      const accesstoken = jwt.sign(
        { userid: user.id, board_user: user.board_user },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "120s" }
      );

      const refreshtoken = jwt.sign(
        { userid: user.id, board_user: user.board_user },
        REFRESH_TOKEN_SECRET,
        { expiresIn: "3d" }
      );

  
      res.cookie("token", accesstoken, {
        httpOnly: true,
        maxAge: 120 * 1000,
      });

      res.cookie("refresh", refreshtoken, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000 * 24,
      });

      await userModel.updateRefreshToken(refreshtoken, user.id);

      res.json({
        message: "Login succesfully",
        user: { userid: user.id, board_user: user.board_user },
        token: accesstoken,
        refresh: refreshtoken,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "internal server error" });
    }
  },
}
