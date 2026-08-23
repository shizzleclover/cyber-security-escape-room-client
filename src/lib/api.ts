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
 * Includes credentials for cookie-based auth.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for consistent error handling and global session expiration
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If unauthorized and not an initial /auth/me probe or login attempt
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const url = error.config?.url || '';
      if (!url.includes('/auth/me') && !url.includes('/auth/login') && !url.includes('/auth/register')) {
        window.dispatchEvent(new CustomEvent('cyberescape:auth_expired'));
      }
    }
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default api;
