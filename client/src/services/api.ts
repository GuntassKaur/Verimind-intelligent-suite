import axios from 'axios';
import { getSessionId } from '../utils/session';

// Create a centralized Axios instance
const api = axios.create({
    baseURL: 'http://localhost:5000', // Root URL to handle /api prefix correctly in service calls
    withCredentials: true,
});

const pendingRequests = new Map();

// REQUEST INTERCEPTOR
api.interceptors.request.use(
    (config) => {
        const sessionId = getSessionId();
        if (sessionId) {
            config.headers['X-Session-ID'] = sessionId;
        }

        // De-duplication Logic
        const requestKey = `${config.method}:${config.url}:${JSON.stringify(config.data)}`;
        if (pendingRequests.has(requestKey)) {
            const controller = new AbortController();
            config.signal = controller.signal;
            controller.abort("Duplicate request detected");
        } else {
            pendingRequests.set(requestKey, true);
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR (to clear pending requests)
api.interceptors.response.use(
    (response) => {
        const config = response.config;
        const requestKey = `${config.method}:${config.url}:${JSON.stringify(config.data)}`;
        pendingRequests.delete(requestKey);
        return response;
    },
    (error) => {
        if (error.config) {
            const config = error.config;
            const requestKey = `${config.method}:${config.url}:${JSON.stringify(config.data)}`;
            pendingRequests.delete(requestKey);
        }
        return Promise.reject(error);
    }
);

export default api;
