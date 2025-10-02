import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- Emergency Service ---
export const createEmergency = (emergencyData) => apiClient.post('/emergency/', emergencyData);
export const getActiveEmergencies = () => apiClient.get('/emergency/');
export const updateEmergency = (id, updateData) => apiClient.put(`/emergency/${id}`, updateData);

// --- Lost and Found Service ---
export const getLostAndFoundItems = () => apiClient.get('/lost-and-found/');
export const createLostAndFoundItem = (itemData) => apiClient.post('/lost-and-found/', itemData);