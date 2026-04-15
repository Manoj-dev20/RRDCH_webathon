// Backend API configuration
// Set VITE_BACKEND_URL in your .env file for production
export const BACKEND_URL = (import.meta as any).env?.VITE_BACKEND_URL || 'https://rrdch-backend.onrender.com'
