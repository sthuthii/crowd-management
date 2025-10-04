
// frontend/src/services/api.js
import axios from "axios";
import config from "../config";

const api = axios.create({
  baseURL: config.API_BASE_URL,
});

export default api;

import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api'
});

// --- Auth Functions ---
export const registerUser = (username, password) => {
    return apiClient.post('/register', { username, password });
};

export const loginUser = (username, password) => {
    // Login for a token uses a different data format (form data)
    return apiClient.post('/login',
        new URLSearchParams({ username, password }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
};

// --- Queue & Ticketing Functions ---
export const getQueues = () => {
    // We need to set the auth header for protected requests
    const token = localStorage.getItem('token');
    return apiClient.get('/queues', {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const bookPass = (passData) => {
    const token = localStorage.getItem('token');
    return apiClient.post('/passes', passData, {
        headers: { Authorization: `Bearer ${token}` }
    });
};