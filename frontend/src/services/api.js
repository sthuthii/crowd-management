// frontend/src/services/api.js
import axios from "axios";
import config from "../config";

const api = axios.create({
  baseURL: config.API_BASE_URL,
});

export default api;
