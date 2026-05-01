import Button from '../common/Button'

export default function SubmitButton({ onClick, loading = false, text = 'Submit' }) {
  return (
    <Button 
      onClick={onClick} 
      disabled={loading}
      style={{ width: '100%', marginTop: 'var(--spacing-lg)' }}
    >
      {loading ? 'Processing...' : text}
    </Button>
  )
}
