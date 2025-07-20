import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi, User } from '../api/authApi';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
};

export const loadStoredAuthThunk = createAsyncThunk(
  'auth/loadStoredAuth',
  async (_, { dispatch }) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          dispatch(setCredentials({ user, token }));
          return { user, token };
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    }
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadStoredAuthThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadStoredAuthThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(loadStoredAuthThunk.rejected, (state) => {
        state.isLoading = false;
      })
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.result.user;
        state.token = action.payload.result.token;
        state.isAuthenticated = true;
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.result.token);
          localStorage.setItem('user', JSON.stringify(action.payload.result.user));
        }
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state) => {
        state.isLoading = false;
      })
      .addMatcher(authApi.endpoints.signup.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(authApi.endpoints.signup.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.result.user;
        state.token = action.payload.result.token;
        state.isAuthenticated = true;
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.result.token);
          localStorage.setItem('user', JSON.stringify(action.payload.result.user));
        }
      })
      .addMatcher(authApi.endpoints.signup.matchRejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { logout, setCredentials, setLoading } = authSlice.actions;

export default authSlice.reducer;