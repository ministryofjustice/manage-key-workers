const validateSearch = (user, setError) => {
  if (!user || !user.trim()) {
    setError([{ targetName: 'user', text: 'Enter a username or email address' }])
    return false
  }
  if (!user.includes('@') && !/^[a-zA-Z0-9_]*$/.test(user.trim())) {
    setError([{ targetName: 'user', text: 'Username can only include letters, numbers and _' }])
    return false
  }
  return true
}

const validateAdd = (role, setError) => {
  if (!role) {
    setError([{ targetName: 'role', text: 'Select a role' }])
    return false
  }
  return true
}

const validateEmailFormat = (email, errors) => {
  if (!email.match(/.*@.*\..*/)) {
    errors.push({
      targetName: 'email',
      text: 'Enter an email address in the correct format, like first.last@justice.gov.uk',
    })
  }
  if (!email.match(/^[0-9A-Za-z@.'_\-+]*$/)) {
    errors.push({
      targetName: 'email',
      text: "Email address can only contain 0-9, a-z, @, ', _, ., - and + characters",
    })
  }
  if (email.length > 240) {
    errors.push({ targetName: 'email', text: 'Email address must be 240 characters or less' })
  }
}

const validateCreate = ({ username, email, firstName, lastName }, setError) => {
  const errors = []
  if (!username) {
    errors.push({ targetName: 'username', text: 'Enter a username' })
  }
  if (!email) {
    errors.push({ targetName: 'email', text: 'Enter an email address' })
  }
  if (!firstName) {
    errors.push({ targetName: 'firstName', text: 'Enter a first name' })
  }
  if (!lastName) {
    errors.push({ targetName: 'lastName', text: 'Enter a last name' })
  }
  if (errors.length > 0) {
    setError(errors)
    return false
  }

  if (username.length < 6) {
    errors.push({ targetName: 'username', text: 'Username must be 6 characters or more' })
  }
  if (!username.match(/^[a-zA-Z0-9_]*$/)) {
    errors.push({ targetName: 'username', text: 'Username can only contain A-Z, 0-9 and _ characters' })
  }
  validateEmailFormat(email, errors)
  if (firstName.length < 2) {
    errors.push({ targetName: 'firstName', text: 'First name must be 2 characters or more' })
  }
  if (lastName.length < 2) {
    errors.push({ targetName: 'lastName', text: 'Last name must be 2 characters or more' })
  }

  if (errors.length > 0) {
    setError(errors)
    return false
  }
  return true
}

const validateAmend = ({ email }, setError) => {
  const errors = []
  if (!email) {
    errors.push({ targetName: 'email', text: 'Enter an email address' })
  }
  if (errors.length > 0) {
    setError(errors)
    return false
  }

  validateEmailFormat(email, errors)

  if (errors.length > 0) {
    setError(errors)
    return false
  }
  return true
}

export { validateSearch, validateAdd, validateCreate, validateAmend }
