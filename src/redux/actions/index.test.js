import { SET_MESSAGE } from './actionTypes'
import { setMessage, clearMessage } from './index'

describe('messages', () => {
  describe('simple actions', () => {
    it('should create an action to set the message', () => {
      const expectedAction = {
        type: SET_MESSAGE,
        message: 'some message',
      }
      expect(setMessage('some message')).toEqual(expectedAction)
    })
    it('should create an action to clear the message', () => {
      const expectedAction = {
        type: SET_MESSAGE,
        message: '',
      }
      expect(clearMessage()).toEqual(expectedAction)
    })
  })
})
