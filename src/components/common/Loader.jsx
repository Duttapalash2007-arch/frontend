export default function Loader() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <div style={{
        border: '4px solid var(--color-secondary-bg)',
        borderTop: '4px solid var(--color-primary)',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
        margin: '0 auto'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
