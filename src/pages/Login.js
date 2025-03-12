import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login, checkAuth } from "../services/authService";
import { Container, CircularProgress, Box, Typography } from "@mui/material";
import AuthForm from "../components/AuthForm";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        console.log("Checking if user is already authenticated...");
        const isAuthenticated = await checkAuth();
        
        console.log("Auth Check Result:", isAuthenticated);
        
        if (isAuthenticated) {
          console.log("User is authenticated. Redirecting to dashboard...");
          navigate("/dashboard", { replace: true });
        } else {
          console.log("User is NOT authenticated. Showing login form...");
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
      } finally {
        setIsCheckingAuth(false); // Ensures the loading state updates
      }
    };

    verifyAuth();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Attempting to login with email:", email.trim().toLowerCase());

      const response = await login(email.trim().toLowerCase(), password);

      console.log("Login Response:", response);

      if (response?.token && response?.user) {
        console.log("Login successful! Storing user data and redirecting...");
        
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));

        const redirectTo = location.state?.from?.pathname || "/dashboard";
        navigate(redirectTo, { replace: true });
      } else {
        console.warn("Login failed:", response?.error || "Invalid email or password.");
        setError(response?.error || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      {isCheckingAuth ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
        >
          <CircularProgress />
          <Typography variant="body2" sx={{ marginTop: 2, color: "#666" }}>
            Checking authentication...
          </Typography>
        </Box>
      ) : (
        <AuthForm
          isLogin={true}
          handleSubmit={handleSubmit}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          error={error}
          loading={loading}
        />
      )}
    </Container>
  );
};

export default Login;
