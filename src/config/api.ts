/**
 * API Configuration
 * Uses Vite environment variables to make the API URL configurable
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
