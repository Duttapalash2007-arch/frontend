export default function Input({ 
  type = 'text', 
  placeholder = '', 
  value = '', 
  onChange = () => {}, 
  className = '',
  disabled = false 
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`input-field ${className}`}
    />
  )
}
