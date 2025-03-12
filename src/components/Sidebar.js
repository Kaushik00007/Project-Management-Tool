import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { List, ListItem, ListItemText, ListItemIcon, Typography } from "@mui/material";
import { Dashboard, Folder, Task } from "@mui/icons-material";
import { motion } from "framer-motion";

const Sidebar = ({ darkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { text: "Projects", icon: <Folder />, path: "/projects" },
    { text: "Tasks", icon: <Task />, path: "/tasks" },
  ];

  return (
    <motion.div
      initial={{ x: -250, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{
        width: "260px",
        backgroundColor: darkMode ? "#121212" : "#FAFAFA",
        height: "100vh",
        padding: "20px",
        boxShadow: darkMode ? "2px 0 6px rgba(255,255,255,0.1)" : "2px 0 6px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Sidebar Header */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          marginBottom: "20px",
          color: darkMode ? "#fff" : "#333",
          textAlign: "center",
          letterSpacing: "1px",
        }}
      >
        Project Manager
      </Typography>

      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              backgroundColor: location.pathname === item.path ? (darkMode ? "#333" : "#ddd") : "transparent",
              borderRadius: "8px",
              marginBottom: "10px",
              padding: "12px",
              transition: "background-color 0.3s, transform 0.2s",
              cursor: "pointer",
              "&:hover": { backgroundColor: darkMode ? "#222" : "#E0E0E0", transform: "scale(1.05)" },
            }}
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
            tabIndex={0}
            aria-label={item.text}
          >
            <ListItemIcon sx={{ color: darkMode ? "#DDD" : "#555" }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{ color: darkMode ? "#EEE" : "#222", fontWeight: "500" }}
            />
          </ListItem>
        ))}
      </List>
    </motion.div>
  );
};

export default Sidebar;
