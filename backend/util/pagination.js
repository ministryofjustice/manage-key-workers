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
  Array.from({ length: totalPages }, (_, i) => 1 + i).map((m) => {
    url.searchParams.set('page', m.toString())
    return getItemLink(m.toString(), url.href, pageNumber === m)
  })

export default function pagination(pageSize, pageNumber, total, url) {
  const totalPages = Math.floor((total - 1) / pageSize) + 1
  const actualPageNumber = pageNumber / pageSize + 1
  return {
    results: getResults(pageSize, actualPageNumber, total),
    next: actualPageNumber < totalPages && getLink('next', ''),
    previous: actualPageNumber > 1 && getLink('previous', ''),
    items: getItems(totalPages, actualPageNumber, new URL(url)),
  }
}
