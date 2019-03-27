const validateSearch = (user, handleError) => {
  if (!user || !user.trim()) {
    handleError({ response: { data: [{ targetName: 'user', text: 'Enter a username or email address' }] } })
    return false
  }
  if (!user.includes('@') && !/^[a-zA-Z0-9_]*$/.test(user.trim())) {
    handleError({
      response: {
        data: [{ targetName: 'user', text: 'Username can only include letters, numbers and _' }],
      },
    })
    return false
  }
  return true
}

export default validateSearch
