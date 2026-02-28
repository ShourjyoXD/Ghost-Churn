import axios from 'axios';

// Base API instance pointing to your backend
const API = axios.create({ baseURL: 'https://ghost-churn-backend.onrender.com' });

// Attach token automatically if present in localStorage
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// --- AUTHENTICATION ---
export const registerUser = (formData) =>
  API.post('/api/auth/register', formData);

export const loginUser = async (formData) => {
  const res = await API.post('/api/auth/login', formData);
  if (res.data.token) {
    localStorage.setItem('token', res.data.token); // Save token for future requests
  }
  return res;
};

// --- PREDICTIONS ---
// Single prediction
export const predictChurn = (formData) =>
  API.post('/api/predict', formData);

// Bulk prediction
export const predictChurnBulk = (customers) =>
  API.post('/api/predict/bulk', customers);

// --- HISTORY ---
// Fetch prediction history
export const getHistory = () =>
  API.get('/api/history');

// Clear prediction history
export const clearHistory = () =>
  API.delete('/api/history/clear');