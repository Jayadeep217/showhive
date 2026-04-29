import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const userData = useSelector((state) => state.user.user);

  if (userData) {
    return <Navigate to="/home" />;
  }

  return children;
}

export default PublicRoute;
