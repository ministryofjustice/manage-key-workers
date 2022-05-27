export default function pageRequestFrom(pageSize, pageNumber) {
  return {
    size: pageSize,
    number: pageNumber - 1,
  }
}
