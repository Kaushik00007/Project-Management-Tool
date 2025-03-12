import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const DropdownMenu = ({ 
  options = [], 
  onSelect, 
  label = "Options",
  darkMode = false
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (option) => {
    if (onSelect) {
      onSelect(option);
    }
    handleClose();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (anchorEl && !anchorEl.contains(event.target)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [anchorEl]);

  return (
    <div>
      <Button
        onClick={handleClick}
        aria-controls={anchorEl ? "dropdown-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={Boolean(anchorEl)}
        sx={{
          backgroundColor: darkMode ? "#333" : "#f5f5f5",
          color: darkMode ? "#fff" : "#333",
          "&:hover": {
            backgroundColor: darkMode ? "#555" : "#e0e0e0"
          }
        }}
      >
        {label}
      </Button>
      <Menu
        id="dropdown-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          sx: {
            backgroundColor: darkMode ? "#222" : "#fff",
            color: darkMode ? "#fff" : "#000"
          }
        }}
      >
        {options.length > 0 ? (
          options.map((option, index) => (
            <MenuItem 
              key={index} 
              onClick={() => handleSelect(option)} 
              sx={{ "&:hover": { backgroundColor: darkMode ? "#444" : "#f0f0f0" } }}
            >
              {option}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No options available</MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default DropdownMenu;
