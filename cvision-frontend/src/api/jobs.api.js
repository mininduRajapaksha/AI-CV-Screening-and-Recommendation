import api from './axios';

export const jobsApi = {
  list: (params) => api.get('/jobs', { params }),
  get: (id) => api.get(`/jobs/${id}`),
  create: (payload) => api.post('/jobs', payload),
  update: (id, payload) => api.patch(`/jobs/${id}`, payload),
  remove: (id) => api.delete(`/jobs/${id}`),
  close: (id) => api.patch(`/jobs/${id}/close`),
};
