import { useEffect, useState } from 'react'
import Layout from '../../components/layout/Layout'
import adminService from '../../services/adminService'

const formatDateTime = (value) => {
  if (!value) {
    return 'Unknown time'
  }

  return new Date(value).toLocaleString()
}

const getAlertStatusLabel = (status) => {
  if (status === 'approved') {
    return 'APPROVED'
  }

  if (status === 'cancelled') {
    return 'CANCELLED'
  }

  if (status === 'resolved') {
    return 'RESOLVED'
  }

  return 'PENDING'
}

const getAlertStatusClassName = (status) => {
  if (status === 'approved') {
    return ' is-approved'
  }

  if (status === 'cancelled' || status === 'resolved') {
    return ' is-cancelled'
  }

  return ' is-live'
}

const isPendingAlert = (status) => status === 'pending' || status === 'active'

export default function AdminSos() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingAlertId, setUpdatingAlertId] = useState('')
  const [deletingAlertId, setDeletingAlertId] = useState('')
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    let ignore = false

    const loadAlerts = async (showLoader = false) => {
      if (showLoader) {
        setLoading(true)
      }

      try {
        const response = await adminService.getSosAlerts()
        if (!ignore) {
          setAlerts(response.data.alerts || [])
        }
      } catch {
        if (!ignore) {
          setAlerts([])
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadAlerts(true)
    const intervalId = window.setInterval(() => loadAlerts(false), 10000)

    return () => {
      ignore = true
      window.clearInterval(intervalId)
    }
  }, [])

  const handleStatusChange = async (alertId, status) => {
    setUpdatingAlertId(alertId)
    setFeedback('')

    try {
      const response = await adminService.updateSosStatus(alertId, { status })
      const updatedAlert = response.data.alert

      setAlerts((currentAlerts) =>
        currentAlerts.map((alert) => (alert._id === alertId ? updatedAlert : alert))
      )
      setFeedback(status === 'approved' ? 'SOS user approved successfully.' : 'SOS user cancelled successfully.')
    } catch {
      setFeedback('Unable to update SOS user status right now.')
    } finally {
      setUpdatingAlertId('')
    }
  }

  const handleDeleteAlert = async (alertId) => {
    setDeletingAlertId(alertId)
    setFeedback('')

    try {
      await adminService.deleteSosAlert(alertId)
      setAlerts((currentAlerts) => currentAlerts.filter((alert) => alert._id !== alertId))
      setFeedback('SOS alert deleted successfully.')
    } catch {
      setFeedback('Unable to delete SOS alert right now.')
    } finally {
      setDeletingAlertId('')
    }
  }

  const pendingAlerts = alerts.filter((alert) => isPendingAlert(alert.status))
  const approvedAlerts = alerts.filter((alert) => alert.status === 'approved')
  const cancelledAlerts = alerts.filter((alert) => alert.status === 'cancelled' || alert.status === 'resolved')

  return (
    <Layout>
      <div className="container dashboard-stack">
        <section className="surface-card">
          <span className="eyebrow">SOS Monitor</span>
          <h1>Review SOS users, approve urgent requests, or cancel them.</h1>
          <p>Alerts refresh automatically, and approved users stay saved in the approved list.</p>
        </section>

        <section className="admin-stats-grid">
          <article className="surface-card stat-card">
            <strong>{alerts.length}</strong>
            <span>Total SOS Alerts</span>
          </article>
          <article className="surface-card stat-card">
            <strong>{pendingAlerts.length}</strong>
            <span>Pending Approval</span>
          </article>
          <article className="surface-card stat-card">
            <strong>{approvedAlerts.length}</strong>
            <span>Approved Users</span>
          </article>
          <article className="surface-card stat-card">
            <strong>{cancelledAlerts.length}</strong>
            <span>Cancelled Requests</span>
          </article>
        </section>

        <section className="surface-card">
          <div className="section-header">
            <div>
              <h2>Incoming SOS List</h2>
              <p>Each SOS user includes approve and cancel actions for quick review.</p>
            </div>
          </div>

          {feedback ? <p>{feedback}</p> : null}

          {loading ? (
            <p>Loading SOS alerts...</p>
          ) : pendingAlerts.length ? (
            <div className="sos-alert-list">
              {pendingAlerts.map((alert) => (
                <article key={alert._id} className="sos-alert-card">
                  <div className="sos-alert-card__header">
                    <div>
                      <h3>{alert.name}</h3>
                      <p>{alert.email}</p>
                    </div>
                    <span className={`live-pill${getAlertStatusClassName(alert.status)}`}>
                      <span className="live-pill__dot" aria-hidden="true" />
                      {getAlertStatusLabel(alert.status)}
                    </span>
                  </div>

                  <div className="sos-alert-card__meta">
                    <span><strong>Phone:</strong> {alert.phoneNumber || 'Not provided'}</span>
                    <span><strong>Source:</strong> {alert.sourcePage || 'home'}</span>
                    <span><strong>Time:</strong> {formatDateTime(alert.triggeredAt || alert.createdAt)}</span>
                  </div>

                  <p className="sos-alert-card__message">{alert.message}</p>

                  <div className="sos-alert-card__actions">
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() => handleStatusChange(alert._id, 'approved')}
                      disabled={updatingAlertId === alert._id}
                    >
                      {updatingAlertId === alert._id ? 'Saving...' : 'Approve'}
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => handleStatusChange(alert._id, 'cancelled')}
                      disabled={updatingAlertId === alert._id}
                    >
                      {updatingAlertId === alert._id ? 'Saving...' : 'Cancel'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p>No SOS users are waiting for approval right now.</p>
          )}
        </section>

        <section className="surface-card">
          <div className="section-header">
            <div>
              <h2>Approved SOS List</h2>
              <p>Approved users remain here after review so the team can track them later.</p>
            </div>
          </div>

          {loading ? (
            <p>Loading approved SOS users...</p>
          ) : approvedAlerts.length ? (
            <div className="sos-alert-list">
              {approvedAlerts.map((alert) => (
                <article key={alert._id} className="sos-alert-card">
                  <div className="sos-alert-card__header">
                    <div>
                      <h3>{alert.name}</h3>
                      <p>{alert.email}</p>
                    </div>
                    <span className={`live-pill${getAlertStatusClassName(alert.status)}`}>
                      <span className="live-pill__dot" aria-hidden="true" />
                      {getAlertStatusLabel(alert.status)}
                    </span>
                  </div>

                  <div className="sos-alert-card__meta">
                    <span><strong>Phone:</strong> {alert.phoneNumber || 'Not provided'}</span>
                    <span><strong>Source:</strong> {alert.sourcePage || 'home'}</span>
                    <span><strong>Time:</strong> {formatDateTime(alert.triggeredAt || alert.createdAt)}</span>
                  </div>

                  <p className="sos-alert-card__message">{alert.message}</p>

                  <div className="sos-alert-card__actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => handleDeleteAlert(alert._id)}
                      disabled={deletingAlertId === alert._id}
                    >
                      {deletingAlertId === alert._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p>No approved SOS users yet.</p>
          )}
        </section>

        <section className="surface-card">
          <div className="section-header">
            <div>
              <h2>Cancelled SOS List</h2>
              <p>Cancelled requests stay visible here for record keeping.</p>
            </div>
          </div>

          {loading ? (
            <p>Loading cancelled SOS users...</p>
          ) : cancelledAlerts.length ? (
            <div className="sos-alert-list">
              {cancelledAlerts.map((alert) => (
                <article key={alert._id} className="sos-alert-card">
                  <div className="sos-alert-card__header">
                    <div>
                      <h3>{alert.name}</h3>
                      <p>{alert.email}</p>
                    </div>
                    <span className={`live-pill${getAlertStatusClassName(alert.status)}`}>
                      <span className="live-pill__dot" aria-hidden="true" />
                      {getAlertStatusLabel(alert.status)}
                    </span>
                  </div>

                  <div className="sos-alert-card__meta">
                    <span><strong>Phone:</strong> {alert.phoneNumber || 'Not provided'}</span>
                    <span><strong>Source:</strong> {alert.sourcePage || 'home'}</span>
                    <span><strong>Time:</strong> {formatDateTime(alert.triggeredAt || alert.createdAt)}</span>
                  </div>

                  <p className="sos-alert-card__message">{alert.message}</p>

                  <div className="sos-alert-card__actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => handleDeleteAlert(alert._id)}
                      disabled={deletingAlertId === alert._id}
                    >
                      {deletingAlertId === alert._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p>No cancelled SOS users yet.</p>
          )}
        </section>
      </div>
    </Layout>
  )
}
