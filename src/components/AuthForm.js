import React, { useState, useMemo } from 'react';
import { TextField, Button, Typography, Box, Paper, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '16px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: 400,
}));

const StyledForm = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
  borderRadius: '8px',
  padding: '12px',
  transition: '0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const AuthForm = ({ isLogin, handleSubmit, name, setName, email, setEmail, password, setPassword, error, loading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const validateForm = () => {
    setNameError('');
    setEmailError('');
    setPasswordError('');

    let isValid = true;

    if (!isLogin && name.trim().length < 2) {
      setNameError('Name must be at least 2 characters long.');
      isValid = false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Enter a valid email address.');
      isValid = false;
    }

    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setPasswordError('Password must be at least 8 characters and include a number.');
      isValid = false;
    }

    return isValid;
  };

  const isFormValid = useMemo(() => {
    return (
      (isLogin || name.trim().length >= 2) &&
      /\S+@\S+\.\S+/.test(email) &&
      password.length >= 8 &&
      /[A-Za-z]/.test(password) &&
      /[0-9]/.test(password)
    );
  }, [name, email, password, isLogin]);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    handleSubmit(e);
  };

  return (
    <StyledPaper elevation={3}>
      <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
        {isLogin ? 'Welcome Back! 👋' : 'Create an Account'}
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
        {isLogin ? 'Sign in to continue' : 'Sign up to get started'}
      </Typography>
      <StyledForm onSubmit={handleFormSubmit}>
        {!isLogin && (
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!nameError}
            helperText={nameError}
          />
        )}

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value.toLowerCase())}
          error={!!emailError}
          helperText={emailError}
        />

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!passwordError}
          helperText={passwordError}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <StyledButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={loading || !isFormValid}
        >
          {loading ? <CircularProgress size={24} /> : isLogin ? 'Sign In' : 'Sign Up'}
        </StyledButton>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="text" color="primary" onClick={() => navigate(isLogin ? '/signup' : '/login')}>
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </Button>
        </Box>
      </StyledForm>
    </StyledPaper>
  );
};

export default AuthForm;
