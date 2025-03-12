import React, { useState, useEffect, useCallback } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from '../services/taskService';
import AddTaskModal from '../components/AddTaskModal';
import TaskModal from '../components/TaskModal';
import BtnPrimary from '../components/BtnPrimary';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  useTheme,
} from '@mui/material';

const Tasks = () => {
  const theme = useTheme();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [error, setError] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const fetchedTasks = await fetchTasks();
        setTasks(Array.isArray(fetchedTasks) ? fetchedTasks : []);
      } catch (err) {
        setError('Failed to load tasks. Please try again.');
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  const addTask = async (task) => {
    try {
      const newTask = await createTask(task);
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setIsAddModalOpen(false);
    } catch (err) {
      setError('Failed to add task. Please try again.');
    }
  };

  const updateTaskHandler = async (updatedTask) => {
    try {
      const updated = await updateTask(updatedTask._id, updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === updated._id ? updated : task))
      );
      closeTaskModal();
    } catch (err) {
      setError('Failed to update task. Please try again.');
    }
  };

  const confirmDeleteTask = (taskId) => {
    setTaskToDelete(taskId);
    setDeleteConfirmOpen(true);
  };

  const deleteTaskHandler = async () => {
    try {
      await deleteTask(taskToDelete);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskToDelete));
      closeTaskModal();
      setDeleteConfirmOpen(false);
    } catch (err) {
      setError('Failed to delete task. Please try again.');
    }
  };

  const closeTaskModal = useCallback(() => {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  }, []);

  return (
    <Box
      sx={{
        padding: 3,
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        Tasks
      </Typography>

      <BtnPrimary onClick={() => setIsAddModalOpen(true)}>Add Task</BtnPrimary>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : tasks.length > 0 ? (
        <Box sx={{ mt: 3 }}>
          {tasks.map((task) => (
            <Card
              key={task._id}
              sx={{
                mb: 2,
                cursor: 'pointer',
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              }}
              onClick={() => {
                setSelectedTask(task);
                setIsTaskModalOpen(true);
              }}
            >
              <CardContent>
                <Typography variant="h6">{task.title}</Typography>
                <Typography variant="body2">{task.description}</Typography>
                <Typography variant="caption">
                  Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                  Status: {task.status}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography>No tasks available.</Typography>
      )}

      <AddTaskModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} addTask={addTask} />

      {selectedTask && (
        <TaskModal
          open={isTaskModalOpen}
          onClose={closeTaskModal}
          task={selectedTask}
          onUpdate={updateTaskHandler}
          onDelete={() => confirmDeleteTask(selectedTask._id)}
        />
      )}

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={deleteTaskHandler} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {error && (
        <Snackbar
          open
          autoHideDuration={4000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default Tasks;