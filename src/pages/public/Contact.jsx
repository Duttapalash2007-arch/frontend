import Layout from '../../components/layout/Layout'

export default function Contact() {
  return (
    <Layout>
      <div className="container narrow-stack">
        <section className="surface-card contact-grid">
          <div>
            <span className="eyebrow">Contact Us</span>
            <h1>Need help with reports, access, or admin review?</h1>
            <p>
              Reach the support team for login issues, report delivery questions, or platform
              assistance.
            </p>
          </div>
          <div className="contact-list">
            <div>
              <strong>Email</strong>
              <span>teamdevrush@gmail.com</span>
            </div>
            <div>
              <strong>Phone</strong>
              <span>+91 9749024997</span>
            </div>
            <div>
              <strong>Office Hours</strong>
              <span>24 hours</span>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
