import pagination from './pagination'

describe('pagination test', () => {
  it.each`
    pageSize | pageOffset | total  | url             | expectedPages | expectedFrom | expectedTo | expectedNext           | expectedPrevious
    ${20}    | ${0}       | ${100} | ${'test?mdi=i'} | ${5}          | ${1}         | ${20}      | ${'test?mdi=i&page=2'} | ${undefined}
    ${25}    | ${25}      | ${100} | ${'test?mdi=i'} | ${4}          | ${26}        | ${50}      | ${'test?mdi=i&page=3'} | ${'test?mdi=i&page=1'}
    ${25}    | ${50}      | ${101} | ${'test?mdi=i'} | ${5}          | ${51}        | ${75}      | ${'test?mdi=i&page=4'} | ${'test?mdi=i&page=2'}
    ${25}    | ${100}     | ${101} | ${'test?mdi=i'} | ${5}          | ${101}       | ${101}     | ${undefined}           | ${'test?mdi=i&page=4'}
    ${25}    | ${0}       | ${20}  | ${'test?mdi=i'} | ${1}          | ${1}         | ${20}      | ${undefined}           | ${undefined}
  `(
    'given $total records should return $expectedPages pages ($expectedFrom - $expectedTo), next $expectedNext previous $expectedPrevious',
    ({ pageSize, pageOffset, total, url, expectedPages, expectedFrom, expectedTo, expectedNext, expectedPrevious }) => {
      const paginationResult = pagination(pageSize, pageOffset, total, url)
      expect(paginationResult.results.from).toEqual(expectedFrom)
      expect(paginationResult.results.count).toEqual(total)
      expect(paginationResult.results.to).toEqual(expectedTo)
      expect(paginationResult.next.href).toEqual(expectedNext)
      expect(paginationResult.previous.href).toEqual(expectedPrevious)
      if (expectedPages > 1) {
        expect(paginationResult.items.length).toEqual(expectedPages)
        paginationResult.items.forEach((item, idx) => {
          expect(item.href).toEqual(`${url}&page=${idx + 1}`)
        })
      } else {
        expect(paginationResult.items.length).toEqual(0)
      }
    }
  )
})
