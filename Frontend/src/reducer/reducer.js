import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default: localStorage
import { combineReducers } from "redux"; // Import combineReducers
import authSlice from "../slice/authSlice";
import branchSlice from "../slice/branchSlice";

// Configure persist settings
const persistConfig = {
  key: "root",
  storage,
};

// Combine slices into a single reducer function
const rootReducer = combineReducers({
  auth: authSlice,
  branch: branchSlice,
});

// Wrap the rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

// Persistor for the store
const persistor = persistStore(store);

export { store, persistor };
