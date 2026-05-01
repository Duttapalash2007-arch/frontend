import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/layout/AuthLayout'
import authService from '../../services/authService'
import { useAuth } from '../../hooks/useAuth'
import { validateEmail, validatePassword } from '../../utils/validators'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin, login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setServerError('')

    if (!validateEmail(formData.email) || !validatePassword(formData.password)) {
      setServerError('Enter valid admin credentials.')
      return
    }

    setLoading(true)
    try {
      const response = await authService.login(formData.email, formData.password)
      if (response.data.user.role !== 'admin') {
        throw new Error('Admin access required.')
      }

      login(response.data.user, response.data.token)
      navigate('/admin/dashboard', { replace: true })
    } catch (error) {
      setServerError(error.response?.data?.message || error.message || 'Unable to log in as admin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <section className="auth-card auth-card--compact">
        <div className="auth-card__copy">
          <span className="eyebrow">Admin Panel</span>
          <h1>Admin log in</h1>
          <p>Access report metrics, total users, high-risk cases, and report review tools.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {serverError ? <div className="form-alert">{serverError}</div> : null}

          <label>
            Email
            <input
              type="email"
              value={formData.email}
              onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={formData.password}
              onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
            />
          </label>

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Admin Log In'}
          </button>

          <p className="auth-switch">
            Standard user? <Link to="/login">Back to user log in</Link>
          </p>
        </form>
      </section>
    </AuthLayout>
  )
}
