import { useEffect, useState } from 'react'
import Layout from '../../components/layout/Layout'
import adminService from '../../services/adminService'

export default function AdminReports() {
  const [filters, setFilters] = useState({ disease: '', status: '', isHighRisk: '' })
  const [reports, setReports] = useState([])
  const [selectedReport, setSelectedReport] = useState(null)
  const [notes, setNotes] = useState('')

  const loadReports = async (activeFilters = filters) => {
    const params = {}
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value !== '') {
        params[key] = value
      }
    })

    const response = await adminService.getReports(params)
    setReports(response.data.reports || [])
  }

  useEffect(() => {
    loadReports().catch(() => {
      setReports([])
    })
  }, [])

  const handleFilterApply = async () => {
    await loadReports(filters)
  }

  const handleStatusUpdate = async () => {
    if (!selectedReport) {
      return
    }

    await adminService.updateReportStatus(selectedReport._id, {
      status: selectedReport.status,
      adminNotes: notes
    })

    await loadReports(filters)
  }

  return (
    <Layout>
      <div className="container dashboard-stack">
        <section className="surface-card">
          <span className="eyebrow">Reports Table</span>
          <h1>Review report status, risk, and patient action notes.</h1>
        </section>

        <section className="surface-card filter-bar">
          <select value={filters.disease} onChange={(event) => setFilters((current) => ({ ...current, disease: event.target.value }))}>
            <option value="">All Diseases</option>
            <option value="Cancer">Cancer</option>
            <option value="Allergy">Allergy</option>
            <option value="Malaria">Malaria</option>
            <option value="Diabetes">Diabetes</option>
            <option value="HIV">HIV</option>
            <option value="AIDS">AIDS</option>
          </select>
          <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="reviewed">Reviewed</option>
          </select>
          <select value={filters.isHighRisk} onChange={(event) => setFilters((current) => ({ ...current, isHighRisk: event.target.value }))}>
            <option value="">All Risk Levels</option>
            <option value="true">High Risk</option>
            <option value="false">Normal Risk</option>
          </select>
          <button type="button" className="primary-button" onClick={handleFilterApply}>
            Apply Filters
          </button>
        </section>

        <section className="surface-card">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Disease</th>
                  <th>Score</th>
                  <th>Risk</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.length ? (
                  reports.map((report) => (
                    <tr key={report._id}>
                      <td>{[report.userId?.firstName, report.userId?.lastName].filter(Boolean).join(' ') || 'Unknown'}</td>
                      <td>{report.disease}</td>
                      <td>{report.aiAnalysis?.score ?? 0}%</td>
                      <td>{report.aiAnalysis?.riskLevel || 'Pending'}</td>
                      <td>{report.status}</td>
                      <td>
                        <button type="button" className="secondary-button" onClick={() => {
                          setSelectedReport(report)
                          setNotes(report.adminNotes || '')
                        }}>
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No reports match the current filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {selectedReport ? (
          <section className="surface-card">
            <div className="section-header">
              <div>
                <h2>Selected Report</h2>
                <p>{selectedReport.disease} | Score {selectedReport.aiAnalysis?.score ?? 0}% | Risk {selectedReport.aiAnalysis?.riskLevel || 'Pending'}</p>
              </div>
            </div>

            <div className="detail-grid">
              <label className="field-block">
                Status
                <select
                  value={selectedReport.status}
                  onChange={(event) => setSelectedReport((current) => ({ ...current, status: event.target.value }))}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="reviewed">Reviewed</option>
                </select>
              </label>

              <label className="field-block field-block--full">
                Admin Notes
                <textarea rows="4" value={notes} onChange={(event) => setNotes(event.target.value)} />
              </label>
            </div>

            <button type="button" className="primary-button" onClick={handleStatusUpdate}>
              Save Update
            </button>
          </section>
        ) : null}
      </div>
    </Layout>
  )
}
