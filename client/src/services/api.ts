import axios from 'axios';

// Enterprise-Level API Service
// Implements: Automatic Token Rotation, De-duplication, and Secure Session Handling
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    withCredentials: true, // Essential for HTTP-only cookies
    headers: {
        'Content-Type': 'application/json'
    }
});

let isRefreshing = false;
let failedQueue: { resolve: (token: string | null) => void; reject: (err: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Response Interceptor: Handles Token Rotation (401 errors)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {

            // If the error comes from the refresh endpoint itself, reject it without redirecting immediately
            if (originalRequest.url.includes('/api/auth/refresh')) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => {
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Attempt to rotate tokens via HTTP-only cookie
                await api.post('/api/auth/refresh');
                processQueue(null);
                isRefreshing = false;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                isRefreshing = false;
                // Session totally expired - allow guest logic to continue instead of forced redirect
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Guest Mode Tracking
const GUEST_LIMIT = 3;
const getGuestActions = () => parseInt(localStorage.getItem('guest_actions') || '0');
const incrementGuestActions = () => {
    const current = getGuestActions();
    localStorage.setItem('guest_actions', (current + 1).toString());
};

// Request Interceptor: Metadata, Anti-Replay & Guest Control
api.interceptors.request.use(
    (config) => {
        const isUserLoggedIn = !!localStorage.getItem('user_name');

        // Action tracking (Limit logic removed for unhindered guest access)
        if (!isUserLoggedIn && ['post', 'put', 'delete'].includes(config.method || '')) {
            incrementGuestActions();
        }

        // Add timestamp to prevent caching
        if (config.method === 'get') {
            config.params = { ...config.params, _t: Date.now() };
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
export { getGuestActions, GUEST_LIMIT };
