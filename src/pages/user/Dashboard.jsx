import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import diseaseService from '../../services/diseaseService'
import reportService from '../../services/reportService'
import { GENERAL_ANALYSIS_DISEASE } from '../../utils/constants'
import { formatDate } from '../../utils/helpers'

const fallbackDiseases = ['Cancer', 'Allergy', 'Malaria', 'Diabetes', 'HIV', 'AIDS']

const getReportScore = (report) => Number(report.aiAnalysis?.score ?? 0)
const getReportDate = (report) => new Date(report.createdAt || 0).getTime()

const sortReports = (reports, sortBy) => {
  return [...reports].sort((first, second) => {
    if (sortBy === 'score') {
      return getReportScore(second) - getReportScore(first)
    }

    if (sortBy === 'disease') {
      return String(first.disease || '').localeCompare(String(second.disease || ''))
    }

    return getReportDate(second) - getReportDate(first)
  })
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [diseases, setDiseases] = useState([])
  const [reports, setReports] = useState([])
  const [reportSort, setReportSort] = useState('newest')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    Promise.allSettled([diseaseService.getDiseases(), reportService.getReports()]).then((results) => {
      if (ignore) {
        return
      }

      if (results[0].status === 'fulfilled') {
        setDiseases(results[0].value.data.diseases || [])
      }

      if (results[1].status === 'fulfilled') {
        setReports(results[1].value.data.reports || [])
      }

      setLoading(false)
    })

    return () => {
      ignore = true
    }
  }, [])

  const diseaseOptions = useMemo(() => {
    const normalizedDiseases = (diseases.length ? diseases : fallbackDiseases).map((disease) => (
      typeof disease === 'string' ? disease : disease.name
    ))

    return [...new Set(normalizedDiseases.filter(Boolean))].sort((first, second) => first.localeCompare(second))
  }, [diseases])

  const sortedReports = useMemo(() => sortReports(reports, reportSort), [reports, reportSort])
  const recentReports = sortedReports.slice(0, 3)
  const totalReports = reports.length
  const highRiskReports = reports.filter((report) => String(report.aiAnalysis?.riskLevel || '').toLowerCase() === 'high').length
  const averageScore = totalReports
    ? Math.round(reports.reduce((total, report) => total + getReportScore(report), 0) / totalReports)
    : 0
  const latestReportDate = sortedReports[0]?.createdAt ? formatDate(sortedReports[0].createdAt) : 'No reports yet'

  return (
    <Layout>
      <div className="container dashboard-stack">
        <section className="surface-card dashboard-hero">
          <span className="eyebrow">Dashboard</span>
          <h1>Your HealthSense.AI workspace.</h1>
          <p>
            Start a guided assessment, review your latest AI reports, and keep a simple picture of
            your recent health activity in one place.
          </p>
        </section>

        <section className="dashboard-overview" aria-label="Report overview">
          <article className="stat-card dashboard-overview__card">
            <span>Total Reports</span>
            <strong>{loading ? '--' : totalReports}</strong>
            <small>Saved in your history</small>
          </article>
          <article className="stat-card dashboard-overview__card">
            <span>Average Score</span>
            <strong>{loading ? '--' : `${averageScore}%`}</strong>
            <small>Across completed reports</small>
          </article>
          <article className="stat-card dashboard-overview__card">
            <span>High Risk</span>
            <strong>{loading ? '--' : highRiskReports}</strong>
            <small>Reports needing attention</small>
          </article>
          <article className="stat-card dashboard-overview__card">
            <span>Latest Activity</span>
            <strong>{loading ? '--' : latestReportDate}</strong>
            <small>Most recent report date</small>
          </article>
        </section>

        <section className="surface-card">
          <div className="section-header">
            <div>
              <h2>Start a New Assessment</h2>
              <p>Pick a condition below, answer the guided questions, and generate a structured report.</p>
            </div>
          </div>

          <div className="disease-grid">
            {diseaseOptions.map((disease) => (
              <button
                key={disease}
                type="button"
                className="disease-card"
                onClick={() => navigate(`/assessment/${encodeURIComponent(disease)}`)}
              >
                <span>{disease}</span>
                <small>Open guided form</small>
              </button>
            ))}
          </div>

          <div className="dashboard-special-analysis">
            <span className="eyebrow">Advanced Analysis</span>
            <h3>Analyze any disease and my condition</h3>
            <p>
              Upload a photo or medical report, describe your symptoms, and let the AI review the
              combined information to suggest likely condition areas and next steps.
            </p>
            <button
              type="button"
              className="primary-button"
              onClick={() => navigate(`/assessment/${encodeURIComponent(GENERAL_ANALYSIS_DISEASE)}`)}
            >
              Start General Analysis
            </button>
          </div>
        </section>

        <section className="surface-card">
          <div className="section-header dashboard-report-header">
            <div>
              <h2>Recent Reports</h2>
              <p>Quick access to your selected reports and risk summaries.</p>
            </div>
            <label className="sort-control">
              Sort
              <select value={reportSort} onChange={(event) => setReportSort(event.target.value)}>
                <option value="newest">Newest first</option>
                <option value="score">Highest score</option>
                <option value="disease">Disease A-Z</option>
              </select>
            </label>
          </div>

          {loading ? (
            <p>Loading dashboard data...</p>
          ) : recentReports.length ? (
            <div className="history-grid">
              {recentReports.map((report) => (
                <article key={report._id} className="history-card">
                  <strong>{report.disease}</strong>
                  <span>{formatDate(report.createdAt)}</span>
                  <span>Score: {report.aiAnalysis?.score ?? 0}%</span>
                  <span>Risk: {report.aiAnalysis?.riskLevel || 'Pending'}</span>
                  <button type="button" className="secondary-button" onClick={() => navigate(`/report/${report._id}`)}>
                    View Report
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <p>No reports yet. Pick a disease above to generate your first one.</p>
          )}
        </section>
      </div>
    </Layout>
  )
}
