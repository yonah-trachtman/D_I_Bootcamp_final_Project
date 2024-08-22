const express = require("express");
const router = express.Router();
const userControler = require("../controllers/userController.js");
const { verifyToken } = require("../middlewares/verifyToken.js");

// register route = register a new user
router.post("/register", userControler.registerUser);
router.post("/login", userControler.loginUser);

router.get("/all", verifyToken, userControler.getAllUsers);
router.get("/byid", verifyToken, userControler.getUserById);

router.get("/auth", verifyToken, (req, res) => {

  // 
  res.sendStatus(201);
});

module.exports = router;
