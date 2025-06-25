import { createSlice } from '@reduxjs/toolkit';

const usersSlice = createSlice({
  name: 'users',
  initialState: { list: [], loading: false },
  reducers: {},
});

export default usersSlice.reducer; 