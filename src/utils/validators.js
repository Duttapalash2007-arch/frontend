export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 6
}

export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/
  return phoneRegex.test(phone)
}

export const validateForm = (formData, rules) => {
  const errors = {}
  
  Object.keys(rules).forEach((field) => {
    const value = formData[field]
    const rule = rules[field]
    
    if (rule.required && !value) {
      errors[field] = `${field} is required`
    }
    
    if (rule.validate && value) {
      const isValid = rule.validate(value)
      if (!isValid) {
        errors[field] = rule.message || `${field} is invalid`
      }
    }
  })
  
  return errors
}
