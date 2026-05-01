import Button from '../common/Button'
import api from '../../services/api'

export default function DownloadButton({ reportId, format = 'pdf' }) {
  const handleDownload = async () => {
    try {
      const response = await api.get(`/reports/${reportId}/download`, {
        params: { format },
        responseType: 'blob'
      })
      const blob = response.data
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `report-${reportId}.${format}`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  return (
    <Button onClick={handleDownload}>
      Download {format.toUpperCase()}
    </Button>
  )
}
