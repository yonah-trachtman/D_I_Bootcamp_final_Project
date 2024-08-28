const drawingModel = require("../models/drawingModel");

module.exports = {
  // Save a new drawing for a user
  saveDrawing: async (req, res) => {
    const { boardID, elements } = req.body;

    try {
      const drawing = await drawingModel.saveDrawing({ boardid: boardID, elements });
      res.status(201).json({
        message: "Drawing saved successfully",
        drawing,
      });
    } catch (error) {
      console.error('Failed to save drawing:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Retrieve a drawing by boardId
  getDrawingByBoardId: async (req, res) => {
    const { boardID } = req.params;

    try {
      let drawing = await drawingModel.getDrawingByBoardId(boardID);

      if (!drawing) {
        // If no drawing is found, create a new one
        drawing = await drawingModel.saveDrawing({
          boardid: boardID, // Use the boardID from the request
          elements: [],
        });
      }

      res.status(200).json(drawing);
    } catch (error) {
      console.error('Error fetching or creating drawing:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Update an existing drawing
  updateDrawing: async (req, res) => {
    const { boardID, elements } = req.body;

    try {
      const updatedDrawing = await drawingModel.updateDrawing({
        boardid: boardID,
        elements,
      });
      res.status(200).json({
        message: "Drawing updated successfully",
        drawing: updatedDrawing,
      });
    } catch (error) {
      console.error('Error updating drawing:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
