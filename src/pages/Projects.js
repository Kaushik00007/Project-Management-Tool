import React, { useState, useEffect } from 'react';
import AddProjectModal from '../components/AddProjectModal';
import EditProjectModal from '../components/EditProjectModal';
import BtnPrimary from '../components/BtnPrimary';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [error, setError] = useState(null);

  // Load projects from local storage on mount
  useEffect(() => {
    try {
      const storedProjects = JSON.parse(localStorage.getItem('projects')) || [];
      setProjects(storedProjects);
    } catch (err) {
      setError('Failed to load projects');
    }
  }, []);

  // Save projects to local storage when updated
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('projects', JSON.stringify(projects));
    }
  }, [projects]);

  const addProject = (project) => {
    setProjects((prevProjects) => {
      const newProjects = [...prevProjects, { ...project, id: Date.now() }];
      localStorage.setItem('projects', JSON.stringify(newProjects));
      return newProjects;
    });
    setIsAddModalOpen(false);
  };

  const updateProject = (updatedProject) => {
    setProjects((prevProjects) =>
      prevProjects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
    setIsEditModalOpen(false);
    setSelectedProject(null);
  };

  const confirmDeleteProject = (projectId) => {
    setProjectToDelete(projectId);
    setDeleteConfirmOpen(true);
  };

  const deleteProjectHandler = () => {
    setProjects((prevProjects) => prevProjects.filter((p) => p.id !== projectToDelete));
    setDeleteConfirmOpen(false);
    setProjectToDelete(null);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        Projects
      </Typography>

      {/* Add Project Button */}
      <BtnPrimary onClick={() => setIsAddModalOpen(true)}>➕ Add Project</BtnPrimary>

      {/* Project List */}
      <Box sx={{ mt: 3 }}>
        {projects.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No projects yet. Click "Add Project" to start!
          </Typography>
        ) : (
          projects.map((project) => (
            <Card key={project.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{project.name}</Typography>
                <Typography variant="body2">{project.description}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setSelectedProject(project);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => confirmDeleteProject(project.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      {/* Add Project Modal */}
      <AddProjectModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} addProject={addProject} />

      {/* Edit Project Modal */}
      {selectedProject && (
        <EditProjectModal
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProject(null);
          }}
          project={selectedProject}
          updateProject={updateProject}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this project? This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={deleteProjectHandler} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      {error && (
        <Snackbar open autoHideDuration={4000} onClose={() => setError(null)}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default Projects;