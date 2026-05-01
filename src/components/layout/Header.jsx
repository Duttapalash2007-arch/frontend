import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { BRAND_LOGO_URL } from '../../utils/constants'

export default function Header() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const mobileBreakpoint = 900

  const displayName = user?.firstName || user?.name || 'User'
  const navItems = !isAuthenticated
    ? [
        { to: '/', label: 'Home' },
        { to: '/about', label: 'About Us' },
        { to: '/contact', label: 'Contact' },
        { to: '/login', label: 'Log In' },
        { to: '/admin/login', label: 'Admin Login' }
      ]
    : isAdmin
        ? [
          { to: '/', label: 'Home' },
          { to: '/about', label: 'About Us' },
          { to: '/admin/dashboard', label: 'Dashboard' },
          { to: '/admin/reports', label: 'Reports' },
          { to: '/admin/sos', label: 'SOS Alerts' }
        ]
      : [
          { to: '/', label: 'Home' },
          { to: '/about', label: 'About Us' },
          { to: '/contact', label: 'Contact' },
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/history', label: 'History' }
        ]

  const handleLogout = () => {
    logout()
    navigate(isAdmin ? '/admin/login' : '/login')
    setIsMenuOpen(false)
  }

  useEffect(() => {
    const closeMenu = () => setIsMenuOpen(false)
    window.addEventListener('resize', closeMenu)
    return () => window.removeEventListener('resize', closeMenu)
  }, [])

  useEffect(() => {
    if (window.innerWidth > mobileBreakpoint) {
      document.body.style.overflow = ''
      return undefined
    }

    document.body.style.overflow = isMenuOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  return (
    <header className="main-header">
      <div className="container header-inner">
        <Link to={isAdmin ? '/admin/dashboard' : '/'} className="brand-mark" onClick={() => setIsMenuOpen(false)}>
          <img src={BRAND_LOGO_URL} alt="HealthSense.AI logo" className="brand-mark__logo-image" />
          <span>
            <strong>HealthSense.AI</strong>
            <small>{isAdmin ? 'Admin Console' : 'Analyze your symptoms with AI'}</small>
          </span>
        </Link>

        <button
          type="button"
          className={`menu-toggle${isMenuOpen ? ' is-open' : ''}`}
          onClick={() => setIsMenuOpen((value) => !value)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <div
          className={`mobile-nav-backdrop${isMenuOpen ? ' is-visible' : ''}`}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden={!isMenuOpen}
        />

        <nav className={`header-nav${isMenuOpen ? ' is-open' : ''}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          {isAuthenticated && !isAdmin ? (
            <NavLink to="/admin/login" className="nav-link nav-link--ghost" onClick={() => setIsMenuOpen(false)}>
              Admin Login
            </NavLink>
          ) : null}
          {isAuthenticated ? (
            <div className="user-pill">
              <span>{displayName}</span>
              <button type="button" className="nav-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : null}
        </nav>
      </div>
    </header>
  )
}
