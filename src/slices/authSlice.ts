import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

const LOGIN_API_URL = 'https://your-api-endpoint.com/login'; // Replace with your login API endpoint

interface AuthState {
    token: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AuthState = {
    token: null,
    status: 'idle',
    error: null,
};

// Async thunk for login
export const login = createAsyncThunk(
    'auth/login',
    async (credentials: { username: string; password: string }) => {
        const response = await axios.post(LOGIN_API_URL, credentials);
        return response.data.token; // Assume the API response includes a "token" field
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null;
        },
        refreshToken: (state, action: PayloadAction<string | null>) => {
            state.token = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<string>) => {
                state.status = 'succeeded';
                state.token = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Login failed';
            });
    },
});

export const { logout, refreshToken } = authSlice.actions;

export const selectToken = (state: RootState) => state.auth.token;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
