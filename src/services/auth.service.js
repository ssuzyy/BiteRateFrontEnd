// src/services/auth.service.js
import api from './api';

// Create an axios interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Auto logout if 401 response returned from API
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const authService = {
  /**
   * Login with Google OAuth token
   * @param {string} token - Google OAuth token
   * @returns {Promise} - Promise with user data
   */
  async loginWithGoogle(token) {
    try {
      const response = await api.post('/auth/google-login', { token });
      if (response.data) {
        // Store user data in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  /**
   * Log out the current user
   */
  logout() {
    localStorage.removeItem('user');
  },
  
  /**
   * Get the current user from local storage
   * @returns {Object|null} - User object or null if not logged in
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },
  
  /**
   * Check if user is authenticated
   * @returns {boolean} - True if user is logged in
   */
  isAuthenticated() {
    const user = this.getCurrentUser();
    return !!user && !!user.token;
  },
  
  /**
   * Fetch updated user profile from the API
   * @returns {Promise} - Promise with user data
   */
  async getUserProfile() {
    try {
      const response = await api.get('/auth/me');
      // Update stored user data with any new information
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        const updatedUser = { 
          ...response.data, 
          token: currentUser.token 
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }
};

export default authService;