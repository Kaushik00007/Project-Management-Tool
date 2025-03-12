import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const EditProjectModal = ({ open, onClose, project, updateProject }) => {
  const [projectName, setProjectName] = useState(project ? project.name : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (project) {
      updateProject({ ...project, name: projectName });
    }
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
        <h2>Edit Project</h2>
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
            Save Changes
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default EditProjectModal;