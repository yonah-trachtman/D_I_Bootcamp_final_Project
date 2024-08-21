import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Method = 'line' | 'rectangle' | 'circle';

interface Element {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  roughEle: any;
  type: Method;
}

interface DrawingState {
  elements: Element[];
  drawing: boolean;
  shapeType: Method;
}

const initialState: DrawingState = {
  elements: [],
  drawing: false,
  shapeType: 'line', 
};

const drawingSlice = createSlice({
  name: 'drawing',
  initialState,
  reducers: {
    startDrawing: (state, action: PayloadAction<Element>) => {
      state.drawing = true;
      state.elements.push(action.payload);
    },
    finishDrawing: (state) => {
      state.drawing = false;
    },
    updateElement: (state, action: PayloadAction<{ index: number; element: Element }>) => {
      state.elements[action.payload.index] = action.payload.element;
    },
    setShapeType: (state, action: PayloadAction<Method>) => {
      state.shapeType = action.payload;
    },
  },
});

export const { startDrawing, finishDrawing, updateElement, setShapeType } = drawingSlice.actions;
export default drawingSlice.reducer;
