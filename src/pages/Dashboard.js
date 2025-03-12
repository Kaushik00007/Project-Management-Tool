import React, { useState, useEffect } from "react";
import ProjectCard from "../components/ProjectCard";
import AddTaskModal from "../components/AddTaskModal";
import BtnPrimary from "../components/BtnPrimary";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Box, Typography, Grid, useTheme, TextField } from "@mui/material";

const Dashboard = () => {
  const theme = useTheme();

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.status === "Done";
    if (filter === "pending") return task.status !== "Done";
    return true;
  });

  const searchedTasks = filteredTasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  const addTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: Date.now() }]);
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <Box
      sx={{
        p: 3,
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Projects
        </Typography>
        <BtnPrimary onClick={() => setIsAddTaskModalOpen(true)}>
          + New Project
        </BtnPrimary>
      </Box>

      {/* Search & Filter Options */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Search projects..."
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ backgroundColor: theme.palette.background.paper }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Filter</InputLabel>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Filter"
            sx={{
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Add Task Modal */}
      <AddTaskModal
        open={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        addTask={addTask}
      />

      {/* Project Board */}
      <Grid container spacing={3}>
        {searchedTasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task.id}>
            <ProjectCard task={task} deleteTask={deleteTask} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
