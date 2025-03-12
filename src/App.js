import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Profile from './pages/Profile';

const getTheme = (darkMode) =>
  createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
      background: {
        default: darkMode ? '#121212' : '#ffffff',
        paper: darkMode ? '#1E1E1E' : '#f5f5f5',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#000000',
        secondary: darkMode ? '#B0B0B0' : '#666666',
      },
    },
  });

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4 }}
  >
    {children}
  </motion.div>
);

const App = () => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem('darkMode')) || false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000); 
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    console.log("Current path:", location.pathname);
  }, [location]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Checking authentication...</p>
      </div>
    );
  }

  const isAuthPage = ["/login", "/signup"].includes(location.pathname);
  const isLoggedIn = Boolean(user);

  return (
    <ThemeProvider theme={getTheme(darkMode)}>
      <CssBaseline />
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {isLoggedIn && !isAuthPage && (
          <Sidebar darkMode={darkMode} sidebarOpen={sidebarOpen} />
        )}
        <div style={{ flex: 1, overflowY: 'auto', marginLeft: sidebarOpen ? '260px' : '0px', transition: 'margin 0.3s' }}>
          {isLoggedIn && !isAuthPage && (
            <Navbar 
              darkMode={darkMode} 
              setDarkMode={setDarkMode} 
              sidebarOpen={sidebarOpen} 
              toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
            />
          )}
          <main style={{ padding: isAuthPage ? '0' : '20px' }}>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<PageTransition><Home darkMode={darkMode} /></PageTransition>} />
                <Route path="/login" element={
                  <PageTransition>
                    {isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login darkMode={darkMode} setUser={setUser} />}
                  </PageTransition>
                } />
                <Route path="/signup" element={
                  <PageTransition>
                    {isLoggedIn ? <Navigate to="/dashboard" replace /> : <Signup darkMode={darkMode} setUser={setUser} />}
                  </PageTransition>
                } />
                <Route path="/dashboard" element={isLoggedIn ? <PageTransition><Dashboard /></PageTransition> : <Navigate to="/login" replace />} />
                <Route path="/projects" element={isLoggedIn ? <PageTransition><Projects /></PageTransition> : <Navigate to="/login" replace />} />
                <Route path="/tasks" element={isLoggedIn ? <PageTransition><Tasks /></PageTransition> : <Navigate to="/login" replace />} />
                <Route path="/profile" element={isLoggedIn ? <PageTransition><Profile /></PageTransition> : <Navigate to="/login" replace />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
