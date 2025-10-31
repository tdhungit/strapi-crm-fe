import { createSlice } from '@reduxjs/toolkit';
interface AppState {
  settings: {
    notificationService: 'firebase' | 'supabase' | null;
    telecomService: 'twilio' | null;
    telecomOptions: any;
    [key: string]: any;
  };
}

const initState: AppState = {
  settings: {
    notificationService: null,
    telecomService: null,
    telecomOptions: {},
  },
};

const appSlice = createSlice({
  name: 'app',
  initialState: initState,
  reducers: {
    setSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
  },
});

export const { setSettings } = appSlice.actions;
export default appSlice.reducer;
