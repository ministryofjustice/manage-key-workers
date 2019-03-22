const validateSearch = (user, handleError) => {
  if (!user || !user.trim()) {
    handleError({ response: { data: [{ targetName: 'user', text: 'Enter a username or email address' }] } })
    return false
  }
  return true
}

export default validateSearch
