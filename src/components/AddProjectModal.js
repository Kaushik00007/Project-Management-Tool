import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const AddProjectModal = ({ open, onClose, addProject }) => {
  const [projectName, setProjectName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addProject({ name: projectName });
    setProjectName('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <h2>Add Project</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Project Name"
            fullWidth
            margin="normal"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Add Project
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddProjectModal;