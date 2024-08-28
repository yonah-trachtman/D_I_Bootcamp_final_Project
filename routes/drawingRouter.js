const express = require("express");
const drawingController = require("../controllers/drawingController");

const router = express.Router();

// Route to save a new drawing
router.post("/save", drawingController.saveDrawing);

// Route to get a drawing by boardID
router.get("/:boardID", drawingController.getDrawingByBoardId);

// Route to update an existing drawing
router.put("/update", drawingController.updateDrawing);

module.exports = router;
