import axios from 'axios';

const API = axios.create({ baseURL: 'https://ghost-churn-backend.onrender.com/api' });

export const predictChurn = (formData) => API.post('/predict', formData);