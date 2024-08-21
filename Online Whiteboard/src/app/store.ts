import { configureStore } from '@reduxjs/toolkit';
import drawingReducer from "../Features/drawingTool/drawingSlice"

const store = configureStore({
  reducer: {
    drawing: drawingReducer,
  },
});

export default store;