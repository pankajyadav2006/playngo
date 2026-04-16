import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { getToken } from '../utils/storage';

const getApiUrl = () => {
    const API_URL = 'https://playnxt.onrender.com/api';
    console.log('Using Hosted API URL:', API_URL);
    return API_URL;
};

const API_URL = getApiUrl();

console.log('🌐 Final API URL:', API_URL);

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

api.interceptors.request.use(
    async (config) => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('API Request:', config.method.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout - Backend might not be running');
        } else if (error.code === 'ERR_NETWORK') {
            console.error('Network error - Cannot reach backend at', API_URL);
        } else if (error.response?.status === 401) {
            console.log('Unauthorized request');
        } else {
            console.error('API Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    getCurrentUser: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
};

export const venueAPI = {
    getAll: () => api.get('/venues'),
    getById: (id) => api.get(`/venues/${id}`),
    createVenue: (data) => api.post('/venues', data),
    updateVenue: (id, data) => api.put(`/venues/${id}`, data),
    deleteVenue: (id) => api.delete(`/venues/${id}`),
    getMyVenues: () => api.get('/venues/my-venues/list'),
    getVenueBookings: (id) => api.get(`/venues/${id}/bookings`),
};

export const bookingAPI = {
    createBooking: (data) => api.post('/bookings', data),
    getMyBookings: () => api.get('/bookings/my-bookings'),
    cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
};

export default api;
