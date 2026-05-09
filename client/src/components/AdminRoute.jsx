import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const userData = useSelector((state) => state.user.user);

  if (!userData) {
    return <Navigate to="/login" />;
  }

  if (userData.role !== "admin") {
    return <Navigate to="/home" />;
  }

  return children;
}

export default AdminRoute;
