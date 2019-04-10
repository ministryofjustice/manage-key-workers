import validateSearch from './AuthUserSearchValidation'

describe('Auth search validation', () => {
  let handleError
  beforeEach(() => {
    handleError = jest.fn()
  })

  describe('missing username', () => {
    const missingResponse = {
      response: { data: [{ targetName: 'user', text: 'Enter a username or email address' }] },
    }
    it('should return error if no user specified', () => {
      expect(validateSearch('', handleError)).toBe(false)
      expect(handleError).toBeCalledWith(missingResponse)
    })

    it('should return error if blank user specified', () => {
      expect(validateSearch('           ', handleError)).toBe(false)
      expect(handleError).toBeCalledWith(missingResponse)
    })
  })

  describe('invalid username', () => {
    const invalidResponse = {
      response: {
        data: [{ targetName: 'user', text: 'Username can only include letters, numbers and _' }],
      },
    }

    it('should return error if invalid characters used', () => {
      expect(validateSearch('hello.there', handleError)).toBe(false)
      expect(handleError).toBeCalledWith(invalidResponse)
    })

    it('should succeed if other characters used in email address', () => {
      expect(validateSearch('hello.bob@joe.com', handleError)).toBe(true)
      expect(handleError).not.toBeCalled()
    })

    it('should succeed if numbers and _ used in username', () => {
      expect(validateSearch('1234hello_gen', handleError)).toBe(true)
    })

    it('should return error if spaces used in username', () => {
      expect(validateSearch('1234hello gen', handleError)).toBe(false)
    })
  })

  it('should success if user specified', () => {
    expect(validateSearch('    someuser  ', handleError)).toBe(true)
    expect(handleError).not.toBeCalled()
  })
})
