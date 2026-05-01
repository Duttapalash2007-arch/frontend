import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HomeBackgroundScene from '../../components/layout/HomeBackgroundScene'
import Layout from '../../components/layout/Layout'
import StickyCardStack from '../../components/layout/StickyCardStack'
import { useAuth } from '../../hooks/useAuth'

const flowSteps = [
  'Choose a disease from the dashboard.',
  'Fill in symptoms, questions, and upload a document.',
  'Wait on the analysis page while the AI generates a report.',
  'Review results, recommendations, and download the PDF.'
]

export default function Home() {
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin } = useAuth()
  const [benefitScore, setBenefitScore] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setBenefitScore((current) => {
        if (current >= 100) {
          window.clearInterval(interval)
          return 100
        }

        return current + 1
      })
    }, 70)

    return () => window.clearInterval(interval)
  }, [])

  const historyTarget = isAuthenticated ? '/history' : '/login'
  const analyzeTarget = isAuthenticated ? '/dashboard' : '/login'

  const handleSosClick = () => {
    navigate(isAuthenticated && !isAdmin ? '/sos' : '/login')
  }

  return (
    <Layout>
      <div className="home-page">
        <HomeBackgroundScene />

        <div className="home-page__content">
          <div className="container home-stack">
            <section className="hero-panel hero-panel--landing" id="top">
              <div className="hero-panel__content hero-panel__content--landing">
                <span className="eyebrow">HealthSense.AI</span>
                <h1>Understand your health from symptoms to smart decisions</h1>
                <p>
                  HealthSense.AI is a web app that uses AI to analyze symptoms and create
                  structured health reports. It helps users understand risks early and take
                  informed action before visiting a doctor. In the future, it can improve early
                  diagnosis and make healthcare more accessible, especially in remote areas.
                </p>
                <div className="hero-panel__actions hero-panel__actions--home">
                  <Link to={analyzeTarget} className="primary-button">
                    Analyze Now
                  </Link>
                  <Link to={historyTarget} className="secondary-button">
                    View History
                  </Link>
                  {!isAdmin ? (
                    <button type="button" className="danger-button" onClick={handleSosClick}>
                      SOS Emergency
                    </button>
                  ) : null}
                </div>

                <div className="hero-benefit">
                  <div className="hero-benefit__header">
                    <span>Live total benefit to users</span>
                    <strong>{benefitScore >= 100 ? '100+' : benefitScore}</strong>
                  </div>
                  <div className="hero-benefit__track" aria-hidden="true">
                    <div className="hero-benefit__fill" style={{ width: `${benefitScore}%` }} />
                  </div>
                </div>
              </div>
              <aside className="hero-panel__card hero-panel__card--accent hero-panel__card--flow" id="flow">
                <h2>How the flow works</h2>
                <ol className="home-flow-list">
                  {flowSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </aside>
            </section>
          </div>

          <StickyCardStack />
        </div>
      </div>
    </Layout>
  )
}
