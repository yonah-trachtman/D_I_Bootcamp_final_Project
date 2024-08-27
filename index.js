const express = require("express");
const userRouter = require("./routes/userRouter.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const app = express();

// CORS Middleware applied before routes


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost:3001"],
  })
);

app.get('/test', (req, res) => {
  res.json({ message: 'CORS working!' });
});
// Apply user routes after middleware
app.use("/user", userRouter);

// Serve static files from the 'Online Whiteboard/build' directory
app.use(express.static(path.join(__dirname, 'Online Whiteboard/build')));

// Serve the React app on all routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'Online Whiteboard/build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
