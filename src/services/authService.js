import api from './api';
import { jwtDecode } from 'jwt-decode';

/**
 * Register a new user.
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token?: string, user?: object, message?: string, error?: string}>}
 */
export const signup = async (name, email, password) => {
  try {
    const response = await api.post('/auth/signup', { name, email, password });

    if (response.data?.token) {
      const user = { name, email }; 
      storeUserSession(response.data.token, user);
      return { token: response.data.token, user, message: 'Signup successful!' };
    }

    console.error("Signup failed: No token received.");
    return { error: 'Signup failed. Please try again.' };
  } catch (error) {
    return handleAuthError(error);
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });

    if (response.data?.token) {
      const user = await fetchUserProfile(response.data.token);
      storeUserSession(response.data.token, user);
      return { token: response.data.token, user, message: 'Login successful!' };
    }

    console.error("Login failed: No token received.");
    return { error: 'Login failed. Please try again.' };
  } catch (error) {
    return handleAuthError(error);
  }
};

export const logout = () => {
  console.log("Logging out...");
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.replace('/login'); 
};

export const fetchUserProfile = async (token = null) => {
  const authToken = token || localStorage.getItem('token');

  if (!authToken) {
    console.warn("fetchUserProfile() - No token found.");
    return null;
  }

  if (isTokenExpired(authToken)) {
    console.warn("fetchUserProfile() - Token expired. Logging out...");
    logout();
    return null;
  }

  try {
    const response = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    return response.data || null;
  } catch (error) {
    console.error("fetchUserProfile() - Error fetching user data:", error);

    if (error.response?.status === 401) {
      console.warn("fetchUserProfile() - Unauthorized. Clearing session.");
      logout();
    }

    return null;
  }
};

/**
 * 🔹 FIXED checkAuth() FUNCTION TO PREVENT LOOPING ISSUE
 */
export const checkAuth = async () => {
  try {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token) {
      console.warn("checkAuth() - No token found. User is not authenticated.");
      return false; // 🔹 Return `false` instead of `null`
    }

    if (isTokenExpired(token)) {
      console.warn("checkAuth() - Token expired. Logging out...");
      logout();
      return false;
    }

    return storedUser ? true : !!(await fetchUserProfile()); // 🔹 Ensure a boolean is returned
  } catch (error) {
    console.error("checkAuth() - Error during auth check:", error);
    return false; // 🔹 Explicitly return `false` on error
  }
};

const storeUserSession = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));

  const event = new Event("authChange");
  window.dispatchEvent(event);
};

const isTokenExpired = (token) => {
  try {
    if (!token) return true; 
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    console.error("isTokenExpired() - Invalid token:", error);
    return true;
  }
};

const handleAuthError = (error) => {
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 400:
        return { error: data.error || 'Invalid request. Please check your input.' };
      case 401:
        logout();
        return { error: 'Unauthorized. Please log in again.' };
      case 403:
        return { error: 'Forbidden. You do not have permission to access this resource.' }; 
      case 404:
        return { error: 'Resource not found.' };
      case 409:
        return { error: 'Email already in use. Try another one.' };
      case 500:
        return { error: 'Server error. Please try again later.' };
      default:
        return { error: data.error || 'An unknown error occurred. Please try again.' };
    }
  }

  return { error: 'Network error. Please check your connection and try again.' };
};
