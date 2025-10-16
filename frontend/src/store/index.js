import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

// Create store with configureStore
const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;