import Layout from '../../components/layout/Layout'

const teamMembers = [
  {
    name: 'Kalyan Atta',
    image: 'https://res.cloudinary.com/ddmqb812q/image/upload/v1776795148/WhatsApp_Image_2026-04-21_at_23.33.42_1_nxxwhp.jpg',
    role: 'Frontend & Automation Developer',
    linkedinUrl: 'https://www.linkedin.com/in/kalyan-atta-345702380?utm_source=share_via&utm_content=profile&utm_medium=member_android'
  },
  {
    name: 'Palash Dutta',
    image: 'https://res.cloudinary.com/ddmqb812q/image/upload/v1776795148/WhatsApp_Image_2026-04-21_at_23.34.01_1_rbnecu.jpg',
    role: 'Frontend Devoloper',
    linkedinUrl: ' https://www.linkedin.com/in/palash-dutta-2a42a1391?utm_source=share_via&utm_content=profile&utm_medium=member_android'
  },
  {
    name: 'Sourasish Purkait',
    image: 'https://res.cloudinary.com/ddmqb812q/image/upload/v1776795148/WhatsApp_Image_2026-04-21_at_23.33.20_1_lpcljs.jpg',
    role: 'Fullstack Developer',
    linkedinUrl: ' https://www.linkedin.com/in/sourasish-purkait-5742a9297?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app '
  },
  {
    name: ' Soumya Venkatesh Bera ',
    image: 'https://res.cloudinary.com/ddmqb812q/image/upload/v1776797818/WhatsApp_Image_2026-04-22_at_00.14.00_hvbanf.jpg',
    role: 'Backend Developer',
    linkedinUrl: 'https://www.linkedin.com/in/soumya-venkatesh-bera-a756863bb?utm_source=share_via&utm_content=profile&utm_medium=member_android'
  }
]

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="about-team-card__linkedin-icon">
      <path
        fill="currentColor"
        d="M19 3A2 2 0 0 1 21 5v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-9.53 6.75H6.56V18h2.91zM8 5.96a1.69 1.69 0 1 0 0 3.38 1.69 1.69 0 0 0 0-3.38M18 12.25c0-2.71-1.45-3.97-3.39-3.97a2.93 2.93 0 0 0-2.65 1.46V9.75H9.05c.04.66 0 8.25 0 8.25h2.91v-4.61c0-.25.02-.49.09-.67.2-.49.64-1 1.39-1 1 0 1.4.75 1.4 1.85V18h2.91z"
      />
    </svg>
  )
}

export default function About() {
  const scrollingMembers = [...teamMembers, ...teamMembers]

  return (
    <Layout>
      <div className="container about-page-simple">
        <section className="surface-card about-simple-hero">
          <h1>About Us</h1>
          <p>
            We are building a smarter health support experience that helps users understand symptoms,
            move through guided steps with confidence, and receive AI-assisted reports in a clear and
            useful format.
          </p>
        </section>

        <section className="about-simple-grid">
          <article className="surface-card about-info-card">
            <span className="eyebrow">Our Mission</span>
            <h2>To make health reporting easier and more understandable for every user.</h2>
            <p>
              Our mission is to simplify the path from symptom entry to report generation through a
              guided, accessible, and user-friendly experience.
            </p>
          </article>

          <article className="surface-card about-info-card">
            <span className="eyebrow">Our Vision</span>
            <h2>To create a future where digital health guidance feels supportive and fast.</h2>
            <p>
              Our vision is to connect intelligent analysis with thoughtful design so people can take
              their next health step with greater clarity.
            </p>
          </article>
        </section>

        <section className="surface-card about-team-section">
          <div className="about-team-section__header">
            <h2>Our Team</h2>
          </div>

          <div className="about-team-marquee">
            <div className="about-team-track" aria-label="Team members">
              {scrollingMembers.map((member, index) => (
                <article
                  key={`${member.name}-${index}`}
                  className="about-team-card"
                  aria-hidden={index >= teamMembers.length}
                >
                  <div className="about-team-card__photo-wrap">
                    <img src={member.image} alt={member.name} className="about-team-card__photo" />
                  </div>
                  <div className="about-team-card__meta">
                    <strong>{member.name}</strong>
                    <span>{member.role}</span>
                    <a
                      href={member.linkedinUrl}
                      className="about-team-card__linkedin"
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open LinkedIn for ${member.name.trim()}`}
                    >
                      <LinkedInIcon />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
