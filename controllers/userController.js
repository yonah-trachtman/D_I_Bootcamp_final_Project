const userModel = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  registerUser: async (req, res) => {
    const { password, email } = req.body;

    const user = { password, email };

    try {
      const userInfo = await userModel.createUser(user);
      res.status(201).json({
        message: "User registered successfully",
        user: userInfo,
      });
    } catch (error) {
      console.log(error);
      if (error.code == 23505) {
        return res.status(200).json({ message: "Email already exist" });
      }
      res.status(500).json({ message: "internal server error" });
    }
  },
  loginUser: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await userModel.getUserByEmail(email);

      if (!user) {
        return res.status(404).json({ message: "User not found, ...." });
      }

      const passwordMatch = await bcrypt.compare(password + "", user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Authentication failed..." });
      }

      /** create the token */
      const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

      const accesstoken = jwt.sign(
        { userid: user.id, email: user.email },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "60s" }
      );

      const refreshtoken = jwt.sign(
        { userid: user.id, email: user.email },
        REFRESH_TOKEN_SECRET,
        { expiresIn: "3d" }
      );

      // set token in httpOnly
      res.cookie("token", accesstoken, {
        httpOnly: true,
        // secure:
        maxAge: 60 * 1000,
      });

      res.cookie("refresh", refreshtoken, {
        httpOnly: true,
        // secure:
        maxAge: 60 * 60 * 1000 * 24 * 3,
      });

      await userModel.updateRefreshToken(refreshtoken, user.id);

      res.json({
        message: "Login succesfully",
        user: { userid: user.id, email: user.email },
        token: accesstoken,
        refresh: refreshtoken,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "internal server error" });
    }
  },

  getAllUsers: async (req, res) => {
    // console.log(req.userid, req.email);
    try {
      const users = await userModel.getAllUsers();
      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "internal server error" });
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await userModel.getUserById(req.userid);
      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "internal server error" });
    }
  },
};
