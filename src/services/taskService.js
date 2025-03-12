import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Handles API errors and returns a structured error message
 * @param {Error} error
 * @returns {Object} Formatted error response
 */
const handleError = (error) => {
  console.error(error);
  return {
    success: false,
    message: error.response?.data?.message || 'An error occurred. Please try again.',
  };
};

/**
 * Create a new task
 * @param {Object} taskData
 * @returns {Promise<Object>} Task response
 */
export const createTask = async (taskData) => {
  try {
    const response = await axiosInstance.post('/', taskData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Fetch all tasks for the logged-in user
 * @returns {Promise<Array>} List of tasks
 */
export const fetchTasks = async () => {
  try {
    const response = await axiosInstance.get('/', {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Update an existing task
 * @param {string} taskId
 * @param {Object} updatedData
 * @returns {Promise<Object>} Updated task
 */
export const updateTask = async (taskId, updatedData) => {
  try {
    const response = await axiosInstance.put(`/${taskId}`, updatedData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Delete a task
 * @param {string} taskId
 * @returns {Promise<Object>} Delete confirmation
 */
export const deleteTask = async (taskId) => {
  try {
    const response = await axiosInstance.delete(`/${taskId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
