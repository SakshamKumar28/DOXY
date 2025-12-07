import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Direct backend URL to avoid proxy issues
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor for responses (e.g. 401 handling)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized (optional: clear local state if needed)
            // window.location.href = '/login'; // Or use context to logout
        }
        return Promise.reject(error);
    }
);

export default api;
