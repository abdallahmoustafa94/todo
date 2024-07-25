import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './store';
import { setOnline, setOffline } from './store/networkSlice';
import TodoList from './components/TodoList';
import Profile from './components/Profile';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';  
import Register from './components/Register';


function AppContent() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }));
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    const handleOnline = () => dispatch(setOnline());
    const handleOffline = () => dispatch(setOffline());

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);

  return (
    <Router>
        <div className="App min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
          {user && (
  <nav className="bg-primary-light dark:bg-primary-dark p-4">
  <ul className="flex justify-center space-x-4">
    <li>
      <NavLink to="/" className={({ isActive }) => 
        isActive ? "text-white font-bold" : "text-white hover:underline"
      }>
        To-Do List
      </NavLink>
    </li>
    <li>
      <NavLink to="/profile" className={({ isActive }) => 
        isActive ? "text-white font-bold" : "text-white hover:underline"
      }>
        Profile
      </NavLink>
    </li>
  </ul>
</nav>
          )}
        

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={
              <PrivateRoute>
                <TodoList />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </Router>
  );
}

function App() {
  return (
      <AppContent />
  );
}

export default App;