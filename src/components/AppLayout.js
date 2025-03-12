import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const AppLayout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      {isSidebarOpen && <Sidebar />} 

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        {/* Navbar */}
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} toggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <main style={{ padding: '20px' }}>{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
