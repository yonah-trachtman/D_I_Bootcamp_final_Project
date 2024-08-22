import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Point {
  x: number;
  y: number;
}

interface Element {
  type: 'line' | 'rectangle' | 'circle' | 'pencil';
  points: Point[];
}

interface DrawingState {
  elements: Element[];
  points: Point[];
  drawing: boolean;
  shapeType: string;
}

const initialState: DrawingState = {
  elements: [],
  points: [],
  drawing: false,
  shapeType: 'pencil',
};

const drawingSlice = createSlice({
  name: 'drawing',
  initialState,
  reducers: {
    startDrawing: (state) => {
      state.drawing = true;
    },
    finishDrawing: (state) => {
      state.drawing = false;
      state.points = [];
    },
    addPoint: (state, action: PayloadAction<Point>) => {
      state.points.push(action.payload);
    },
    setShapeType: (state, action: PayloadAction<string>) => {
      state.shapeType = action.payload;
    },
    addElement: (state, action: PayloadAction<Element>) => {
      state.elements.push(action.payload);
    },
  },
});

export const { startDrawing, finishDrawing, addPoint, setShapeType, addElement } = drawingSlice.actions;
export default drawingSlice.reducer;
