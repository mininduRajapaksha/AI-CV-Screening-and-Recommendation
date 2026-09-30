import api from './axios';

export const reportsApi = {
  ranking: (jobId, params) => api.get(`/reports/${jobId}/ranking`, { params }),
  exportCsv: (jobId, payload) => api.post(`/reports/${jobId}/export/csv`, payload, { responseType: 'blob' }),
  exportPdf: (jobId, payload) => api.post(`/reports/${jobId}/export/pdf`, payload, { responseType: 'blob' }),
};
