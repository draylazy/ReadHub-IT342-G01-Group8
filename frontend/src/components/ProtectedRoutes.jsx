// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  // If not logged in → yeet to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If specific role required but user doesn't match → boop them out
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Otherwise, let them in like VIP
  return children;
}
