import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authSlice } from "./services/authApi";
import { shopSlice } from "./services/shopApi";
import { userSlice } from "./services/userApi";

export const store = configureStore({
  reducer: {
    [userSlice.reducerPath]: userSlice.reducer,
    [authSlice.reducerPath]: authSlice.reducer,
    [shopSlice.reducerPath]: shopSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userSlice.middleware,
      authSlice.middleware,
      shopSlice.middleware
    ),
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type Store = ReturnType<typeof store.getState>;
export type ReduxStore = typeof store;

setupListeners(store.dispatch);
