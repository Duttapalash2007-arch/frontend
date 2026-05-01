import api from './api'

export const diseaseService = {
  getDiseases: () => api.get('/diseases'),
  getQuestions: (disease) => api.get(`/diseases/${encodeURIComponent(disease)}/questions`)
}

export default diseaseService
