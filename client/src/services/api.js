import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth on 401
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  register: (userData) => 
    api.post('/auth/register', userData),
  
  logout: () => 
    api.post('/auth/logout'),
  
  getCurrentUser: () => 
    api.get('/auth/me'),
  
  refreshToken: (refreshToken) => 
    api.post('/auth/refresh-token', { refreshToken }),
};

export const userAPI = {
  getUsers: (params) => 
    api.get('/users', { params }),
  
  getUserById: (id) => 
    api.get(`/users/${id}`),
  
  updateProfile: (data) => 
    api.put('/users/profile', data),
  
  changePassword: (currentPassword, newPassword) => 
    api.put('/users/change-password', { currentPassword, newPassword }),
  
  deleteUser: (id) => 
    api.delete(`/users/${id}`),
};

export const reportAPI = {
  getAllReports: (params) => 
    api.get('/reports', { params }),
  
  getReport: (id) => 
    api.get(`/reports/${id}`),
  
  getByDate: (date) => 
    api.get(`/reports?date=${date}`),
  
  create: (data) => 
    api.post('/reports', data),
  
  createReport: (data) => 
    api.post('/reports', data),
  
  updateReport: (id, data) => 
    api.put(`/reports/${id}`, data),
  
  deleteReport: (id) => 
    api.delete(`/reports/${id}`),
  
  deleteTask: (id) => 
    api.delete(`/reports/${id}`),
  
  submitReport: (id) => 
    api.put(`/reports/${id}/submit`),
  
  reviewReport: (id, data) => 
    api.put(`/reports/${id}/review`, data),
  
  getStats: (userId) => 
    api.get('/reports/stats', { params: { userId } }),
};

export const announcementAPI = {
  getAll: (params) => 
    api.get('/announcements', { params }),
  
  getAnnouncements: (params) => 
    api.get('/announcements', { params }),
  
  getAnnouncement: (id) => 
    api.get(`/announcements/${id}`),
  
  create: (data) => 
    api.post('/announcements', data),
  
  createAnnouncement: (data) => 
    api.post('/announcements', data),
  
  update: (id, data) => 
    api.put(`/announcements/${id}`, data),
  
  updateAnnouncement: (id, data) => 
    api.put(`/announcements/${id}`, data),
  
  delete: (id) => 
    api.delete(`/announcements/${id}`),
  
  deleteAnnouncement: (id) => 
    api.delete(`/announcements/${id}`),
  
  markAsRead: (id) => 
    api.put(`/announcements/${id}/read`),
};

export default api;
