import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import todoReducer from './todoSlice';
import networkReducer from './networkSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todoReducer,
    network: networkReducer,
  }
});

export default store;