/**
 * API Configuration for Frontend Integration
 * 
 * Copy this file to your client/src directory and use it to configure API calls
 */

// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH_TOKEN: '/auth/refresh-token',
  },

  // Users
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    BY_ID: (id) => `/users/${id}`,
  },

  // Reports
  REPORTS: {
    BASE: '/reports',
    STATS: '/reports/stats',
    BY_ID: (id) => `/reports/${id}`,
    SUBMIT: (id) => `/reports/${id}/submit`,
    REVIEW: (id) => `/reports/${id}/review`,
  },

  // Announcements
  ANNOUNCEMENTS: {
    BASE: '/announcements',
    BY_ID: (id) => `/announcements/${id}`,
    MARK_READ: (id) => `/announcements/${id}/read`,
  },

  // Health Check
  HEALTH: '/health',
};

// Axios configuration helper
export const getAuthHeaders = (token) => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

// Request configuration
export const API_CONFIG = {
  timeout: 10000, // 10 seconds
  withCredentials: true, // Include cookies in requests
};

/**
 * Example usage in React:
 * 
 * import axios from 'axios';
 * import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders } from './apiConfig';
 * 
 * // Login
 * const login = async (email, password) => {
 *   const response = await axios.post(
 *     `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`,
 *     { email, password }
 *   );
 *   return response.data;
 * };
 * 
 * // Get reports (authenticated)
 * const getReports = async (token) => {
 *   const response = await axios.get(
 *     `${API_BASE_URL}${API_ENDPOINTS.REPORTS.BASE}`,
 *     getAuthHeaders(token)
 *   );
 *   return response.data;
 * };
 */
