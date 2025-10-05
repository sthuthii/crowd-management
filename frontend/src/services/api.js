// frontend/src/services/api.js
import axios from "axios";
import config from "../config"; // make sure this has API_BASE_URL

const api = axios.create({
  baseURL: config.API_BASE_URL, // e.g., "http://localhost:8000"
});

export const fetchPriorityRoutes = async () => {
  try {
    const res = await api.get("/priority/");
    return res.data;
  } catch (err) {
    console.error("Error fetching priority routes:", err);
    return [];
  }
};

export default api;
