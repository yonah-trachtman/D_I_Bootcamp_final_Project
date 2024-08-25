import { configureStore } from '@reduxjs/toolkit';
import drawingReducer from '../Features/drawingTool/drawingSlice';
import userReducer from '../components/userSlice';
import { useDispatch } from 'react-redux';

// Configure the Redux store with the reducers
export const store = configureStore({
  reducer: {
    drawing: drawingReducer,
    user: userReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
