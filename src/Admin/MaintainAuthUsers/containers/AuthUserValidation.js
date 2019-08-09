const validateSearch = user => {
  if (!user || !user.trim()) {
    return [{ targetName: 'user', text: 'Enter a username or email address' }]
  }
  if (!user.includes('@') && !/^[a-zA-Z0-9_]*$/.test(user.trim())) {
    return [{ targetName: 'user', text: 'Username can only include letters, numbers and _' }]
  }
  return []
}

const validateAddRole = role => (!role ? [{ targetName: 'role', text: 'Select a role' }] : [])

const validateAddGroup = group => (!group ? [{ targetName: 'group', text: 'Select a group' }] : [])

const validateEmailFormat = email => {
  const errors = []
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
  return errors
}

const validateCreate = ({ username, email, firstName, lastName, groupCode }, groupManager) => {
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
  // group code required for group managers
  if (groupManager && (!groupCode || groupCode === '--')) {
    errors.push({ targetName: 'groupCode', text: 'Select a group' })
  }

  if (errors.length) return errors

  if (username.length < 6) {
    errors.push({ targetName: 'username', text: 'Username must be 6 characters or more' })
  }
  if (username.length > 30) {
    errors.push({ targetName: 'username', text: 'Username must be 30 characters or less' })
  }
  if (!username.match(/^[a-zA-Z0-9_]*$/)) {
    errors.push({ targetName: 'username', text: 'Username can only contain A-Z, 0-9 and _ characters' })
  }

  errors.push(...validateEmailFormat(email))

  if (firstName.length < 2) {
    errors.push({ targetName: 'firstName', text: 'First name must be 2 characters or more' })
  }
  if (firstName.length > 50) {
    errors.push({ targetName: 'firstName', text: 'First name must be 50 characters or less' })
  }
  if (lastName.length < 2) {
    errors.push({ targetName: 'lastName', text: 'Last name must be 2 characters or more' })
  }
  if (lastName.length > 50) {
    errors.push({ targetName: 'lastName', text: 'Last name must be 50 characters or less' })
  }

  return errors
}

const validateAmend = ({ email }) => {
  if (!email) return [{ targetName: 'email', text: 'Enter an email address' }]

  return validateEmailFormat(email)
}

export { validateSearch, validateAddRole, validateAddGroup, validateCreate, validateAmend }
