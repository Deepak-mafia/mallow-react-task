import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { modalOpen: false },
  reducers: {},
});

export default uiSlice.reducer; 