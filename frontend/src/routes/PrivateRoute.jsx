import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// You can customize this function to check token validity (expiration, etc.)
const isAuthenticated = () => {
  const token = localStorage.getItem('token'); // or wherever you store it
  return Boolean(token);
};

const PrivateRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
