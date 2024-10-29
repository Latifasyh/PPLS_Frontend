import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from './AppContext';

const ProtectedRoute = ({ element }) => {
  const { user } = useContext(AppContext);

  // If there is no user, redirect to login page
  return user ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
