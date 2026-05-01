export default function AdviceCard({ advice }) {
  return (
    <div className="card" style={{ backgroundColor: 'var(--color-secondary-bg)', borderLeft: '4px solid var(--color-primary)' }}>
      <h3>Recommendations</h3>
      <ul style={{ paddingLeft: '1.5rem' }}>
        {advice.map((item, index) => (
          <li key={index} style={{ marginBottom: 'var(--spacing-md)' }}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
