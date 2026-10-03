import api from './axios';

export const jobsApi = {
  list: (params) => api.get('/jobs', { params }).then((res) => res.data),
  get: (id) => api.get(`/jobs/${id}`).then((res) => res.data),
  create: (payload) => api.post('/jobs', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/jobs/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/jobs/${id}`).then((res) => res.data),
  close: (id) => api.patch(`/jobs/${id}/close`).then((res) => res.data),
};
