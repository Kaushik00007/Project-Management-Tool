import React from 'react';
import Button from '@mui/material/Button';

const BtnSecondary = ({ children, onClick }) => {
  return (
    <Button variant="outlined" color="primary" onClick={onClick}>
      {children}
    </Button>
  );
};

export default BtnSecondary;