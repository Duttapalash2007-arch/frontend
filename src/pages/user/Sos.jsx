import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import sosService from '../../services/sosService'

const COUNTDOWN_SECONDS = 15

export default function Sos() {
  const navigate = useNavigate()
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const hasTriggeredRef = useRef(false)

  useEffect(() => {
    if (hasTriggeredRef.current || isSubmitting) {
      return undefined
    }

    if (secondsLeft <= 0) {
      hasTriggeredRef.current = true

      const triggerAlert = async () => {
        setIsSubmitting(true)
        setError('')

        try {
          await sosService.createAlert({
            sourcePage: 'home',
            countdownSeconds: COUNTDOWN_SECONDS
          })

          navigate('/', { replace: true })
        } catch (requestError) {
          setError(requestError.response?.data?.message || 'Unable to send the SOS alert right now.')
        } finally {
          setIsSubmitting(false)
        }
      }

      triggerAlert()
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setSecondsLeft((current) => current - 1)
    }, 1000)

    return () => window.clearTimeout(timeoutId)
  }, [secondsLeft, isSubmitting, navigate])

  const handleCancel = () => {
    hasTriggeredRef.current = true
    navigate('/', { replace: true })
  }

  return (
    <Layout>
      <div className="container dashboard-stack">
        <section className="surface-card sos-page">
          <div className="sos-page__shell">
            <span className="sos-page__badge">Emergency Medical SOS</span>

            <h1>Medical SOS alert starts in {secondsLeft} seconds.</h1>

            <p className="sos-page__lead">
              Your saved details will be sent to the admin SOS team; cancel now if this is not an emergency.
            </p>

            <div className="sos-page__timer-wrap">
              <div className="sos-page__timer-ring" aria-live="polite">
                <div className="sos-page__timer-core">
                  <strong>{secondsLeft}</strong>
                  <span>Seconds</span>
                </div>
              </div>
            </div>

            <div className="sos-page__status">
              {isSubmitting ? <p>Sending your details to the admin SOS section...</p> : null}
              {error ? <p className="form-alert">{error}</p> : null}
            </div>

            <button type="button" className="secondary-button sos-page__cancel" onClick={handleCancel} disabled={isSubmitting}>
              Cancel SOS
            </button>
          </div>
        </section>
      </div>
    </Layout>
  )
}
