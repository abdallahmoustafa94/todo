import { createSlice } from '@reduxjs/toolkit';

const networkSlice = createSlice({
  name: 'network',
  initialState: {
    isOnline: navigator.onLine
  },
  reducers: {
    setOnline: (state) => {
      state.isOnline = true;
    },
    setOffline: (state) => {
      state.isOnline = false;
    }
  }
});

export const { setOnline, setOffline } = networkSlice.actions;
export default networkSlice.reducer;