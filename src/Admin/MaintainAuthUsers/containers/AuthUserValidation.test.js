import { validateSearch, validateAdd, validateCreate } from './AuthUserValidation'

describe('Auth search validation', () => {
  let setError
  beforeEach(() => {
    setError = jest.fn()
  })

  describe('missing username', () => {
    const missingResponse = [{ targetName: 'user', text: 'Enter a username or email address' }]
    it('should return error if no user specified', () => {
      expect(validateSearch('', setError)).toBe(false)
      expect(setError).toBeCalledWith(missingResponse)
    })

    it('should return error if blank user specified', () => {
      expect(validateSearch('           ', setError)).toBe(false)
      expect(setError).toBeCalledWith(missingResponse)
    })
  })

  describe('invalid username', () => {
    const invalidResponse = [{ targetName: 'user', text: 'Username can only include letters, numbers and _' }]

    it('should return error if invalid characters used', () => {
      expect(validateSearch('hello.there', setError)).toBe(false)
      expect(setError).toBeCalledWith(invalidResponse)
    })

    it('should succeed if other characters used in email address', () => {
      expect(validateSearch('hello.bob@joe.com', setError)).toBe(true)
      expect(setError).not.toBeCalled()
    })

    it('should succeed if numbers and _ used in username', () => {
      expect(validateSearch('1234hello_gen', setError)).toBe(true)
    })

    it('should return error if spaces used in username', () => {
      expect(validateSearch('1234hello gen', setError)).toBe(false)
    })
  })

  it('should success if user specified', () => {
    expect(validateSearch('    someuser  ', setError)).toBe(true)
    expect(setError).not.toBeCalled()
  })
})

describe('Auth add validation', () => {
  let setError
  beforeEach(() => {
    setError = jest.fn()
  })

  describe('missing role', () => {
    const missingResponse = [{ targetName: 'role', text: 'Select a role' }]
    it('should return error if no role specified', () => {
      expect(validateAdd(undefined, setError)).toBe(false)
      expect(setError).toBeCalledWith(missingResponse)
    })
  })

  it('should success if role specified', () => {
    expect(validateAdd({ roleCode: 'roleA' }, setError)).toBe(true)
    expect(setError).not.toBeCalled()
  })
})

describe('Auth create validation', () => {
  let setError
  beforeEach(() => {
    setError = jest.fn()
  })

  it('should return errors if no fields specified', () => {
    expect(validateCreate({}, setError)).toBe(false)
    expect(setError).toBeCalledWith([
      { targetName: 'username', text: 'Enter a username' },
      { targetName: 'email', text: 'Enter an email address' },
      { targetName: 'firstName', text: 'Enter a first name' },
      { targetName: 'lastName', text: 'Enter a last name' },
    ])
  })
  it('should disallow fields that are too short', () => {
    expect(validateCreate({ username: 'a', email: 'b', firstName: 'c', lastName: 'd' }, setError)).toBe(false)
    expect(setError).toBeCalledWith([
      { targetName: 'username', text: 'Username must be 6 characters or more' },
      { targetName: 'firstName', text: 'First name must be 2 characters or more' },
      { targetName: 'lastName', text: 'Last name must be 2 characters or more' },
      { targetName: 'email', text: 'Enter an email address in the correct format, like first.last@justice.gov.uk' },
    ])
  })
  it('should validate specific characters allowed', () => {
    expect(validateCreate({ username: '"', email: 'b@c,d', firstName: 'ca', lastName: 'de' }, setError)).toBe(false)
    expect(setError).toBeCalledWith([
      { targetName: 'username', text: 'Username must be 6 characters or more' },
      { targetName: 'username', text: 'Username can only contain A-Z, 0-9 and _ characters' },
      { targetName: 'email', text: 'Enter an email address in the correct format, like first.last@justice.gov.uk' },
    ])
  })
  it('should pass validation', () => {
    expect(
      validateCreate({ username: 'joejoe', email: 'joe+bloggs@joe.com', firstName: 'joe', lastName: 'joe' }, setError)
    ).toBe(true)
    expect(setError).not.toBeCalled()
  })
})
