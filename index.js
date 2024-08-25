const express = require("express");
const userRouter = require("./routes/userRouter.js");  // Correct import
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const app = express();

// Configure CORS with credentials
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost:3001"],
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Use the user router
app.use("/user", userRouter);  // This mounts the userRouter on the /user path

// Serve static files from the 'Online Whiteboard/build' directory
app.use(express.static(path.join(__dirname, 'Online Whiteboard/build')));

// Serve the React app on all routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'Online Whiteboard/build', 'index.html'));
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server listening on ${process.env.PORT || 3001}`);
});
