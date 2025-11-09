// src/components/PrivateRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/auth";

const hasRequiredRole = (requiredRole) => {
  // 1. If no specific role is required, access is granted.
  if (!requiredRole) return true;

  const userRole = getUserRole(); // Get the user's stored role (e.g., "STAFF")

  // 2. Convert the input into a clean array for checking.
  // If it's a string, wrap it in an array. If it's already an array, use it.
  const allowedRoles = Array.isArray(requiredRole)
    ? requiredRole
    : [requiredRole];

  // 3. Check if the user's role is present in the list of allowed roles.
  return allowedRoles.includes(userRole);
};

export default function PrivateRoute({ children, requiredRole }) {
  const isAuth = isAuthenticated();

  // 1. Check if authenticated
  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  // 2. Check if the user has the required role
  if (!hasRequiredRole(requiredRole)) {
    // Redirect unauthorized users (e.g., to dashboard or a 403 page)
    return <Navigate to="/dashboard" />;
  }

  // If authenticated and authorized, render the children
  return children;
}
