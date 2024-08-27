import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Point {
  x: number;
  y: number;
}

interface Element {
  type: 'line' | 'rectangle' | 'circle' | 'pencil' | 'eraser';
  points: Point[];
  color: string;
  width: number;
}

interface DrawingState {
  elements: Element[];
  points: Point[];
  drawing: boolean;
  shapeType: string;
  color: string;
  width: number;
}

const initialState: DrawingState = {
  elements: [],
  points: [],
  drawing: false,
  shapeType: 'pencil',
  color: 'black',
  width: 1
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
    setColor(state, action: PayloadAction<string>) { 
      state.color = action.payload;
    },
    setWidth(state, action: PayloadAction<number>) { 
      state.width = action.payload;
    },
  },
});

export const { startDrawing, finishDrawing, addPoint, setShapeType, addElement, setColor, setWidth } = drawingSlice.actions;
export default drawingSlice.reducer;
