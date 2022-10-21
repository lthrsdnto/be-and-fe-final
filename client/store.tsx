import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authSlice } from "./services/authApi";
import { productSlice } from "./services/productApi";
import { shopSlice } from "./services/shopApi";
import { userSlice } from "./services/userApi";
import authReducer from "./features/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [userSlice.reducerPath]: userSlice.reducer,
    [authSlice.reducerPath]: authSlice.reducer,
    [shopSlice.reducerPath]: shopSlice.reducer,
    [productSlice.reducerPath]: productSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userSlice.middleware,
      authSlice.middleware,
      shopSlice.middleware,
      productSlice.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type Store = ReturnType<typeof store.getState>;
export type ReduxStore = typeof store;

setupListeners(store.dispatch);
