import axios from 'axios';

// Emulador Android: 10.0.2.2  |  Dispositivo físico: tu IP local ej. 192.168.1.X
export const BASE_URL = 'http://10.0.2.2:5000/api';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
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

  deleteEmployee: (id: number, adminId: number | string) =>
    client.delete(`/employees/${id}`, { params: { admin_id: adminId } }),

  getLogs: (params?: { result?: string; limit?: number }) =>
    client.get('/logs', { params }),

  getAlerts: (resolved?: 0 | 1) =>
    client.get('/alerts', { params: resolved !== undefined ? { resolved } : {} }),

  getAlert: (id: number) =>
    client.get(`/alerts/${id}`),

  resolveAlert: (id: number, adminId: number | string) =>
    client.patch(`/alerts/${id}/resolve`, { admin_id: adminId }),

  getAudit: (limit = 50) =>
    client.get('/audit', { params: { limit } }),

  recognize: (formData: FormData) =>
    client.post('/recognize', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
