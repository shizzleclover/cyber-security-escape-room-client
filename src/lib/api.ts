import axios from 'axios';

// Primary source is the NEXT_PUBLIC_API_URL env var (set per-environment).
// The fallback points at the deployed Railway backend so a production build never
// accidentally targets localhost when the env var is missing. Local dev sets
// NEXT_PUBLIC_API_URL in .env.local to override this.
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://cyber-security-escape-room-sever-production.up.railway.app/api';

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

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default api;
