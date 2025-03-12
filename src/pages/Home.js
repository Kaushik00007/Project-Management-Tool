import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const Home = ({ darkMode }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); 

  useEffect(() => {
    if (token) {
      navigate('/dashboard'); 
    }
  }, [token, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          textAlign: 'center',
          padding: '40px',
          color: darkMode ? '#ffffff' : '#000000',
          backgroundColor: darkMode ? '#1E1E1E' : '#F8F9FA',
          borderRadius: '12px',
          boxShadow: darkMode
            ? '0px 4px 10px rgba(255, 255, 255, 0.1)'
            : '0px 4px 10px rgba(0, 0, 0, 0.1)',
          maxWidth: '600px',
          margin: '50px auto',
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome to the Project Management Tool
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Manage your projects efficiently and collaborate seamlessly.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={token ? '/dashboard' : '/login'}
          sx={{ textTransform: 'none', fontSize: '16px', padding: '10px 20px' }}
        >
          {token ? 'Go to Dashboard' : 'Get Started'}
        </Button>
      </Box>
    </motion.div>
  );
};

export default Home;
