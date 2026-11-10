import { api } from './client';

export const authApi = {
  register: credentials => api.post('/auth/register', credentials).then(r => r.data),
  login: credentials => api.post('/auth/login', credentials).then(r => r.data),
  me: () => api.get('/auth/me').then(r => r.data.user),
};
