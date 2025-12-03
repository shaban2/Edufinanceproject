import { createSlice } from '@reduxjs/toolkit';

const tokenKey = 'edufin_token';
const userKey = 'edufin_user';

const initialState = {
  token: localStorage.getItem(tokenKey),
  user: localStorage.getItem(userKey) ? JSON.parse(localStorage.getItem(userKey)) : null
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      localStorage.setItem(tokenKey, token);
      localStorage.setItem(userKey, JSON.stringify(user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(userKey);
    }
  }
});

export const { setCredentials, logout } = slice.actions;
export default slice.reducer;

export const selectToken = (s) => s.auth.token;
export const selectUser = (s) => s.auth.user;
