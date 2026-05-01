import api, { buildApiAssetUrl } from './api'

const toReportFormData = (payload) => {
  const formData = new FormData()
  formData.append('disease', payload.disease)
  formData.append('symptoms', payload.symptoms)
  formData.append('mcqAnswers', JSON.stringify(payload.mcqAnswers || {}))
  formData.append('personalDetails', JSON.stringify(payload.personalDetails || {}))

  if (payload.document) {
    formData.append('document', payload.document)
  }

  return formData
}

export const reportService = {
  getReports: () => api.get('/reports'),
  getReport: (id) => api.get(`/reports/${id}`),
  createReport: (payload) => api.post('/reports', toReportFormData(payload)),
  updateReport: (id, data) => api.put(`/reports/${id}`, data),
  deleteReport: (id) => api.delete(`/reports/${id}`),
  getDownloadUrl: (report) => buildApiAssetUrl(report?.pdfReportUrl)
}

export default reportService
