const userModel = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
module.exports = {
  registerUser: async (req, res) => {
    const { password, board_user } = req.body;

    const user = { password, board_user };  // Ensure `board_user` is correctly included

    try {
      const userInfo = await userModel.createUser(user);
      res.status(201).json({
        message: "User registered successfully",
        user: userInfo,
      });
    } catch (error) {
      console.log(error);
      if (error.code === "23505") {  // Duplicate key error
        return res.status(409).json({ message: "User already exists" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  },
  loginUser: async (req, res) => {
    const { board_user, password } = req.body;

    try {
      const user = await userModel.getUserByName(board_user);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Authentication failed" });
      }

      const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

      const accesstoken = jwt.sign(
        { userid: user.id, board_user: user.board_user },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }  // Adjusted to 15 minutes
      );

      const refreshtoken = jwt.sign(
        { userid: user.id, board_user: user.board_user },
        REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }  // Adjusted to 7 days
      );

      res.cookie("token", accesstoken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,  // 15 minutes
        sameSite: "None",
        secure: process.env.NODE_ENV === "production",
      });

      res.cookie("refresh", refreshtoken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
        sameSite: "None",
        secure: process.env.NODE_ENV === "production",
      });

      await userModel.updateRefreshToken(refreshtoken, user.id);

      res.json({
        message: "Login successful",
        user: { userid: user.id, board_user: user.board_user },
        token: accesstoken,
        refresh: refreshtoken,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
}