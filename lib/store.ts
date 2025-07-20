import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { chatApi } from "./api/chatApi";
import { pdfApi } from "./api/pdfApi";
import authReducer from "./slices/authSlice";
import chatReducer from "./slices/chatSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    ui: uiReducer,
    [authApi.reducerPath]: authApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [pdfApi.reducerPath]: pdfApi.reducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
      // Add performance optimizations
      immutableCheck: {
        warnAfter: 128,
      },
      serializableCheck: {
        warnAfter: 128,
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    })
      .concat(authApi.middleware)
      .concat(chatApi.middleware)
      .concat(pdfApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
