import React from 'react';
import { Navigate } from 'react-router-dom';

const NotFoundPage = () => {
  // Redirect to the desired path when the 404 page is rendered
  return <Navigate to="/dashboard" />;
};

export default NotFoundPage;