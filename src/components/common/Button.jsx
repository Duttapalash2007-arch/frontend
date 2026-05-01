export default function Button({ children, onClick, className = '', variant = 'primary' }) {
  return (
    <button
      onClick={onClick}
      className={`btn btn-${variant} ${className}`}
    >
      {children}
    </button>
  )
}
