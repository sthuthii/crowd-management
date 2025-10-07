// frontend/src/services/api.js
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000"; // Adjust if running elsewhere

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor — adds Authorization token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ==============================
// EMERGENCY SERVICES
// ==============================
export const createEmergency = (data) => api.post("api/emergency/", data);
export const getActiveEmergencies = () => api.get("api/emergency/");
export const updateEmergency = (id, data) => api.put(`/emergency/${id}`, data);

// ==============================
// LOST & FOUND
// ==============================
export const getLostAndFoundItems = () => api.get("/lost-and-found/");
export const createLostAndFoundItem = (data) => api.post("/lost-and-found/", data);
export const updateLostAndFoundItem = (id, data) => api.put(`/lost-and-found/${id}`, data);

// ==============================
// ALERTS
// ==============================
export const getActiveAlerts = () => api.get("api/alerts/");
export const createAlert = (data) => api.post("api/alerts/", data);

// ==============================
// PRIORITY / NAVIGATION
// ==============================
export const fetchPriorityRoutes = async () => {
  try {
    const res = await api.get("/priority/");
    return res.data;
  } catch (err) {
    console.error("Error fetching priority routes:", err);
    return [];
  }
};

// ==============================
// CROWD PREDICTION
// ==============================
export const getCrowdPrediction = () => api.get("/crowd_prediction");

// ==============================
// ACCESSIBILITY
// ==============================
export const getAccessibilityInfo = () => api.get("/accessibility/accessibility");

// ==============================
// TRAFFIC
// ==============================
export const getTrafficData = () => api.get("/traffic/");

// ==============================
// AUTHENTICATION
// ==============================
export const loginUser = (username, password) => {
  const body = `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
  return api.post("/token", body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};

export const createUser = (userData) => api.post("/users/", userData);

// ==============================
// EVACUATION (Corrected URL)
// ==============================
export const getNearbyExits = (lat, lon) =>
  api.get(`/api/evacuation/exits-near-me?lat=${lat}&lon=${lon}`); // <-- THIS LINE IS NOW FIXED

export default api;