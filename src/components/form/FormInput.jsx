import Input from '../common/Input'

export default function FormInput({ 
  label, 
  error,
  helperText,
  required = false,
  ...inputProps 
}) {
  return (
    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
      <label style={{ 
        display: 'block', 
        marginBottom: 'var(--spacing-sm)', 
        fontWeight: 'bold',
        fontSize: '0.95rem'
      }}>
        {label}
        {required && <span style={{ color: 'var(--color-primary)' }}> *</span>}
      </label>
      <input
        className={`input-field ${error ? 'error' : ''}`}
        {...inputProps}
      />
      {error && <p className="error-message">{error}</p>}
      {helperText && !error && <small style={{ color: '#999', display: 'block', marginTop: '0.25rem' }}>{helperText}</small>}
    </div>
  )
}
