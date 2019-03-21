const validateSearch = (user, handleError) => {
  if (!user || !user.trim()) {
    handleError({ response: { data: 'Enter a username or email address' } })
    return false
  }
  return true
}

export default validateSearch
