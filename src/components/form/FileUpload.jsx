export default function FileUpload({ onFileSelect, accept = '*' }) {
  return (
    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
      <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 'bold' }}>
        Upload File
      </label>
      <input
        type="file"
        accept={accept}
        onChange={(e) => onFileSelect(e.target.files[0])}
        style={{
          padding: 'var(--spacing-md)',
          border: '2px dashed var(--color-primary)',
          borderRadius: 'var(--border-radius-md)',
          cursor: 'pointer'
        }}
      />
    </div>
  )
}
