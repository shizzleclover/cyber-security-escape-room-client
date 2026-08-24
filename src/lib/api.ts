import axios from 'axios';

// Primary source is the NEXT_PUBLIC_API_URL env var (set per-environment).
// The fallback points at the deployed Railway backend so a production build never
// accidentally targets localhost when the env var is missing. Local dev sets
// NEXT_PUBLIC_API_URL in .env.local to override this.
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://cyberescape-api-production.up.railway.app/api';

/**
 * Configured Axios instance for all API requests.
 * Includes credentials for cookie-based auth and Bearer token header fallback
 * to support cross-origin production requests where third-party cookies are blocked.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT Bearer token if stored in localStorage
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      try {
        const token = localStorage.getItem('cyberescape:token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {}
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent data extraction and session handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    // Handle token invalidation on authenticated requests (ignore login/register and /auth/me probes)
    if (status === 401 && typeof window !== 'undefined') {
      const isAuthEndpoint =
        url.includes('/auth/login') ||
        url.includes('/auth/register') ||
        url.includes('/auth/me');

      if (!isAuthEndpoint) {
        try {
          localStorage.removeItem('cyberescape:token');
        } catch {}
        window.dispatchEvent(new CustomEvent('cyberescape:auth_expired'));
      }
    }

    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default api;
