const express = require("express");
const router = express.Router();
const userControler = require("../controllers/userController.js");
const { verifyToken } = require("../middlewares/verifyToken.js");


router.post("/register", userControler.registerUser);
router.post("/login", userControler.loginUser);



router.get("/user", verifyToken, (req, res) => {


  res.sendStatus(201);
});

module.exports = router;
