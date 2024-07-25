import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (userId) => {
    const q = query(collection(db, 'todos'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
);

export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async (todo) => {
    const docRef = await addDoc(collection(db, 'todos'), todo);
    return { id: docRef.id, ...todo };
  }
);

export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async ({ id, updates }) => {
    await updateDoc(doc(db, 'todos', id), updates);
    return { id, ...updates };
  }
);

export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (id) => {
    await deleteDoc(doc(db, 'todos', id));
    return id;
  }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    list: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.list.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...action.payload };
        }
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.list = state.list.filter(todo => todo.id !== action.payload);
      });
  },
});

export default todoSlice.reducer;