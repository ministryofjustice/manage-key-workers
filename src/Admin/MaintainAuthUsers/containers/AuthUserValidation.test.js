import { validateSearch, validateAdd } from './AuthUserValidation'

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
