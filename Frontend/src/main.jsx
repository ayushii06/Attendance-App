import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import {Provider} from "react-redux"
// import rootReducer from './reducer';
import { Toaster } from 'react-hot-toast';
// Import your other reducers here if you have them
import authReducer from "./slice/authSlice"; 
import branchReducer from "./slice/branchSlice"; 
import courseReducer from "./slice/courseSlice";
import faceReducer from './slice/faceSlice'
// 1. Import the API slice we will create next
import { apiSlice } from "./services/apiSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    branch: branchReducer,
    course: courseReducer,
    face: faceReducer,
    // 2. Add the generated reducer
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  // 3. Add the API middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true, // Optional: for debugging
});

// const store = configureStore({
//   reducer:rootReducer,
// })

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <Provider store ={store} >
    <BrowserRouter>
    <App />
    <Toaster/>
    </BrowserRouter>
    </Provider>
  
);

