const page = require('./page')

const unauthorisedPage = () => page('Unauthorised Access', {})

export default {
  verifyOnPage: unauthorisedPage,
}
