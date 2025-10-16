import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to update the auth token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      // Only redirect to login if we're not already on a public page
      // Check if we're not on login, register, or other public pages
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith('/login') && !currentPath.startsWith('/register') && !currentPath.startsWith('/onboarding')) {
        // Redirect to login page
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  firebaseLogin: (data) => api.post('/auth/firebase-login', data), // Add Firebase login
  verifyEmail: (params) => api.get('/auth/verify-email', { params }),
  verifyMobile: (data) => api.post('/auth/verify-mobile', data),
};

// User API endpoints
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
};

// Company API endpoints
export const companyAPI = {
  register: (data) => api.post('/companies/register', data),
  getProfile: () => api.get('/companies/profile'),
  updateProfile: (data) => api.put('/companies/profile', data),
  uploadLogo: (data) => api.post('/companies/upload-logo', data),
  uploadBanner: (data) => api.post('/companies/upload-banner', data),
};

// Job API endpoints
export const jobAPI = {
  createJob: (data) => api.post('/jobs', data),
  getJobs: () => api.get('/jobs'),
  getJob: (id) => api.get(`/jobs/${id}`),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  updateJobStatus: (id, status) => api.put(`/jobs/${id}/status`, { status }),
  applyToJob: (id) => api.post(`/jobs/${id}/apply`),
};

export default api;