import api from './api'

export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getReports: (params = {}) => api.get('/admin/reports', { params }),
  getHighRiskReports: () => api.get('/admin/reports/high-risk'),
  getSosAlerts: () => api.get('/admin/sos'),
  updateSosStatus: (alertId, data) => api.put(`/admin/sos/${alertId}`, data),
  deleteSosAlert: (alertId) => api.delete(`/admin/sos/${alertId}`),
  updateReportStatus: (reportId, data) => api.put(`/admin/reports/${reportId}`, data),
  getUserDetails: (userId) => api.get(`/admin/users/${userId}`)
}

export default adminService
