import axios from 'axios';

// URL del backend desplegado en Railway.
// Cambia este valor por la URL que te asignó Railway en Settings → Domains.
export const BASE_URL = 'https://tu-proyecto.up.railway.app/api';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

export const api = {
  login: (email: string, password: string) =>
    client.post('/auth/login', { email, password }),

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
