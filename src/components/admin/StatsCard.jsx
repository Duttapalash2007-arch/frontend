export default function StatsCard({ title, value, icon = '📊' }) {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>
        {icon}
      </div>
      <h3>{title}</h3>
      <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
        {value}
      </p>
    </div>
  )
}
