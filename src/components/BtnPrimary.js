import React from 'react';
import Button from '@mui/material/Button';

const BtnPrimary = ({ children, onClick }) => {
  return (
    <Button variant="contained" color="primary" onClick={onClick}>
      {children}
    </Button>
  );
};

export default BtnPrimary;