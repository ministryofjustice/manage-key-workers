const getResults = (page) => ({
  count: page.length,
  from: 0,
  to: 20,
  text: 'offenders',
})

const getLink = (text, href) => ({
  text,
  href,
})

export default function pagination(page) {
  return {
    results: getResults(page),
    next: getLink('next', ''),
    previous: getLink('previous', ''),
    items: [getLink('1', ''), getLink('2', '')],
  }
}
