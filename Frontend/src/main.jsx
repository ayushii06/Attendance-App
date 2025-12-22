import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { configureStore, combineReducers } from '@reduxjs/toolkit'; // Added combineReducers
import { Provider } from "react-redux";
import { Toaster } from 'react-hot-toast';

// Slices
import authReducer from "./slice/authSlice"; 
import branchReducer from "./slice/branchSlice"; 
import courseReducer from "./slice/courseSlice";
import faceReducer from './slice/faceSlice';
import attendanceReducer from './slice/attendanceSlice';
import { apiSlice } from "./services/apiSlice";

// Persist imports
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import { PersistGate } from 'redux-persist/integration/react';

// 1. Combine all the reducers into one root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  branch: branchReducer,
  course: courseReducer,
  face: faceReducer,
  attendance: attendanceReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

// 2. Setup persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth',], // Only persist the auth slice 
};

// 3. Wrap the root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer, // Pass the persisted reducer directly here
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Prevents errors with non-serializable persist actions
    }).concat(apiSlice.middleware),
  devTools: true,
});

const persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);