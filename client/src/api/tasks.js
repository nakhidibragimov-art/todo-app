import { api } from './client';

export const STATUSES = [
  { value: 'TODO', label: 'To do', slug: 'todo', icon: '○' },
  { value: 'IN_PROGRESS', label: 'In progress', slug: 'in-progress', icon: '◐' },
  { value: 'DONE', label: 'Done', slug: 'done', icon: '✓' },
];

export const tasksApi = {
  list: status => api.get('/tasks', { params: status ? { status } : {} }).then(r => r.data),
  stats: () => api.get('/tasks/stats').then(r => r.data),
  create: task => api.post('/tasks', task).then(r => r.data),
  update: ({ id, ...changes }) => api.patch(`/tasks/${id}`, changes).then(r => r.data),
  remove: id => api.delete(`/tasks/${id}`),
};
