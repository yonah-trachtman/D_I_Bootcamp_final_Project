const express = require("express");
const userRouter = require("./routes/userRouter.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userControler = require("./controllers/userController.js");
const { verifyToken } = require("./middlewares/verifyToken.js");
const path = require("path");
const app = express();

app.use(cors());


// Serve static files from the 'Online Whiteboard/build' directory
app.use(express.static(path.join(__dirname, 'Online Whiteboard/build')));

// Serve the React app on all routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'Online Whiteboard/build', 'index.html'));
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server listening on ${process.env.PORT || 3001}`);
});

// router.get("/all", verifyToken, userControler.getAllUsers);
// router.post("/register", userControler.registerUser);
// router.post("/login", userControler.loginUser);
