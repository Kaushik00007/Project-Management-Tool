import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

const TaskModal = ({ open, onClose, task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'To Do',
  });

  useEffect(() => {
    if (task) {
      setEditedTask({
        title: task.title || '',
        description: task.description || '',
        dueDate: task.dueDate || '',
        status: task.status || 'To Do',
      });
    }
  }, [task]);

  if (!task) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...task, ...editedTask });
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(task._id);
    onClose();
  };

  return (
    <Modal open={open} onClose={() => { setIsEditing(false); onClose(); }} aria-labelledby="task-modal-title">
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
          borderRadius: 2,
        }}
      >
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <Typography id="task-modal-title" variant="h6" gutterBottom>
              Edit Task
            </Typography>
            <TextField fullWidth label="Title" name="title" value={editedTask.title} onChange={handleChange} margin="normal" required />
            <TextField fullWidth label="Description" name="description" value={editedTask.description} onChange={handleChange} margin="normal" multiline rows={4} required />
            <TextField fullWidth label="Due Date" name="dueDate" type="date" value={editedTask.dueDate} onChange={handleChange} margin="normal" InputLabelProps={{ shrink: true }} required />
            <TextField fullWidth label="Status" name="status" value={editedTask.status} onChange={handleChange} margin="normal" select required>
              <MenuItem value="To Do">To Do</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
            </TextField>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
              <Button variant="outlined" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </Box>
          </form>
        ) : (
          <>
            <Typography id="task-modal-title" variant="h5" gutterBottom>
              {task.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {task.description}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Due Date: {new Date(task.dueDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Status: {task.status}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button variant="contained" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button variant="contained" color="error" onClick={handleDelete}>
                Delete
              </Button>
              <Button variant="outlined" onClick={() => { setIsEditing(false); onClose(); }}>
                Close
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default TaskModal;
