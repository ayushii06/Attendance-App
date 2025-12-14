import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import {Provider} from "react-redux"
import { Toaster } from 'react-hot-toast';
import authReducer from "./slice/authSlice"; 
import branchReducer from "./slice/branchSlice"; 
import courseReducer from "./slice/courseSlice";
import faceReducer from './slice/faceSlice'
import attendanceReducer from './slice/attendanceSlice'
import { apiSlice } from "./services/apiSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    branch: branchReducer,
    course: courseReducer,
    face: faceReducer,
    attendance:attendanceReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <Provider store ={store} >
    <BrowserRouter>
    <App />
    <Toaster/>
    </BrowserRouter>
    </Provider>
  
);

