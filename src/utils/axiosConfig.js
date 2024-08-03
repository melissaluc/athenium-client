// src/axiosConfig.js
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});


axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});


export default axiosInstance;
