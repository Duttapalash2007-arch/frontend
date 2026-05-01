export default function QuestionCard({ question, answer, onChange }) {
  return (
    <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
      <h4>{question.text}</h4>
      <textarea
        value={answer}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Your answer..."
        style={{
          width: '100%',
          padding: 'var(--spacing-md)',
          marginTop: 'var(--spacing-md)',
          border: '1px solid #ddd',
          borderRadius: 'var(--border-radius-md)',
          minHeight: '100px',
          fontFamily: 'inherit'
        }}
      />
    </div>
  )
}
