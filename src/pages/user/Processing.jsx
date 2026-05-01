import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import reportService from '../../services/reportService'

const stages = ['Analyzing your data...', 'Generating report...', 'Preparing insights...']

export default function Processing() {
  const location = useLocation()
  const navigate = useNavigate()
  const [stageIndex, setStageIndex] = useState(0)
  const [error, setError] = useState('')
  const submission = location.state?.submission

  useEffect(() => {
    if (!submission) {
      navigate('/dashboard', { replace: true })
      return
    }

    const interval = setInterval(() => {
      setStageIndex((current) => (current + 1) % stages.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [navigate, submission])

  useEffect(() => {
    if (!submission) {
      return
    }

    let active = true

    reportService
      .createReport(submission)
      .then((response) => {
        if (!active) {
          return
        }

        const reportId = response.data.report?._id
        localStorage.setItem('lastReportId', reportId)
        navigate(`/report/${reportId}`, { replace: true })
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.response?.data?.message || 'Unable to generate the report.')
        }
      })

    return () => {
      active = false
    }
  }, [navigate, submission])

  const stage = useMemo(() => stages[stageIndex], [stageIndex])

  return (
    <Layout>
      <div className="container processing-wrap">
        <section className="processing-card">
          <div className="processing-spinner" />
          <h1>{stage}</h1>
          <p>Please wait 10 to 20 seconds while the AI reviews the submitted information.</p>
          {error ? (
            <>
              <div className="form-alert">{error}</div>
              <button type="button" className="secondary-button" onClick={() => navigate(-1)}>
                Back to Form
              </button>
            </>
          ) : null}
        </section>
      </div>
    </Layout>
  )
}
