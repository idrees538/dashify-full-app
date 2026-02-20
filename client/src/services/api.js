/**
 * Lightweight API client for Dashify.
 * All requests go through the Vite proxy (/api → localhost:5000/api).
 */

const API_BASE = '/api';

/**
 * Get auth token from localStorage.
 */
const getToken = () => localStorage.getItem('dashify_token');

/**
 * Set auth token in localStorage.
 */
export const setToken = (token) => localStorage.setItem('dashify_token', token);

/**
 * Remove auth token (logout).
 */
export const clearToken = () => localStorage.removeItem('dashify_token');

/**
 * Core request function.
 * @param {string} endpoint - e.g. '/auth/login'
 * @param {object} options - { method, body, params }
 */
async function request(endpoint, { method = 'GET', body = null, params = {} } = {}) {
    const url = new URL(`${API_BASE}${endpoint}`, window.location.origin);

    // Append query params
    Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
            url.searchParams.append(key, val);
        }
    });

    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = { method, headers };
    if (body && method !== 'GET') {
        config.body = JSON.stringify(body);
    }

    const res = await fetch(url.pathname + url.search, config);
    const data = await res.json();

    if (!res.ok) {
        const error = new Error(data.message || 'Request failed');
        error.status = res.status;
        error.data = data;
        throw error;
    }

    return data;
}

// Convenience methods
export const api = {
    get: (endpoint, params) => request(endpoint, { method: 'GET', params }),
    post: (endpoint, body) => request(endpoint, { method: 'POST', body }),
    put: (endpoint, body) => request(endpoint, { method: 'PUT', body }),
    delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

export default api;
