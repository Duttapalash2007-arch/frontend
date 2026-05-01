import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import ReactLenis from 'lenis/react'

const projects = [
  {
    title: 'Pre-Screening: AI-powered symptom assessment before medical visits',
    src: 'https://res.cloudinary.com/ddmqb812q/image/upload/v1777316247/WhatsApp_Image_2026-04-23_at_00.53.02_huhto3.jpg'
  },
  {
    title: 'Accessibility: Health evaluation access for remote and underserved areas',
    src: 'https://res.cloudinary.com/ddmqb812q/image/upload/v1777316248/WhatsApp_Image_2026-04-23_at_00.56.53_l8njao.jpg'
  },
  {
    title: 'Integrations: Seamless clinical system connectivity and multilingual support',
    src: 'https://res.cloudinary.com/ddmqb812q/image/upload/v1777316248/WhatsApp_Image_2026-04-23_at_00.57.16_pgra84.jpg'
  },
  {
    title: 'Diagnostics: Advanced document analysis for broader disease identification',
    src: 'https://res.cloudinary.com/ddmqb812q/image/upload/v1777316247/WhatsApp_Image_2026-04-23_at_00.53.25_ccd7tb.jpg'
  },
  {
    title: 'Digital Assistant: Continuous patient monitoring and medical triage platform',
    src: 'https://res.cloudinary.com/ddmqb812q/image/upload/v1777316247/WhatsApp_Image_2026-04-23_at_00.53.34_ti8dcx.jpg'
  }
]

function StickyCard({ i, title, src, progress, range, targetScale }) {
  const container = useRef(null)
  const scale = useTransform(progress, range, [1, targetScale])

  return (
    <div ref={container} className="sticky-stack__item">
      <motion.div
        style={{
          scale,
          top: `calc(clamp(72px, 10vh, 120px) + ${i * 18}px)`
        }}
        className="sticky-stack__card"
      >
        <img src={src} alt={title} className="sticky-stack__image" loading="lazy" />
        <div className="sticky-stack__overlay">
          <span>0{i + 1}</span>
          <strong>{title}</strong>
        </div>
      </motion.div>
    </div>
  )
}

export default function StickyCardStack() {
  const container = useRef(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  })

  return (
    <section className="sticky-stack-band" id="gallery">
      <div className="sticky-stack-band__inner">
        <div className="sticky-stack-band__intro">
          <span className="eyebrow">Features</span>
          <h2>From Symptoms to Smart Decisions</h2>
          <p>
            Turn your health inputs into meaningful insights with a clean, guided experience. Get
            fast analysis, personalized suggestions, and a smooth interface that works
            effortlessly across all devices.
          </p>
        </div>

        <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
          <main ref={container} className="sticky-stack">
            {projects.map((project, i) => {
              const targetScale = Math.max(0.56, 1 - (projects.length - i - 1) * 0.1)

              return (
                <StickyCard
                  key={`project_${i}`}
                  i={i}
                  {...project}
                  progress={scrollYProgress}
                  range={[i * 0.22, 1]}
                  targetScale={targetScale}
                />
              )
            })}
          </main>
        </ReactLenis>
      </div>
    </section>
  )
}
