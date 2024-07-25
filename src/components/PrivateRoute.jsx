// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PrivateRoute({ children }) {
  const auth = useSelector(state => state.auth);
  
  if (auth.user === undefined) {
    return <div>Loading...</div>;
  }
  
  return auth.user ? children : <Navigate to="/login" />;
}

export default PrivateRoute;