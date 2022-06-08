const getResults = (pageSize, pageNumber, total) => ({
  count: total,
  from: Math.min(total, (pageNumber - 1) * pageSize + 1),
  to: Math.min(total, (pageNumber - 1 + 1) * pageSize),
})

const getItemLink = (text, href, selected) => ({
  text,
  href,
  selected,
})

const getLink = (text, href) => ({
  text,
  href,
})

const getItems = (totalPages, pageNumber, url) =>
  Array.from({ length: totalPages }, (_, i) => 1 + i).map((m) =>
    getItemLink(m.toString(), `${url}&page=${m.toString()}`, pageNumber === m)
  )

export default function pagination(pageSize, pageOffset, total, url) {
  const totalPages = Math.floor((total - 1) / pageSize) + 1
  const actualPageNumber = pageOffset / pageSize + 1
  const pageIdx = url.indexOf('&page=')
  const originalUrl = pageIdx === -1 ? url : url.substr(0, pageIdx)
  return {
    results: getResults(pageSize, actualPageNumber, total),
    next: actualPageNumber < totalPages && getLink('Next', `${originalUrl}&page=${actualPageNumber + 1}`),
    previous: actualPageNumber > 1 && getLink('Previous', `${originalUrl}&page=${actualPageNumber - 1}`),
    items: (totalPages > 1 && getItems(totalPages, actualPageNumber, originalUrl)) || [],
  }
}
