import axios from 'axios';

// The full base URL, including /api
const API_BASE_URL = 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to automatically add the auth token to requests
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// --- Service Functions (using relative paths) ---

export const createEmergency = (emergencyData) => apiClient.post('/emergency/', emergencyData);
export const getActiveEmergencies = () => apiClient.get('/emergency/');
export const updateEmergency = (id, updateData) => apiClient.put(`/emergency/${id}`, updateData);

export const getLostAndFoundItems = () => apiClient.get('/lost-and-found/');
export const createLostAndFoundItem = (itemData) => apiClient.post('/lost-and-found/', itemData);
export const updateLostAndFoundItem = (id, updateData) => apiClient.put(`/lost-and-found/${id}`, updateData);

export const getActiveAlerts = () => apiClient.get('/alerts/');
export const createAlert = (alertData) => apiClient.post('/alerts/', alertData);

export const loginUser = (username, password) => {
    const body = `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    // Corrected path is now relative to the baseURL
    return apiClient.post('/token', body, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
};

// You will also need a createUser function for a registration page later
export const createUser = (userData) => apiClient.post('/users/', userData);

// evacuation

export const getNearbyExits = (lat, lon) => apiClient.get(`/evacuation/exits-near-me?lat=${lat}&lon=${lon}`);