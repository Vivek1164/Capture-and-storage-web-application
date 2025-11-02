import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import documentReducer from "../features/dashboard/documentSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    documents: documentReducer,
  },
});

export default store;
