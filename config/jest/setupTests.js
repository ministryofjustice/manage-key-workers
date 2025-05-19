import { TextEncoder, TextDecoder } from 'util'
import { configure } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

// Polyfill for TextEncoder
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder
}
if (typeof window.TextEncoder === 'undefined') {
  window.TextEncoder = global.TextEncoder
}

// Polyfill for TextDecoder
if (typeof global.TextDecoder === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  global.TextDecoder = TextDecoder
}
if (typeof window.TextDecoder === 'undefined') {
  window.TextDecoder = global.TextDecoder
}

configure({ adapter: new Adapter() })
