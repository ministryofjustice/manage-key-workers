const getResults = (pageSize, pageNumber, total) => ({
  count: total,
  from: Math.min(total, (pageNumber - 1) * pageSize + 1),
  to: Math.min(total, (pageNumber - 1 + 1) * pageSize),
})

const getLink = (text, href) => ({
  text,
  href,
})

export default function pagination(pageSize, pageNumber, total, url) {
  const totalPages = Math.floor((total - 1) / pageSize) + 1
  return {
    results: getResults(pageNumber, total),
    next: pageNumber < totalPages && getLink('next', ''),
    previous: pageNumber > 1 && getLink('previous', ''),
    items: [getLink('1', `${url}/page=1`), getLink('2', `${url}/page=2`)],
  }
}
