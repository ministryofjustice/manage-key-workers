const page = require('./page')

const searchPage = () => page('Search for a key worker', {})

export default {
  verifyOnPage: searchPage,
}
