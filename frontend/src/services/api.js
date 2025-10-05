import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api'
});

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
    setAuthHeader();
    return apiClient.get('/queues');
};

export const bookPass = (passData) => {
    setAuthHeader();
    return apiClient.post('/passes', passData);
};

export const getMyPass = () => {
    setAuthHeader();
    return apiClient.get('/passes/me');
};

export default apiClient;
