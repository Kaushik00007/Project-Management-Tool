import React from "react";
import { Card, CardContent, Typography, Chip, Box, IconButton } from "@mui/material";
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

const ProjectCard = ({ task, deleteTask }) => {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" fontWeight={600}>
            {task.title}
          </Typography>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
          {task.description || "No description provided."}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="caption" color="text.secondary">
            Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No deadline"}
          </Typography>
          <Chip label={task.status} color={getStatusColor(task.status)} variant="outlined" size="small" />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
