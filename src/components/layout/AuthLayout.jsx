import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BRAND_LOGO_URL } from '../../utils/constants'

export default function AuthLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const closeMenu = () => {
      if (window.innerWidth > 900) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('resize', closeMenu)
    return () => window.removeEventListener('resize', closeMenu)
  }, [])

  useEffect(() => {
    if (window.innerWidth > 900) {
      document.body.style.overflow = ''
      return undefined
    }

    document.body.style.overflow = isMenuOpen ? 'hidden' : ''

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isMenuOpen])

  return (
    <div className="auth-shell">
      <div className="auth-background" />
      <header className="auth-header">
        <Link to="/login" className="brand-mark" onClick={() => setIsMenuOpen(false)}>
          <img src={BRAND_LOGO_URL} alt="HealthSense.AI logo" className="brand-mark__logo-image" />
          <span>
            <strong>HealthSense.AI</strong>
            <small>Analyze your symptoms with AI</small>
          </span>
        </Link>

        <button
          type="button"
          className={`menu-toggle auth-menu-toggle${isMenuOpen ? ' is-open' : ''}`}
          onClick={() => setIsMenuOpen((value) => !value)}
          aria-label="Toggle authentication navigation"
          aria-expanded={isMenuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <div
          className={`mobile-nav-backdrop auth-nav-backdrop${isMenuOpen ? ' is-visible' : ''}`}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden={!isMenuOpen}
        />

        <nav className={`auth-links${isMenuOpen ? ' is-open' : ''}`}>
          <Link to="/login" onClick={() => setIsMenuOpen(false)}>Log In</Link>
          <Link to="/register" onClick={() => setIsMenuOpen(false)}>Register</Link>
          <Link to="/admin/login" onClick={() => setIsMenuOpen(false)}>Admin Log In</Link>
          <Link to="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link>
          <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
        </nav>
      </header>

      <main className="auth-main">
        {children}
      </main>
    </div>
  )
}
