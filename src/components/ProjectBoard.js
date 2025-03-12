import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard';
import { motion } from 'framer-motion';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useTheme,
  Box,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import { Star, MoreVert, AccessTime, People } from '@mui/icons-material';

const Column = ({ id, title, tasks, setTasks }) => {
  const theme = useTheme();
  return (
    <Box sx={{ flex: 1, padding: '15px', minWidth: '300px' }}>
      <Typography
        variant="h6"
        sx={{
          textAlign: 'left',
          fontWeight: 'bold',
          color: theme.palette.text.primary,
          marginBottom: '10px',
        }}
      >
        {title}
      </Typography>
      <SortableContext items={tasks.map((task) => task.id)}>
        {tasks.map((task, index) => (
          <DraggableTask key={task.id} task={task} index={index} setTasks={setTasks} />
        ))}
      </SortableContext>
    </Box>
  );
};

const DraggableTask = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  return (
    <motion.div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        marginBottom: '12px',
      }}
    >
      <Card sx={{ borderRadius: '10px', boxShadow: 2, backgroundColor: '#fff' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight="bold">
              <Star fontSize="small" sx={{ color: '#fbc02d', marginRight: '5px' }} />
              {task.title}
            </Typography>
            <MoreVert fontSize="small" />
          </Box>

          <Typography variant="body2" color="text.secondary">
            {task.description}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '8px', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AccessTime fontSize="small" />
              <Typography variant="caption">{task.dueDate}</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <People fontSize="small" />
              <Avatar sx={{ width: 24, height: 24 }} />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ProjectBoard = ({ tasks, setTasks }) => {
  const theme = useTheme();
  const [columns, setColumns] = useState([
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
  ]);
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    setTasks((prevTasks) => {
      const oldIndex = prevTasks.findIndex((task) => task.id === active.id);
      const newIndex = prevTasks.findIndex((task) => task.id === over.id);
      return arrayMove(prevTasks, oldIndex, newIndex);
    });
  };

  const addColumn = () => {
    if (!newColumnName.trim()) return;
    setColumns([...columns, { id: newColumnName.toLowerCase().replace(/\s+/g, '-'), title: newColumnName }]);
    setNewColumnName('');
    setIsAddColumnModalOpen(false);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsAddColumnModalOpen(true)}
        sx={{ marginBottom: '15px' }}
      >
        Add Column
      </Button>

      {/* Column Modal */}
      <Dialog open={isAddColumnModalOpen} onClose={() => setIsAddColumnModalOpen(false)}>
        <DialogTitle>Add New Column</DialogTitle>
        <DialogContent>
          <TextField label="Column Name" fullWidth value={newColumnName} onChange={(e) => setNewColumnName(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddColumnModalOpen(false)}>Cancel</Button>
          <Button onClick={addColumn}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Drag & Drop Context */}
      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {columns.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={tasks.filter((task) => task.status === column.id)}
              setTasks={setTasks}
            />
          ))}
        </Box>
      </DndContext>
    </Box>
  );
};

export default ProjectBoard;
