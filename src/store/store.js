import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../services/apiSlice";
import { stateManageSlice } from "@/services/stateManageSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    stateManage: stateManageSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
