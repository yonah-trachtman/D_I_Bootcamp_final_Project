const drawingModel = require("../models/drawingModel");

module.exports = {
  // Save a new drawing for a user
  saveDrawing: async (req, res) => {
    const { boardID, elements } = req.body;

    try {
      const drawing = await drawingModel.saveDrawing({ boardID, elements });
      res.status(201).json({
        message: "Drawing saved successfully",
        drawing,
      });
    } catch (error) {
      console.error('Failed to save drawing:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Retrieve a drawing by boardID
  getDrawingByBoardId: async (req, res) => {
    const  board_Id  = req.params.boardID;
    try {
      let drawing = await drawingModel.getDrawingByBoardId(board_Id);

      res.status(200).json(drawing);
    } catch (error) {
      console.error('Error fetching or creating drawing:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Update an existing drawing
  updateDrawing: async (req, res) => {
    const { boardID, elements } = req.body;
    // const boardID = boardid
    const elementsJson = JSON.stringify(elements);

  
    try {
      if (!boardID || !elements) {
        return res.status(400).json({ message: "Invalid input" });
      }
  
      const updatedDrawing = await drawingModel.updateDrawing({
        boardID,
        elements: elementsJson,
      });
  
      if (!updatedDrawing) {
        return res.status(404).json({ message: "Drawing not found" });
      }
  
      res.status(200).json({
        message: "Drawing updated successfully",
        drawing: updatedDrawing,
      });
    } catch (error) {
      console.error('Error updating drawing:', error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },
};
