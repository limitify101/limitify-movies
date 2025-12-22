import axios from 'axios';
import { API_CONFIG } from './config/api';

const instance = axios.create({
    baseURL: API_CONFIG.TMDB_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add response interceptor for error handling
instance.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default instance;