import api from './api'

export const sosService = {
  createAlert: (data) => api.post('/users/sos', data),
  getAdminAlerts: () => api.get('/admin/sos')
}

export default sosService
