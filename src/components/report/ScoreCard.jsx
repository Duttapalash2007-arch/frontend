export default function ScoreCard({ score, maxScore = 100 }) {
  const percentage = (score / maxScore) * 100
  const color = percentage > 70 ? '#d32f2f' : percentage > 40 ? '#fbc02d' : '#388e3c'

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <h3>Health Score</h3>
      <div style={{
        fontSize: '3rem',
        fontWeight: 'bold',
        color: color,
        margin: 'var(--spacing-lg) 0'
      }}>
        {score}
      </div>
      <div style={{ 
        backgroundColor: '#e0e0e0', 
        height: '10px', 
        borderRadius: 'var(--border-radius-lg)',
        overflow: 'hidden',
        marginTop: 'var(--spacing-lg)'
      }}>
        <div style={{
          height: '100%',
          width: `${Math.min(percentage, 100)}%`,
          backgroundColor: color,
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  )
}
