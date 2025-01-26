import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dataReducer from './slices/mySlice';

export const store = configureStore({
  reducer: {
    data: dataReducer,
    auth: authReducer,
  },
});

// Persist token
store.subscribe(() => {
  const state = store.getState();
  if (state.auth.token) {
    localStorage.setItem('token', state.auth.token);
  } else {
    localStorage.removeItem('token');
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
