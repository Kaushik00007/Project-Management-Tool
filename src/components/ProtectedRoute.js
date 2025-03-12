import React, { useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch (error) {
    console.error("Invalid or tampered token:", error);
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  const user = useMemo(() => {
    try {
      return token && isTokenValid(token) ? JSON.parse(localStorage.getItem("user")) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }, [token]);

  if (!user) {
    console.warn("Unauthorized access. Redirecting to login...");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
