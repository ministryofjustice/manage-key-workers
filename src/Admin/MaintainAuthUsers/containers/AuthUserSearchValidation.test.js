import validateSearch from './AuthUserSearchValidation'

describe('Auth search validation', () => {
  let handleError
  beforeEach(() => {
    handleError = jest.fn()
  })

  it('should return error if no user specified', () => {
    expect(validateSearch('', handleError)).toBe(false)
    expect(handleError).toBeCalledWith({ response: { data: 'Enter a username or email address' } })
  })

  it('should return error if blank user specified', () => {
    expect(validateSearch('           ', handleError)).toBe(false)
    expect(handleError).toBeCalledWith({ response: { data: 'Enter a username or email address' } })
  })

  it('should success if user specified', () => {
    expect(validateSearch('    someuser  ', handleError)).toBe(true)
    expect(handleError).not.toBeCalled()
  })
})
