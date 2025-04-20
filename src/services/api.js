// src/services/api.js
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add an interceptor to include the token in all requests
api.interceptors.request.use(
  async (config) => {
    // Try to get the current Firebase user
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      // Get fresh token
      const token = await user.getIdToken(true);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Fallback to stored token
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData && userData.token) {
        config.headers.Authorization = `Bearer ${userData.token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
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
  
  logout() {
    localStorage.removeItem('user');
    // You would also sign out from Firebase here
    const auth = getAuth();
    return auth.signOut();
  },
  
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },
  
  // Helper method to create test users (admin only)
  async createTestUser(email, password, displayName) {
    try {
      const response = await api.post('/auth/create-test-user', {
        email,
        password,
        displayName
      });
      return response.data;
    } catch (error) {
      console.error('Error creating test user:', error);
      throw error;
    }
  }
};

export default api;