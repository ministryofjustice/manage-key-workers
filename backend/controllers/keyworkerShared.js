const { putLastNameFirst } = require('../utils')

const sortAndFormatKeyworkerNameAndAllocationCount = (keyworkers) =>
  keyworkers
    .sort((left, right) => {
      const diff = left.numberAllocated - right.numberAllocated
      if (diff) return diff

      return left.lastName.localeCompare(right.lastName)
    })
    .map((keyworker) => ({
      ...keyworker,
      formattedName: `${keyworker.numberAllocated || '0'} - ${putLastNameFirst(
        keyworker.firstName,
        keyworker.lastName
      )}`,
    }))

const getDeallocateRow = (staffId, offenderNo) =>
  staffId ? [{ text: 'Deallocate', value: `${staffId}:${offenderNo}:true` }] : []

module.exports = {
  sortAndFormatKeyworkerNameAndAllocationCount,
  getDeallocateRow,
}
