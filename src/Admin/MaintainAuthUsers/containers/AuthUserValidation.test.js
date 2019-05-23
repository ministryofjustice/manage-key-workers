import { validateSearch, validateAdd, validateCreate, validateAmend } from './AuthUserValidation'

describe('Auth search validation', () => {
  describe('missing username', () => {
    const missingResponse = [{ targetName: 'user', text: 'Enter a username or email address' }]
    it('should return error if no user specified', () => {
      expect(validateSearch('')).toEqual(missingResponse)
    })

    it('should return error if blank user specified', () => {
      expect(validateSearch('           ')).toEqual(missingResponse)
    })
  })

  describe('invalid username', () => {
    const invalidResponse = [{ targetName: 'user', text: 'Username can only include letters, numbers and _' }]

    it('should return error if invalid characters used', () => {
      expect(validateSearch('hello.there')).toEqual(invalidResponse)
    })

    it('should succeed if other characters used in email address', () => {
      expect(validateSearch('hello.bob@joe.com')).toEqual([])
    })

    it('should succeed if numbers and _ used in username', () => {
      expect(validateSearch('1234hello_gen')).toEqual([])
    })

    it('should return error if spaces used in username', () => {
      expect(validateSearch('1234hello gen')).toEqual(invalidResponse)
    })
  })

  it('should success if user specified', () => {
    expect(validateSearch('    someuser  ')).toEqual([])
  })
})

describe('Auth add validation', () => {
  describe('missing role', () => {
    const missingResponse = [{ targetName: 'role', text: 'Select a role' }]
    it('should return error if no role specified', () => {
      expect(validateAdd(undefined)).toEqual(missingResponse)
    })
  })

  it('should success if role specified', () => {
    expect(validateAdd({ roleCode: 'roleA' })).toEqual([])
  })
})

describe('Auth create validation', () => {
  it('should return errors if no fields specified', () => {
    expect(validateCreate({})).toEqual(
      expect.arrayContaining([
        { targetName: 'username', text: 'Enter a username' },
        { targetName: 'email', text: 'Enter an email address' },
        { targetName: 'firstName', text: 'Enter a first name' },
        { targetName: 'lastName', text: 'Enter a last name' },
      ])
    )
  })
  it('should disallow fields that are too short', () => {
    expect(validateCreate({ username: 'a', email: 'b', firstName: 'c', lastName: 'd' })).toEqual(
      expect.arrayContaining([
        { targetName: 'username', text: 'Username must be 6 characters or more' },
        { targetName: 'email', text: 'Enter an email address in the correct format, like first.last@justice.gov.uk' },
        { targetName: 'firstName', text: 'First name must be 2 characters or more' },
        { targetName: 'lastName', text: 'Last name must be 2 characters or more' },
      ])
    )
  })
  it('should validate specific characters allowed', () => {
    expect(validateCreate({ username: '"', email: 'b@c,d.com', firstName: 'ca', lastName: 'de' })).toEqual(
      expect.arrayContaining([
        { targetName: 'username', text: 'Username must be 6 characters or more' },
        { targetName: 'username', text: 'Username can only contain A-Z, 0-9 and _ characters' },
        { targetName: 'email', text: "Email address can only contain 0-9, a-z, @, ', _, ., - and + characters" },
      ])
    )
  })
  it('should pass validation', () => {
    expect(
      validateCreate({ username: 'joejoe', email: 'joe+bloggs@joe.com', firstName: 'joe', lastName: 'joe' })
    ).toEqual([])
  })
})

describe('Auth amend validation', () => {
  it('should return errors if no fields specified', () => {
    expect(validateAmend({})).toEqual([{ targetName: 'email', text: 'Enter an email address' }])
  })
  it('should disallow fields in wrong format', () => {
    expect(validateAmend({ email: 'b' })).toEqual([
      { targetName: 'email', text: 'Enter an email address in the correct format, like first.last@justice.gov.uk' },
    ])
  })
  it('should disallow fields that are too long', () => {
    expect(validateAmend({ email: 'b'.repeat(241) })).toEqual(
      expect.arrayContaining([
        { targetName: 'email', text: 'Enter an email address in the correct format, like first.last@justice.gov.uk' },
        { targetName: 'email', text: 'Email address must be 240 characters or less' },
      ])
    )
  })
  it('should validate specific characters allowed', () => {
    expect(validateAmend({ email: 'b@c,d.com' })).toEqual(
      expect.arrayContaining([
        { targetName: 'email', text: "Email address can only contain 0-9, a-z, @, ', _, ., - and + characters" },
      ])
    )
  })
  it('should pass validation', () => {
    expect(validateAmend({ email: 'joe+bloggs@joe.com' })).toEqual([])
  })
})
