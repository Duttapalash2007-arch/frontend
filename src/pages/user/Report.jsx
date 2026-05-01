import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import reportService from '../../services/reportService'
import { formatDate } from '../../utils/helpers'
import { GENERAL_ANALYSIS_DISEASE } from '../../utils/constants'

const toSentence = (value, fallback) => {
  if (Array.isArray(value) && value.length) {
    return value.join(', ')
  }

  if (typeof value === 'string' && value.trim()) {
    return value
  }

  return fallback
}

export default function Report() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openSection, setOpenSection] = useState('summary')

  useEffect(() => {
    let ignore = false

    reportService
      .getReport(id)
      .then((response) => {
        if (!ignore) {
          setReport(response.data.report)
          localStorage.setItem('lastReportId', response.data.report._id)
        }
      })
      .catch((requestError) => {
        if (!ignore) {
          setError(requestError.response?.data?.message || 'Unable to load the report.')
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
  }, [id])

  const sections = useMemo(() => {
    if (!report) {
      return []
    }

    return [
      {
        key: 'conditions',
        title: 'Likely Conditions',
        content: report.aiAnalysis?.likelyCondition || 'No likely condition summary available yet.',
        list: report.aiAnalysis?.probableConditions || []
      },
      {
        key: 'summary',
        title: 'Symptoms Analysis',
        content: report.aiAnalysis?.symptomAnalysis || report.aiAnalysis?.summary || report.symptoms,
        list: report.aiAnalysis?.keyFindings || []
      },
      {
        key: 'risks',
        title: 'Risk Factors',
        content: `Risk level: ${report.aiAnalysis?.riskLevel || 'Pending'}. Final score: ${report.aiAnalysis?.score ?? 0}%.`,
        list: report.aiAnalysis?.riskFactors || report.aiAnalysis?.scoreBreakdown?.contributingFactors || []
      },
      {
        key: 'insights',
        title: 'AI Insights',
        content: report.aiAnalysis?.documentAnalysis || report.aiAnalysis?.summary || 'No additional AI summary available.',
        list: [
          report.aiAnalysis?.scoreBreakdown?.answeredQuestions
            ? `Answered questions: ${report.aiAnalysis.scoreBreakdown.answeredQuestions}`
            : null,
          report.aiAnalysis?.scoreBreakdown?.questionnaireScore !== undefined
            ? `Questionnaire score: ${report.aiAnalysis.scoreBreakdown.questionnaireScore}%`
            : null,
          report.aiAnalysis?.scoreBreakdown?.symptomScore !== undefined
            ? `Symptom score: ${report.aiAnalysis.scoreBreakdown.symptomScore}%`
            : null,
          report.aiAnalysis?.scoreBreakdown?.aiScore !== null && report.aiAnalysis?.scoreBreakdown?.aiScore !== undefined
            ? `AI model score: ${report.aiAnalysis.scoreBreakdown.aiScore}%`
            : null
        ].filter(Boolean)
      },
      {
        key: 'recommendations',
        title: 'Health Recommendations',
        content: report.aiAnalysis?.medicalAdvice || 'Consult a healthcare professional for tailored advice.',
        list: report.aiAnalysis?.recommendations || []
      }
    ]
  }, [report])

  const healthGaps = useMemo(() => {
    if (!report) {
      return []
    }

    return report.aiAnalysis?.riskFactors?.length
      ? report.aiAnalysis.riskFactors.slice(0, 3)
      : report.symptoms
          ?.split(/[,.]/)
          .map((item) => item.trim())
          .filter(Boolean)
          .slice(0, 3) || ['Further medical review recommended']
  }, [report])

  const handleDownload = () => {
    if (!report) {
      return
    }

    const downloadUrl = reportService.getDownloadUrl(report)
    if (downloadUrl) {
      window.open(downloadUrl, '_blank', 'noopener,noreferrer')
      return
    }

    window.print()
  }

  if (loading) {
    return (
      <Layout>
        <div className="container">
          <section className="surface-card">Loading report...</section>
        </div>
      </Layout>
    )
  }

  if (error || !report) {
    return (
      <Layout>
        <div className="container">
          <section className="surface-card">
            <h1>Report unavailable</h1>
            <p>{error || 'The requested report could not be found.'}</p>
          </section>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container report-layout">
        <aside className="surface-card report-sidebar">
          <span className="eyebrow">Navigation</span>
          <h2>Report Sections</h2>
          {sections.map((section) => (
            <button key={section.key} type="button" className="sidebar-link" onClick={() => setOpenSection(section.key)}>
              {section.title}
            </button>
          ))}
          <button type="button" className="primary-button" onClick={handleDownload}>
            Download Report
          </button>
        </aside>

        <section className="surface-card report-main">
          <span className="eyebrow">Report Analysis</span>
          <h1>{report.disease === GENERAL_ANALYSIS_DISEASE ? 'General condition analysis report' : `${report.disease} report`}</h1>
          <p>Generated on {formatDate(report.createdAt)}</p>

          <div className="accordion-list">
            {sections.map((section) => (
              <article key={section.key} className={`accordion-card${openSection === section.key ? ' is-open' : ''}`}>
                <button type="button" className="accordion-trigger" onClick={() => setOpenSection(section.key)}>
                  <span>{section.title}</span>
                  <span>{openSection === section.key ? 'Hide' : 'Show'}</span>
                </button>
                {openSection === section.key ? (
                  <div className="accordion-content">
                    <p>{section.content}</p>
                    {section.list?.length ? (
                      <ul className="report-list">
                        {section.list.map((item, index) => (
                          <li key={`${section.key}-${index}`}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <aside className="surface-card score-panel">
          <div className="score-circle" style={{ '--score': `${report.aiAnalysis?.score ?? 0}%` }}>
            <strong>{report.aiAnalysis?.score ?? 0}%</strong>
            <span>Score</span>
          </div>
          <div className="metric-list">
            <div>
              <strong>Risk Level</strong>
              <span>{report.aiAnalysis?.riskLevel || 'Pending'}</span>
            </div>
            <div>
              <strong>Health Gaps</strong>
              <span>{healthGaps.join(', ')}</span>
            </div>
            <div>
              <strong>Confidence</strong>
              <span>{Math.round((report.aiAnalysis?.confidence ?? 0.6) * 100)}%</span>
            </div>
            <div>
              <strong>Suggestions</strong>
              <span>{toSentence(report.aiAnalysis?.recommendations, report.aiAnalysis?.medicalAdvice || 'Doctor consultation recommended.')}</span>
            </div>
            <div>
              <strong>Urgent Care</strong>
              <span>{report.aiAnalysis?.urgentCare || 'Seek urgent medical support if symptoms suddenly worsen.'}</span>
            </div>
          </div>
        </aside>
      </div>
    </Layout>
  )
}
