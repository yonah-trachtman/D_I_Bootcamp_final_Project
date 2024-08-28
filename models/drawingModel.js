const { db } = require("../config/db.js");

module.exports = {
  // Save a new drawing
  saveDrawing: async (drawingInfo) => {
    const { boardid, elements } = drawingInfo;

    try {
      const newDrawing = await db("drawing")
        .insert({ boardid, elements })
        .returning(["id", "boardid", "elements", "updated_at"]);

      return newDrawing[0]; // Return the newly created drawing
    } catch (error) {
      console.error("Error saving drawing:", error);
      throw error;
    }
  },

  // Retrieve a drawing by boardId
  getDrawingByBoardId: async (boardID) => {
    try {
      const drawing = await db('drawing')
        .select('id', 'boardid', 'elements', 'updated_at')
        .where('boardid', boardID)
        .first();
      return drawing;
    } catch (error) {
      console.error('Error fetching drawing:', error);
      throw error;
    }
  },

  // Update an existing drawing
  updateDrawing: async (drawingInfo) => {
    const { boardid, elements } = drawingInfo;

    try {
      const [updatedDrawing] = await db("drawing")
        .where({ boardid })
        .update({ elements, updated_at: new Date() })
        .returning(["id", "boardid", "elements", "updated_at"]);

      return updatedDrawing;
    } catch (error) {
      console.error("Error updating drawing:", error);
      throw error;
    }
  },
};
