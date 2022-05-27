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

export default function pagination(pageSize, pageNumber, total, url) {
  const totalPages = Math.floor((total - 1) / pageSize) + 1
  const actualPageNumber = pageNumber / pageSize + 1
  const pageIdx = url.indexOf('&page=')
  const originalUrl = pageIdx === -1 ? url : url.substr(0, pageIdx)
  return {
    results: getResults(pageSize, actualPageNumber, total),
    next: actualPageNumber < totalPages && getLink('next', ''),
    previous: actualPageNumber > 1 && getLink('previous', ''),
    items: getItems(totalPages, actualPageNumber, originalUrl),
  }
}
