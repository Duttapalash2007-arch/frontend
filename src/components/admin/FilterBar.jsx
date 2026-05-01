export default function FilterBar({ filters, onFilterChange }) {
  return (
    <div style={{
      display: 'flex',
      gap: 'var(--spacing-md)',
      padding: 'var(--spacing-lg)',
      backgroundColor: 'var(--color-secondary-bg)',
      borderRadius: 'var(--border-radius-lg)',
      marginBottom: 'var(--spacing-lg)'
    }}>
      {Object.entries(filters).map(([key, value]) => (
        <input
          key={key}
          type="text"
          placeholder={`Filter by ${key}...`}
          value={value}
          onChange={(e) => onFilterChange(key, e.target.value)}
          className="input-field"
        />
      ))}
    </div>
  )
}
