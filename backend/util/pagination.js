const getResults = (pageNumber, total) => ({
  count: total,
  from: Math.min(total, (pageNumber - 1) * 20 + 1),
  to: Math.min(total, (pageNumber - 1 + 1) * 20),
})

const getLink = (text, href) => ({
  text,
  href,
})

export default function pagination(pageNumber, total) {
  return {
    results: getResults(pageNumber, total),
    next: getLink('next', ''),
    previous: getLink('previous', ''),
    items: [getLink('1', ''), getLink('2', '')],
  }
}
