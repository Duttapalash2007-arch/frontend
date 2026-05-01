import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import reportService from '../../services/reportService'
import { formatDate } from '../../utils/helpers'

const riskRank = {
  high: 3,
  medium: 2,
  low: 1,
  pending: 0
}

const getReportScore = (report) => Number(report.aiAnalysis?.score ?? 0)
const getReportDate = (report) => new Date(report.createdAt || 0).getTime()
const getReportRisk = (report) => String(report.aiAnalysis?.riskLevel || 'pending').toLowerCase()

const sortReports = (reports, sortBy) => {
  return [...reports].sort((first, second) => {
    if (sortBy === 'oldest') {
      return getReportDate(first) - getReportDate(second)
    }

    if (sortBy === 'highest-score') {
      return getReportScore(second) - getReportScore(first)
    }

    if (sortBy === 'lowest-score') {
      return getReportScore(first) - getReportScore(second)
    }

    if (sortBy === 'disease') {
      return String(first.disease || '').localeCompare(String(second.disease || ''))
    }

    if (sortBy === 'risk') {
      return (riskRank[getReportRisk(second)] ?? 0) - (riskRank[getReportRisk(first)] ?? 0)
    }

    return getReportDate(second) - getReportDate(first)
  })
}

export default function History() {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [sortBy, setSortBy] = useState('newest')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    reportService
      .getReports()
      .then((response) => {
        if (!ignore) {
          setReports(response.data.reports || [])
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [])

  const sortedReports = useMemo(() => sortReports(reports, sortBy), [reports, sortBy])
  const totalReports = reports.length
  const highestScore = totalReports ? Math.max(...reports.map(getReportScore)) : 0
  const latestReportDate = sortedReports[0]?.createdAt ? formatDate(sortedReports[0].createdAt) : 'No reports yet'

  return (
    <Layout>
      <div className="container dashboard-stack">
        <section className="surface-card history-hero">
          <span className="eyebrow">History</span>
          <h1>Your report timeline.</h1>
          <p>
            Reopen previous reports, compare risk scores, and download PDFs whenever you need to
            share or review your health summary.
          </p>
        </section>

        <section className="history-summary" aria-label="History summary">
          <article className="stat-card history-summary__card">
            <span>Total Reports</span>
            <strong>{loading ? '--' : totalReports}</strong>
            <small>Generated assessments</small>
          </article>
          <article className="stat-card history-summary__card">
            <span>Highest Score</span>
            <strong>{loading ? '--' : `${highestScore}%`}</strong>
            <small>Use risk level for context</small>
          </article>
          <article className="stat-card history-summary__card">
            <span>Latest Report</span>
            <strong>{loading ? '--' : latestReportDate}</strong>
            <small>Most recent activity</small>
          </article>
        </section>

        <section className="surface-card">
          <div className="section-header history-toolbar">
            <div>
              <h2>Saved Reports</h2>
              <p>{loading ? 'Loading your saved reports.' : `${totalReports} report${totalReports === 1 ? '' : 's'} available.`}</p>
            </div>
            <label className="sort-control">
              Sort
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="highest-score">Highest score</option>
                <option value="lowest-score">Lowest score</option>
                <option value="disease">Disease A-Z</option>
                <option value="risk">Highest risk</option>
              </select>
            </label>
          </div>

          {loading ? (
            <div className="history-empty-state">Loading report history...</div>
          ) : sortedReports.length ? (
            <div className="history-grid">
              {sortedReports.map((report) => (
                <article key={report._id} className="history-card history-card--report">
                  <div className="history-card__top">
                    <strong>{report.disease}</strong>
                    <span className={`risk-pill risk-pill--${getReportRisk(report)}`}>
                      {report.aiAnalysis?.riskLevel || 'Pending'}
                    </span>
                  </div>
                  <span>{formatDate(report.createdAt)}</span>
                  <span>Score: {report.aiAnalysis?.score ?? 0}%</span>
                  <p>{report.aiAnalysis?.summary || report.aiAnalysis?.likelyCondition || 'Open the report to review detailed AI findings.'}</p>
                  <div className="history-card__actions">
                    <button type="button" className="primary-button" onClick={() => navigate(`/report/${report._id}`)}>
                      Open
                    </button>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => {
                        const downloadUrl = reportService.getDownloadUrl(report)
                        if (downloadUrl) {
                          window.open(downloadUrl, '_blank', 'noopener,noreferrer')
                        } else {
                          navigate(`/report/${report._id}`)
                        }
                      }}
                    >
                      PDF
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="history-empty-state">
              No reports yet. Start from the dashboard to create your first HealthSense.AI report.
            </div>
          )}
        </section>
      </div>
    </Layout>
  )
}
