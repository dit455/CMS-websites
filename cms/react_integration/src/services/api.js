/**
 * DIT CMS API Service
 * 
 * Centralized Axios configuration for all backend API calls.
 * Place this file in: src/services/api.js
 * 
 * Usage in any component:
 *   import { newsAPI, documentsAPI } from '../services/api';
 */

import axios from 'axios';

// ─── Base Axios Instance ────────────────────────────────────────────────────
// All API calls go through this instance.
// VITE_API_BASE_URL is set in your .env file in the React project root.
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 10000,  // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ───────────────────────────────────────────────────
// Runs before every request. Good place to attach auth tokens later.
API.interceptors.request.use(
  (config) => {
    // If you add login in the future, attach token here:
    // const token = localStorage.getItem('authToken');
    // if (token) config.headers.Authorization = `Token ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ──────────────────────────────────────────────────
// Runs after every response. Handles global errors.
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(`API Error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error('Network Error: No response from server. Is Django running?');
    }
    return Promise.reject(error);
  }
);


// ─── News API ──────────────────────────────────────────────────────────────
export const newsAPI = {
  /** GET /api/news/ticker/ — fetch scrolling news items */
  getTicker: () => API.get('/news/ticker/'),

  /** GET /api/news/articles/ — list all news articles */
  getArticles: (params = {}) => API.get('/news/articles/', { params }),

  /** GET /api/news/articles/{slug}/ — single article */
  getArticle: (slug) => API.get(`/news/articles/${slug}/`),

  /** POST /api/news/articles/ — create article (admin only) */
  createArticle: (formData) =>
    API.post('/news/articles/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },  // Required for image upload
    }),

  /** PATCH /api/news/articles/{slug}/ — partial update */
  updateArticle: (slug, data) =>
    API.patch(`/news/articles/${slug}/`, data),

  /** DELETE /api/news/articles/{slug}/ */
  deleteArticle: (slug) => API.delete(`/news/articles/${slug}/`),
};


// ─── Notifications API ─────────────────────────────────────────────────────
export const notificationsAPI = {
  /** GET /api/notifications/ — fetch all notifications */
  getAll: (params = {}) => API.get('/notifications/', { params }),

  /** GET /api/notifications/?category=circular */
  getByCategory: (category) => API.get('/notifications/', { params: { category } }),

  /** GET /api/notifications/?important=true */
  getImportant: () => API.get('/notifications/', { params: { important: 'true' } }),

  /** POST with optional PDF attachment */
  create: (formData) =>
    API.post('/notifications/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};


// ─── Services API ──────────────────────────────────────────────────────────
export const servicesAPI = {
  getAll: () => API.get('/services/'),
  getOne: (id) => API.get(`/services/${id}/`),
  create: (data) => API.post('/services/', data),
  update: (id, data) => API.patch(`/services/${id}/`, data),
  delete: (id) => API.delete(`/services/${id}/`),
};


// ─── Hero Banners API ──────────────────────────────────────────────────────
export const heroBannerAPI = {
  /** GET /api/hero-banners/ — fetch all active banners (sorted by order) */
  getAll: () => API.get('/hero-banners/'),

  /** POST — create banner with image upload */
  create: (formData) =>
    API.post('/hero-banners/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id, formData) =>
    API.patch(`/hero-banners/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  delete: (id) => API.delete(`/hero-banners/${id}/`),
};


// ─── Downloads API ─────────────────────────────────────────────────────────
export const downloadsAPI = {
  getAll: (params = {}) => API.get('/downloads/', { params }),
  getByCategory: (category) => API.get('/downloads/', { params: { category } }),

  /** POST — upload a file */
  create: (formData) =>
    API.post('/downloads/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  delete: (id) => API.delete(`/downloads/${id}/`),
};


// ─── Documents API ─────────────────────────────────────────────────────────
export const documentsAPI = {
  getAll: (params = {}) => API.get('/documents/', { params }),
  getByCategory: (category) => API.get('/documents/', { params: { category } }),
  search: (query) => API.get('/documents/', { params: { search: query } }),

  /** POST — upload a document with file */
  create: (formData) =>
    API.post('/documents/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  delete: (id) => API.delete(`/documents/${id}/`),
};

export default API;
