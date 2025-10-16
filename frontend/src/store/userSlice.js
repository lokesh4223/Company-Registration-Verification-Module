import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI, setAuthToken } from '../services/api';

// Check for existing token in localStorage
const token = localStorage.getItem('token');

// Initial state
const initialState = {
  user: null,
  token: token,
  isAuthenticated: !!token, // Set to true if token exists
  isEmailVerified: false,
  isMobileVerified: false, // Set to false initially
  loading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'user/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const register = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'user/verifyEmail',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyEmail(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isEmailVerified = false;
      state.isMobileVerified = false;
      localStorage.removeItem('token');
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload);
      // Also update the axios default headers
      setAuthToken(action.payload);
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isEmailVerified = action.payload.is_email_verified || false;
      state.isMobileVerified = action.payload.is_mobile_verified || false;
    },
    // New reducer to restore auth state from localStorage
    restoreAuthState: (state) => {
      const token = localStorage.getItem('token');
      if (token) {
        state.token = token;
        state.isAuthenticated = true;
        // Also update the axios default headers
        setAuthToken(token);
      }
    }
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
        state.isEmailVerified = action.payload.data.user.is_email_verified || false;
        state.isMobileVerified = action.payload.data.user.is_mobile_verified || false;
        localStorage.setItem('token', action.payload.data.token);
        // Also update the axios default headers
        setAuthToken(action.payload.data.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        // Note: After registration, we don't set user/token yet as OTP verification is required
        // The user will be set after OTP verification
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Registration failed';
      })
      // Verify Email
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isEmailVerified = action.payload.is_email_verified;
        if (state.user) {
          state.user.is_email_verified = action.payload.is_email_verified;
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.error = action.payload?.message || 'Email verification failed';
      });
  },
});

export const { logout, setToken, setUser, restoreAuthState } = userSlice.actions;
export default userSlice.reducer;