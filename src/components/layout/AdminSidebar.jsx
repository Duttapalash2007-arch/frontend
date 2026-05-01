import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { BRAND_LOGO_URL } from '../../utils/constants'

const adminNavItems = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/sos', label: 'SOS Alerts' }
]

export default function AdminSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const mobileBreakpoint = 1024

  const displayName = user?.firstName || user?.name || 'Admin'
  const activePage = adminNavItems.find((item) => location.pathname.startsWith(item.to))?.label || 'Admin Console'

  const closeSidebar = () => setIsOpen(false)

  useEffect(() => {
    closeSidebar()
  }, [location.pathname])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= mobileBreakpoint) {
        closeSidebar()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (window.innerWidth >= mobileBreakpoint) {
      document.body.style.overflow = ''
      return undefined
    }

    document.body.style.overflow = isOpen ? 'hidden' : ''

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeSidebar()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
    closeSidebar()
  }

  return (
    <>
      <div className="admin-mobile-bar">
        <div>
          <span className="eyebrow">Admin Console</span>
          <strong>{activePage}</strong>
        </div>

        <button
          type="button"
          className={`menu-toggle admin-sidebar-toggle${isOpen ? ' is-open' : ''}`}
          onClick={() => setIsOpen((current) => !current)}
          aria-label="Toggle admin sidebar"
          aria-expanded={isOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div
        className={`admin-sidebar-backdrop${isOpen ? ' is-visible' : ''}`}
        onClick={closeSidebar}
        aria-hidden={!isOpen}
      />

      <aside className={`admin-sidebar${isOpen ? ' is-open' : ''}`}>
        <div className="admin-sidebar__panel">
          <div className="admin-sidebar__top">
            <Link to="/admin/dashboard" className="brand-mark admin-sidebar__brand" onClick={closeSidebar}>
              <img src={BRAND_LOGO_URL} alt="HealthSense.AI logo" className="brand-mark__logo-image" />
              <span>
                <strong>HealthSense.AI</strong>
                <small>Admin Console</small>
              </span>
            </Link>

            <button type="button" className="admin-sidebar__close" onClick={closeSidebar} aria-label="Close admin sidebar">
              Close
            </button>
          </div>

          <div className="admin-sidebar__meta">
            <span className="eyebrow">Signed in</span>
            <strong>{displayName}</strong>
            <p>Manage dashboard metrics and review incoming report activity.</p>
          </div>

          <nav className="admin-sidebar__nav" aria-label="Admin navigation">
            {adminNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `admin-sidebar__link${isActive ? ' is-active' : ''}`}
                onClick={closeSidebar}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="admin-sidebar__actions">
            <button type="button" className="admin-sidebar__logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
