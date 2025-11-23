// D:\projects\foodie\foodie\src\utilities\ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isProtected, isLoggedIn, children }) => {
  if (isProtected && !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
