import { configureStore } from '@reduxjs/toolkit';
import drawingReducer from '../Features/drawingTool/drawingSlice';


export const store = configureStore({
  reducer: {
    drawing: drawingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;