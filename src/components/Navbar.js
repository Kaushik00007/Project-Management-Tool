import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
  Notifications,
  ChatBubble,
  Search as SearchIcon,
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import { motion } from "framer-motion";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": { backgroundColor: alpha(theme.palette.common.white, 0.25) },
  marginLeft: 16,
  width: "250px",
  display: "flex",
  alignItems: "center",
  padding: "2px 10px",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  display: "flex",
  alignItems: "center",
  pointerEvents: "none",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
}));

const Navbar = ({
  darkMode,
  setDarkMode,
  toggleSidebar,
  sidebarOpen,
  openNotifications = () => {},
  openMessages = () => {},
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
      setLoading(false);
    };

    handleStorageChange(); // Load user on mount
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const profilePic =
    user?.profilePicture ||
    "https://campussafetyconference.com/wp-content/uploads/2020/08/iStock-476085198.jpg";

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setAnchorEl(null);
    setTimeout(() => navigate("/login", { replace: true }), 500);
  };

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AppBar
        position="static"
        sx={{
          backgroundColor: darkMode ? "#1E1E1E" : "#F8F9FA",
          color: darkMode ? "#FFF" : "#333",
          boxShadow: "none",
          padding: "6px 16px",
        }}
      >
        <Toolbar>
          {/* Sidebar Toggle */}
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleSidebar}>
            {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>

          {/* Logo / Title */}
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", letterSpacing: "0.5px", color: darkMode ? "#FFF" : "#333" }}
          >
            Project
          </Typography>

          {/* Search Bar */}
          <Search sx={{ display: { xs: "none", sm: "flex" } }}>
            <SearchIconWrapper>
              <SearchIcon sx={{ color: darkMode ? "#DDD" : "#555" }} />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search..." inputProps={{ "aria-label": "search" }} />
          </Search>

          <Box sx={{ flexGrow: 1 }} />

          {/* Messages */}
          <IconButton sx={{ color: darkMode ? "#FFF" : "#555" }} onClick={openMessages} aria-label="Messages">
            <Badge badgeContent={0} color="error">
              <ChatBubble />
            </Badge>
          </IconButton>

          {/* Notifications */}
          <IconButton sx={{ color: darkMode ? "#FFF" : "#555" }} onClick={openNotifications} aria-label="Notifications">
            <Badge badgeContent={0} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* Dark Mode Toggle */}
          <IconButton onClick={() => setDarkMode(!darkMode)} sx={{ color: darkMode ? "#FFF" : "#555" }} aria-label="Toggle dark mode">
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {/* User Profile */}
          {loading ? (
            <CircularProgress size={24} sx={{ color: darkMode ? "#FFF" : "#555", ml: 2 }} />
          ) : user ? (
            <>
              <IconButton onClick={handleMenuOpen}>
                <Avatar sx={{ width: 32, height: 32 }} src={profilePic} />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              onClick={() => navigate("/login", { replace: true })}
              sx={{ color: darkMode ? "#FFF" : "#555", ml: 2 }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </motion.div>
  );
};

export default Navbar;
