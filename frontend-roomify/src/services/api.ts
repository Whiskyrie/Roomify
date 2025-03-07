// src/services/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add interceptor to handle 401 errors (expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/users/profile/me');
    return response.data;
  },
};

// Properties services
export const propertyService = {
  getAllProperties: async (filters?: any) => {
    const response = await api.get('/properties', { params: filters });
    return response.data;
  },
  getPropertyById: async (id: string) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },
  createProperty: async (propertyData: any) => {
    const response = await api.post('/properties', propertyData);
    return response.data;
  },
  updateProperty: async (id: string, propertyData: any) => {
    const response = await api.patch(`/properties/${id}`, propertyData);
    return response.data;
  },
  deleteProperty: async (id: string) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },
  getUserProperties: async () => {
    const response = await api.get('/properties/owner/me');
    return response.data;
  },
};

// Booking services
export const bookingService = {
  createBooking: async (bookingData: any) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },
  getUserBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },
  getBookingById: async (id: string) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
  confirmBooking: async (id: string) => {
    const response = await api.post(`/bookings/${id}/confirm`);
    return response.data;
  },
  cancelBooking: async (id: string) => {
    const response = await api.post(`/bookings/${id}/cancel`);
    return response.data;
  },
  completeBooking: async (id: string) => {
    const response = await api.post(`/bookings/${id}/complete`);
    return response.data;
  },
};

// Review services
export const reviewService = {
  getPropertyReviews: async (propertyId: string) => {
    const response = await api.get(`/reviews?propertyId=${propertyId}`);
    return response.data;
  },
  createReview: async (reviewData: any) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },
  getUserReviews: async () => {
    const response = await api.get('/reviews/user/me');
    return response.data;
  },
  getPropertyRating: async (propertyId: string) => {
    const response = await api.get(`/reviews/property/${propertyId}/rating`);
    return response.data;
  },
};

// User services
export const userService = {
  updateUserProfile: async (userData: any) => {
    const response = await api.patch(`/users/profile/me`, userData);
    return response.data;
  },
};

export default api;