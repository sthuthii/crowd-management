import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Emergency APIs
export const getEmergencyAlerts = async () => {
  const response = await api.get('/api/emergency/alerts');
  return response.data;
};

export const createEmergencyAlert = async (alertData) => {
  const response = await api.post('/api/emergency/alerts', alertData);
  return response.data;
};

// Crowd Prediction APIs
export const getCurrentCrowdData = async () => {
  const response = await api.get('/api/crowd/current');
  return response.data;
};

export const getCrowdPrediction = async () => {
  const response = await api.get('/api/crowd/prediction');
  return response.data;
};

export const getZoneDensity = async () => {
  const response = await api.get('/api/crowd/zones');
  return response.data;
};

// Queue Management APIs
export const getQueueStatus = async () => {
  const response = await api.get('/api/queue/status');
  return response.data;
};

export const bookQueueSlot = async (slotData) => {
  const response = await api.post('/api/queue/book', slotData);
  return response.data;
};

// Traffic/Parking APIs
export const getParkingStatus = async () => {
  const response = await api.get('/api/traffic/parking');
  return response.data;
};

export const getShuttleStatus = async () => {
  const response = await api.get('/api/traffic/shuttles');
  return response.data;
};

// Accessibility APIs
export const requestAccessibility = async (requestData) => {
  const response = await api.post('/api/accessibility/request', requestData);
  return response.data;
};

export const getAccessibilityServices = async () => {
  const response = await api.get('/api/accessibility/services');
  return response.data;
};

// Navigation APIs
export const getDirections = async (from, to) => {
  const response = await api.get(`/api/navigation/directions?from=${from}&to=${to}`);
  return response.data;
};

export default api;