import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || 'http://localhost:3001';

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
  shapeType: 'line' | 'rectangle' | 'circle' | 'pencil' | 'eraser';
  color: string;
  width: number;
}

const initialState: DrawingState = {
  elements: [],
  points: [],
  drawing: false,
  shapeType: 'line',
  color: '#000000',
  width: 1,
};

export const fetchDrawing = createAsyncThunk(
  'drawing/fetchDrawing',
  async (boardID: string) => {
    const response = await fetch(`${API_BASE_URL}/drawing/${boardID}`);
    if (!response.ok) {
      throw new Error('Failed to fetch drawing: ' + response.statusText);
    }
    const data = await response.json();
    return data.elements || [];
  }
);

export const updateDrawing = createAsyncThunk(
  'drawing/updateDrawing',
  async ({ boardID, elements }: { boardID: string; elements: Element[] }) => {
    const response = await fetch(`${API_BASE_URL}/drawing/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ boardID, elements }),
    });
    if (!response.ok) throw new Error('Failed to update drawing');
    return await response.json();
  }
);

const drawingSlice = createSlice({
  name: 'drawing',
  initialState,
  reducers: {
    startDrawing(state) {
      state.drawing = true;
    },
    finishDrawing(state) {
      state.drawing = false;
      state.points = []; // Clear points after finishing
    },
    addPoint(state, action) {
      state.points.push(action.payload);
    },
    addElement(state, action) {
      state.elements.push(action.payload);
    },
    setShapeType(state, action) {
      state.shapeType = action.payload;
    },
    setColor(state, action) {
      state.color = action.payload;
    },
    setWidth(state, action) {
      state.width = action.payload;
    },
    setInitialDrawing(state, action) {
      state.elements = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrawing.fulfilled, (state, action) => {
        state.elements = action.payload;
      })
      .addCase(updateDrawing.fulfilled, (state, action) => {
        console.log('Drawing updated successfully:', action.payload);
      })
      .addCase(fetchDrawing.rejected, (state, action) => {
        console.error('Failed to fetch drawing:', action.error);
      })
      .addCase(updateDrawing.rejected, (state, action) => {
        console.error('Failed to update drawing:', action.error);
      });
  },
});

export const {
  startDrawing,
  finishDrawing,
  addPoint,
  addElement,
  setShapeType,
  setColor,
  setWidth,
  setInitialDrawing,
} = drawingSlice.actions;

export const selectDrawing = (state: RootState) => state.drawing;

export default drawingSlice.reducer;
