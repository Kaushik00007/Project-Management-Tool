import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Card, CardContent, Typography, Chip, Tooltip, IconButton, Box } from "@mui/material";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "todo":
      return "default";
    case "in-progress":
      return "warning";
    case "done":
      return "success";
    default:
      return "info";
  }
};

const TaskCard = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task._id });

  return (
    <motion.div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        sx={{
          marginBottom: "16px",
          padding: "12px",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.12)",
          backgroundColor: "#fff",
          position: "relative",
        }}
      >
        <CardContent sx={{ paddingBottom: "16px !important" }}>
          {/* Drag Handle & More Options */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Tooltip title="Drag to reorder">
              <IconButton {...attributes} {...listeners} size="small" sx={{ cursor: "grab", color: "#757575" }}>
                <DragHandleIcon />
              </IconButton>
            </Tooltip>
            <IconButton size="small">
              <MoreVertIcon />
            </IconButton>
          </Box>

          {/* Task Title */}
          <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: "6px", color: "#333" }}>
            {task.title}
          </Typography>

          {/* Task Description */}
          {task.description && (
            <Typography variant="body2" sx={{ color: "#555", marginBottom: "12px" }}>
              {task.description}
            </Typography>
          )}

          {/* Due Date & Status */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
            <Typography variant="caption" sx={{ color: "#777" }}>
              Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No deadline"}
            </Typography>
            <Chip label={task.status} color={getStatusColor(task.status)} variant="outlined" size="small" />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TaskCard;
