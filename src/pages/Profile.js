import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("No token found. Redirecting to login...");
        setTimeout(() => navigate("/login", { replace: true }), 100);
        return;
      }

      try {
        const response = await api.get("/auth/profile");
        console.log("Profile Data:", response.data);
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
      } catch (err) {
        console.error("Profile Fetch Error:", err);
        const errorMsg = err.response?.data?.message || err.message || "Failed to load profile.";

        if (err.response?.status === 401) {
          console.warn("Unauthorized! Redirecting to login...");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setTimeout(() => navigate("/login", { replace: true }), 100);
          return;
        }

        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading)
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography color="error">{error}</Typography>
      </Box>
    );

  return (
    <Card sx={{ maxWidth: 400, margin: "auto", mt: 5, p: 3 }}>
      <CardContent>
        <Typography variant="h5">Profile</Typography>
        <Typography variant="body1">
          <strong>Name:</strong> {user?.name || "N/A"}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {user?.email || "N/A"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Profile;
