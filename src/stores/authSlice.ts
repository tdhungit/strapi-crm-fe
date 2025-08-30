import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: any | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserStore: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    clearUserStore: (state) => {
      state.user = null;
    },
  },
});

export const { setUserStore, clearUserStore } = authSlice.actions;
export default authSlice.reducer;
