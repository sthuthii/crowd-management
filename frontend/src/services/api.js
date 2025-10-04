// In src/services/api.js
import axios from 'axios';
import config from '../config'; // Using the config file from the template

const apiClient = axios.create({
  // Add /api to the end of the URL
  baseURL: 'http://127.0.0.1:8000/api',
});

// This function automatically adds the login token to secure requests
const setAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete apiClient.defaults.headers.common['Authorization'];
    }
};

// --- Auth Functions ---
export const registerUser = (username, password) => {
    return apiClient.post('/register', { username, password });
};

export const loginUser = (username, password) => {
    return apiClient.post('/login',
        new URLSearchParams({ username, password }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
};
// --- Queue & Ticketing Functions ---
export const getQueues = () => {
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