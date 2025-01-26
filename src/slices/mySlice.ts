import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

const API_URL = 'https://taby.in/accounts/accounts/create';

interface Account {
  username: string;
  password: string;
}

interface DataState {
  accounts: Account[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DataState = {
  accounts: [],
  status: 'idle',
  error: null,
};

// Async thunk for creating a new account
export const createAccount = createAsyncThunk(
  'data/createAccount',
  async (newAccount: Account) => {
    const response = await axios.post<Account>(API_URL, newAccount);
    return response.data;
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAccount.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createAccount.fulfilled, (state, action: PayloadAction<Account>) => {
        state.status = 'succeeded';
        state.accounts.push(action.payload);
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to create account';
      });
  },
});

export default dataSlice.reducer;

// Selectors
const selectAccounts = (state: RootState) => state.data.accounts;
const selectStatus = (state: RootState) => state.data.status;
const selectError = (state: RootState) => state.data.error;

// Export actions, selectors, and thunks in a single block
export {
  //createAccount,
  selectAccounts,
  selectStatus,
  selectError,
};
