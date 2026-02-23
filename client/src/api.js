import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// This interceptor automatically attaches the JWT token
// to every request so we don't have to do it manually each time
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;