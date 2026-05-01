import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/layout/AuthLayout'
import authService from '../../services/authService'
import { useAuth } from '../../hooks/useAuth'
import { validateEmail, validatePassword } from '../../utils/validators'

export default function Login() {
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin, login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin/dashboard' : '/'} replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!validateEmail(formData.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!validatePassword(formData.password)) {
      nextErrors.password = 'Password must be at least 6 characters.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setServerError('')

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const response = await authService.login(formData.email, formData.password)
      login(response.data.user, response.data.token)
      navigate(response.data.user.role === 'admin' ? '/admin/dashboard' : '/', { replace: true })
    } catch (error) {
      setServerError(error.response?.data?.message || 'Unable to log in right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <section className="auth-card login-card">
        <div className="login-showcase" aria-hidden="true">
          <div className="login-showcase__badge">
            <div className="login-showcase__avatar">P</div>
            <div>
              <strong>Priya Patel</strong>
              <span>Age 32</span>
            </div>
          </div>

          <div className="login-showcase__grid">
            <article className="login-metric-card login-metric-card--score">
              <p>Overall Risk Score</p>
              <strong>88/100 - High Risk</strong>
              <div className="login-metric-card__gauge" />
            </article>

            <article className="login-metric-card">
              <p>Key Health Areas</p>
              <ul className="login-metric-card__list">
                <li><span>Cardiopulmonary</span><strong>91%</strong></li>
                <li><span>Digestive</span><strong>78%</strong></li>
                <li><span>Immunological</span><strong>31%</strong></li>
              </ul>
            </article>

            <article className="login-metric-card">
              <p>History</p>
              <ul className="login-metric-card__list login-metric-card__list--stacked">
                <li><span>Cardiopulmonary</span><small>24 Mar 2023</small></li>
                <li><span>Digestive</span><small>24 Mar 2023</small></li>
                <li><span>Digestive</span><small>24 Mar 2023</small></li>
              </ul>
            </article>

            <article className="login-metric-card">
              <p>History</p>
              <ul className="login-metric-card__timeline">
                <li />
                <li />
                <li />
              </ul>
            </article>
          </div>
        </div>

        <div className="login-panel">
          <div className="auth-card__copy">
            <span className="eyebrow">Secure Access</span>
            <h1>Log in to continue your health assessment.</h1>
            <p>
              Sign in to select a disease, submit symptoms, track report history, and chat with the
              AI assistant.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {serverError ? <div className="form-alert">{serverError}</div> : null}

            <label>
              Email
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="test@test.com"
              />
              {errors.email ? <small className="field-error">{errors.email}</small> : null}
            </label>

            <label>
              Password
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              {errors.password ? <small className="field-error">{errors.password}</small> : null}
            </label>

            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>

            <button type="button" className="secondary-button secondary-button--compact" onClick={() => navigate('/admin/login')}>
              Admin Log In
            </button>

            <p className="auth-switch">
              No account yet? <Link to="/register">Register here</Link>
            </p>
          </form>
        </div>
      </section>
    </AuthLayout>
  )
}
