import { useEffect, useState } from 'react'
import Layout from '../../components/layout/Layout'
import adminService from '../../services/adminService'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [highRiskReports, setHighRiskReports] = useState([])

  useEffect(() => {
    let ignore = false

    Promise.allSettled([adminService.getDashboardStats(), adminService.getHighRiskReports()]).then((results) => {
      if (ignore) {
        return
      }

      if (results[0].status === 'fulfilled') {
        setStats(results[0].value.data.stats)
      }

      if (results[1].status === 'fulfilled') {
        setHighRiskReports((results[1].value.data.reports || []).slice(0, 5))
      }
    })

    return () => {
      ignore = true
    }
  }, [])

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers ?? '--' },
    { label: 'Total Reports', value: stats?.totalReports ?? '--' },
    { label: 'High Risk Cases', value: stats?.highRiskReports ?? '--' },
    { label: 'Last 30 Days', value: stats?.reportsLast30Days ?? '--' },
    { label: 'Pending SOS Alerts', value: stats?.pendingSosAlerts ?? stats?.activeSosAlerts ?? '--' },
    { label: 'Approved SOS Alerts', value: stats?.approvedSosAlerts ?? '--' }
  ]

  return (
    <Layout>
      <div className="container dashboard-stack">
        <section className="surface-card">
          <span className="eyebrow">Admin Dashboard</span>
          <h1>Monitor users, reports, and high-risk activity.</h1>
        </section>

        <section className="admin-stats-grid">
          {cards.map((card) => (
            <article key={card.label} className="surface-card stat-card">
              <strong>{card.value}</strong>
              <span>{card.label}</span>
            </article>
          ))}
        </section>

        <section className="surface-card">
          <div className="section-header">
            <div>
              <h2>High Risk Cases</h2>
              <p>Most recent reports that need faster clinical review.</p>
            </div>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Disease</th>
                  <th>Score</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {highRiskReports.length ? (
                  highRiskReports.map((report) => (
                    <tr key={report._id}>
                      <td>{[report.userId?.firstName, report.userId?.lastName].filter(Boolean).join(' ') || 'Unknown'}</td>
                      <td>{report.disease}</td>
                      <td>{report.aiAnalysis?.score ?? 0}%</td>
                      <td>{report.aiAnalysis?.riskLevel || 'Pending'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No high-risk reports found yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Layout>
  )
}
