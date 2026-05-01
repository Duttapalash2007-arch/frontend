import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/layout/AuthLayout'
import authService from '../../services/authService'
import { useAuth } from '../../hooks/useAuth'
import { validateEmail, validatePassword, validatePhoneNumber } from '../../utils/validators'

const splitFullName = (value) => {
  const [firstName, ...rest] = value.trim().split(/\s+/)
  return {
    firstName: firstName || '',
    lastName: rest.join(' ') || firstName || ''
  }
}

export default function Register() {
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin, login } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
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

    if (formData.fullName.trim().length < 2) {
      nextErrors.fullName = 'Enter your full name.'
    }

    if (!validateEmail(formData.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      nextErrors.phoneNumber = 'Enter a valid phone number.'
    }

    if (!validatePassword(formData.password)) {
      nextErrors.password = 'Password must be at least 6 characters.'
    }

    if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.'
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
      const { firstName, lastName } = splitFullName(formData.fullName)
      const response = await authService.register({
        firstName,
        lastName,
        phoneNumber: formData.phoneNumber.trim(),
        email: formData.email,
        password: formData.password
      })

      login(response.data.user, response.data.token)
      navigate('/', { replace: true })
    } catch (error) {
      setServerError(error.response?.data?.message || 'Unable to register right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <section className="auth-card register-card">
        <div className="register-showcase" aria-hidden="true">
          <div className="register-showcase__content">
            <span className="eyebrow">Start Securely</span>
            <h1>Your health dashboard begins with one account.</h1>
            <p>
              Save assessments, review report history, and continue AI-guided symptom checks from
              any device.
            </p>
          </div>

          <div className="register-preview">
            <div className="register-preview__top">
              <div>
                <span>New profile</span>
                <strong>Ready in 2 minutes</strong>
              </div>
              <span className="register-preview__status">Secure</span>
            </div>

            <div className="register-preview__profile">
              <div className="register-preview__avatar">U</div>
              <div>
                <strong>Personal health space</strong>
                <span>Reports, history, alerts</span>
              </div>
            </div>

            <div className="register-progress">
              <span style={{ '--step-width': '92%' }} />
              <span style={{ '--step-width': '76%' }} />
              <span style={{ '--step-width': '58%' }} />
            </div>
          </div>

          <div className="register-benefits">
            <div>
              <strong>Private by design</strong>
              <span>Your profile stays tied to your secure login.</span>
            </div>
            <div>
              <strong>Fast follow-ups</strong>
              <span>Use saved context to compare future reports.</span>
            </div>
            <div>
              <strong>Admin support</strong>
              <span>Care teams can review authorized activity.</span>
            </div>
          </div>
        </div>

        <div className="register-panel">
          <div className="auth-card__copy">
            <span className="eyebrow">Create Account</span>
            <h1>Register to continue.</h1>
            <p>Enter your details once and unlock reports, disease forms, history, and AI chat.</p>
          </div>

          <form className="auth-form register-form" onSubmit={handleSubmit}>
            {serverError ? <div className="form-alert">{serverError}</div> : null}

            <div className="register-form__grid">
              <label>
                Full Name
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                />
                {errors.fullName ? <small className="field-error">{errors.fullName}</small> : null}
              </label>

              <label>
                Phone Number
                <input
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                />
                {errors.phoneNumber ? <small className="field-error">{errors.phoneNumber}</small> : null}
              </label>
            </div>

            <label>
              Email
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email ? <small className="field-error">{errors.email}</small> : null}
            </label>

            <div className="register-form__grid">
              <label>
                Password
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                />
                {errors.password ? <small className="field-error">{errors.password}</small> : null}
              </label>

              <label>
                Confirm Password
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                />
                {errors.confirmPassword ? <small className="field-error">{errors.confirmPassword}</small> : null}
              </label>
            </div>

            <button type="submit" className="primary-button register-submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <div className="register-actions">
              <button type="button" className="secondary-button secondary-button--compact" onClick={() => navigate('/admin/login')}>
                Admin Log In
              </button>

              <p className="auth-switch">
                Already registered? <Link to="/login">Log in here</Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </AuthLayout>
  )
}
