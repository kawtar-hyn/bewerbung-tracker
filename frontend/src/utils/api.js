// ============================================================
// utils/api.js — Axios-Instanz für alle API-Anfragen
// Hier wird der Base-URL und der JWT-Token automatisch gesetzt.
// ============================================================

import axios from 'axios';

// Axios-Instanz mit der Backend-URL erstellen
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor ─────────────────────────────────────
// Vor JEDER Anfrage: JWT Token aus dem localStorage lesen und hinzufügen
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ────────────────────────────────────
// Bei 401-Fehler (nicht autorisiert): Benutzer ausloggen
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token abgelaufen oder ungültig
      localStorage.removeItem('token');
      localStorage.removeItem('benutzer');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
