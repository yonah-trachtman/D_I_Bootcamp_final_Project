const express = require("express");
const userRouter = require("./routes/userRouter.js");
const drawingRouter = require("./routes/drawingRouter.js"); // Import the drawing routes
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const app = express();

// Global CORS configuration applied before routes
app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5174",
        "http://localhost:3001",
        "https://d-i-bootcamp-final-project.onrender.com"
      ];

      

      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


// Apply user routes after middleware
app.use("/user", userRouter);

// Apply drawing routes after middleware
app.use("/drawing", drawingRouter);  // Add the drawing routes

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
