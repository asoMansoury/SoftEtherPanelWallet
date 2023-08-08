import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import RootReducer from "./reducers/RootReducer";

// import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storage,
}
const initialState = {};
const persistedReducer = persistReducer(persistConfig, RootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  RootReducer: persistedReducer,
  initialState,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
})

export default persistStore(store);