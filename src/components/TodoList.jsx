import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTodos, addTodo, updateTodo, deleteTodo } from '../store/todoSlice';
import { motion, AnimatePresence } from 'framer-motion';

function TodoList() {
  const [newTodo, setNewTodo] = useState({ title: '', description: '', dueDate: '', status: 'pending' });
  const [editingTodo, setEditingTodo] = useState(null);
  const dispatch = useDispatch();
  const todos = useSelector(state => state.todos.list);
  const status = useSelector(state => state.todos.status);
  const error = useSelector(state => state.todos.error);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    if (user) {
      dispatch(fetchTodos(user.uid));
    }
  }, [dispatch, user]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodo.title.trim() === '') return;
    dispatch(addTodo({
      ...newTodo,
      userId: user.uid,
      createdAt: new Date().toISOString()
    }));
    setNewTodo({ title: '', description: '', dueDate: '', status: 'pending' });
  };

  const handleUpdateTodo = (id, updates) => {
    dispatch(updateTodo({ id, updates }));
    setEditingTodo(null);
  };

  const handleDeleteTodo = (id) => {
    dispatch(deleteTodo(id));
  };

  const startEditing = (todo) => {
    setEditingTodo({ ...todo });
  };

  const handleEditChange = (e) => {
    setEditingTodo({ ...editingTodo, [e.target.name]: e.target.value });
  };

  if (status === 'loading') {
    return <div className="text-center mt-8 dark:text-white">Loading...</div>;
  }

  if (status === 'failed') {
    return <div className="text-center mt-8 text-red-500 dark:text-red-400">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">To-Do List</h1>
      <form onSubmit={handleAddTodo} className="mb-4">
        <input
          type="text"
          placeholder="Title"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          className="border p-2 mr-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <input
          type="text"
          placeholder="Description"
          value={newTodo.description}
          onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
          className="border p-2 mr-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <input
          type="date"
          value={newTodo.dueDate}
          onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
          className="border p-2 mr-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <select
          value={newTodo.status}
          onChange={(e) => setNewTodo({ ...newTodo, status: e.target.value })}
          className="border p-2 mr-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <motion.button 
          type="submit" 
          className="bg-blue-500 text-white p-2 rounded dark:bg-blue-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Todo
        </motion.button>
      </form>
      
      <AnimatePresence>
        {todos.map((todo) => (
          <motion.div
            key={todo.id}
            layout
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            {editingTodo && editingTodo.id === todo.id ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdateTodo(todo.id, editingTodo);
              }}>
                <input
                  type="text"
                  name="title"
                  value={editingTodo.title}
                  onChange={handleEditChange}
                  className="border p-1 mr-2 mb-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <input
                  type="text"
                  name="description"
                  value={editingTodo.description}
                  onChange={handleEditChange}
                  className="border p-1 mr-2 mb-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <input
                  type="date"
                  name="dueDate"
                  value={editingTodo.dueDate}
                  onChange={handleEditChange}
                  className="border p-1 mr-2 mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <select
                  name="status"
                  value={editingTodo.status}
                  onChange={handleEditChange}
                  className="border p-1 mr-2 mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
                <motion.button 
                  type="submit" 
                  className="bg-green-500 text-white p-1 rounded mr-2 dark:bg-green-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Save
                </motion.button>
                <motion.button 
                  onClick={() => setEditingTodo(null)} 
                  className="bg-gray-500 text-white p-1 rounded dark:bg-gray-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-bold dark:text-white">{todo.title}</h3>
                <p className="dark:text-gray-300">{todo.description}</p>
                <p className="dark:text-gray-300">Due: {todo.dueDate}</p>
                <p className="dark:text-gray-300">Status: {todo.status}</p>
                <select
                  value={todo.status}
                  onChange={(e) => handleUpdateTodo(todo.id, { status: e.target.value })}
                  className="border p-1 mr-2 mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => startEditing(todo)}
                  className="bg-yellow-500 text-white p-1 rounded mr-2 mt-2 dark:bg-yellow-600"
                >
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="bg-red-500 text-white p-1 rounded mt-2 dark:bg-red-600"
                >
                  Delete
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default TodoList;