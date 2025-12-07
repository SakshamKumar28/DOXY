import axios from 'axios';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`, // Uses env variable for flexibility
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor for requests (Inject Token)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor for responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Optional: Clear token on 401? 
            // localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

export default api;
