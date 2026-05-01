import api from './api'

export const uploadService = {
  uploadFile: (file, type = 'image') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  deleteFile: (fileId) => api.delete(`/upload/${fileId}`)
}

export default uploadService
