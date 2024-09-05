import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ board_user, password }: { board_user: string; password: string }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/user/login`,
        { board_user, password },
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async ({ board_user, password }: { board_user: string; password: string }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/user/register`,
        { board_user, password },
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

interface UserState {
  message: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  registrationSuccess: boolean;
}

const initialState: UserState = {
  message: '',
  status: 'idle',
  registrationSuccess: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.message = '';
    },
    clearRegistrationSuccess: (state) => {
      state.registrationSuccess = false; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload.message;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.message = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.registrationSuccess = true; 
        state.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.message = action.payload as string;
      });
  },
});

export const { clearMessage, clearRegistrationSuccess } = userSlice.actions;

export default userSlice.reducer;
