import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://sentinelfacebackend-production.up.railway.app/api';

export const TOKEN_KEY = 'sentinel_access_token';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// Adjunta el token JWT en cada petición automáticamente
client.interceptors.request.use(async config => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  login: (email: string, password: string) =>
    client.post('/auth/login', { email, password }),

  refreshToken: () =>
    client.post('/auth/refresh'),

  getEmployees: () =>
    client.get('/employees'),

  getEmployee: (id: number) =>
    client.get(`/employees/${id}`),

  createEmployee: (formData: FormData) =>
    client.post('/employees', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deactivateEmployee: (id: number, usuarioId: number | string) =>
    client.patch(`/employees/${id}/deactivate`, { usuario_id: usuarioId }),

  getLogs: (params?: { result?: string; limit?: number }) =>
    client.get('/logs', { params }),

  getAlerts: (resolved?: 0 | 1) =>
    client.get('/alerts', { params: resolved !== undefined ? { resolved } : {} }),

  getAlert: (id: number) =>
    client.get(`/alerts/${id}`),

  resolveAlert: (id: number, usuarioId: number | string) =>
    client.patch(`/alerts/${id}/resolve`, { usuario_id: usuarioId }),

  getAudit: (limit = 50) =>
    client.get('/audit', { params: { limit } }),

  recognize: (formData: FormData) =>
    client.post('/recognize', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getRoles: () =>
    client.get('/roles'),

  createRole: (name: string, description: string, usuarioId: number | string) =>
    client.post('/roles', { name, description, requestor_id: usuarioId }),

  deactivateRole: (id: number, usuarioId: number | string) =>
    client.patch(`/roles/${id}/deactivate`, { requestor_id: usuarioId }),

  activateRole: (id: number, usuarioId: number | string) =>
    client.patch(`/roles/${id}/activate`, { requestor_id: usuarioId }),
};
