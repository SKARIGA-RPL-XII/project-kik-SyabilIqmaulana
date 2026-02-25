import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // Cek apakah token ada (user sudah login)
  const token = localStorage.getItem('token');

  
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;