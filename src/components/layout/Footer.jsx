import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <h3>HealthSense.AI</h3>
          <p>
            Guided symptom analysis, AI-assisted insights, and report downloads for a smoother
            health screening journey.
          </p>
          <span className="footer-note">Smarter screening, clearer next steps, cleaner history.</span>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/history">History</Link>
        </div>
        <div className="footer-support">
          <h4>Support</h4>
          <a href="mailto:teamdevrush@gmail.com">teamdevrush@gmail.com</a>
          <a href="tel:+919749024997">+91 9749024997</a>
          <span>24 hours</span>
        </div>
      </div>
    </footer>
  )
}
