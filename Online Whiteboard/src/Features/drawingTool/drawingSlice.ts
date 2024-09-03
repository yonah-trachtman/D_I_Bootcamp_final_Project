import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

const API_BASE_URL  =  'http://localhost:3001';

interface Point {
  x: number;
  y: number;
}

export interface Element {
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
  selected: boolean
}

const initialState: DrawingState = {
  elements: [],
  points: [],
  drawing: false,
  shapeType: 'line',
  color: '#000000',
  width: 1,
  selected: false
};

export const fetchDrawing = createAsyncThunk(
  'drawing/fetchDrawing',
  async (boardID: string) => {
    const response = await fetch(`${API_BASE_URL}/drawing/${boardID}`);
    if (!response.ok) {
      throw new Error('Failed to fetch drawing: ' + response.statusText);
    }
    const data = await response.json();
    return Array.isArray(data[0].elements) ? data[0].elements : [];
  }
);

export const updateDrawing = createAsyncThunk(
  'drawing/updateDrawing',
  async ({ boardID, elements }: { boardID: string; elements: Element[] }) => {
    if (!Array.isArray(elements)) {
      throw new Error('Elements must be an array');
    }

    const response = await fetch(`${API_BASE_URL}/drawing/update`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ boardID, elements }),
    });

    // Log response status and text for debugging
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to update drawing:', response.status, errorText);
      throw new Error(`Failed to update drawing: ${response.statusText}`);
    }

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
      state.points = []; 
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
    clearDrawing(state) {
      state.elements = []
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
        state.elements = state.elements
        console.log('Drawing updated successfully:', action.payload);
      })
      .addCase(fetchDrawing.rejected, (state, action) => {
        state.elements = state.elements
        console.error('Failed to fetch drawing:', action.error);
      })
      .addCase(updateDrawing.rejected, (state, action) => {
        state.elements = state.elements
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
  clearDrawing,
} = drawingSlice.actions;

export const selectDrawing = (state: RootState) => state.drawing;

export default drawingSlice.reducer;
