import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  tokenLoading: true,
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.token = null;
    },
    setTokenLoading: (state, action) => {
      state.tokenLoading = action.payload;
    },
  },
});

export const { setToken, logout, setTokenLoading } = tokenSlice.actions;
export default tokenSlice.reducer;
