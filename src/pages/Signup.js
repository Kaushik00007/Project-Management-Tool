import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { signup, checkAuth } from "../services/authService";
import { Container, CircularProgress, Box, Typography } from "@mui/material";
import AuthForm from "../components/AuthForm";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const navigate = useNavigate();

  const verifyAuth = useCallback(async () => {
    try {
      console.log("Checking if user is already authenticated...");
      const isAuthenticated = await checkAuth();

      console.log("Auth Check Result:", isAuthenticated);

      if (isAuthenticated) {
        console.log("User is authenticated. Redirecting to dashboard...");
        navigate("/dashboard", { replace: true });
      } else {
        console.log("User is NOT authenticated. Showing signup form...");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsCheckingAuth(false); // Ensure it stops loading
    }
  }, [navigate]);

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await signup(name.trim(), email.trim().toLowerCase(), password);

      console.log("Signup Response:", response);

      if (response?.token && response?.user) {
        console.log("Signup successful! Storing token and redirecting...");

        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));

        navigate("/dashboard", { replace: true });
      } else {
        throw new Error(response?.error || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup Error:", err);
      setError(err.message || "An error occurred. Please try again.");
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
          isLogin={false}
          handleSubmit={handleSubmit}
          name={name}
          setName={setName}
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

export default Signup;
