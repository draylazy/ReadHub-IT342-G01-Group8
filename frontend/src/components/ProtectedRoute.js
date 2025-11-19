import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // adjust the path based on your structure


export default function ProtectedRoute({ children }) {
const { token } = useAuth();


if (!token) {
return <Navigate to="/login" replace />;
}


return children;
}