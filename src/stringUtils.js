const moment = require('moment')

const iso8601DateFormat = 'YYYY-MM-DD'

const properCase = word =>
  typeof word === 'string' && word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word

const isBlank = str => !str || /^\s*$/.test(str)

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = name =>
  isBlank(name)
    ? ''
    : name
        .split('-')
        .map(properCase)
        .join('-')

const toFullName = ({ firstName, lastName, name }) =>
  !isBlank(name)
    ? name
        .split(' ')
        .map(properCaseName)
        .join(', ')
    : (!isBlank(lastName) ? `${properCaseName(lastName)}, ` : '') +
      (!isBlank(firstName) ? properCaseName(firstName) : '')

/**
 * Render a moment object or ISO 8601 formatted string in the standard ui date format.  This format is
 * dd/MM/yyyy.  If the date parameter is not present or cannot be understood the function returns '--'.
 * @param date An object which is a moment, an ISO 8601 date formatted string or anything else including null or undefined.
 */
const renderDate = date => {
  const screenFormat = 'DD/MM/YYYY'
  const notPresentString = '--'

  const theMoment = typeof date === 'string' ? moment(date, iso8601DateFormat) : date

  if (theMoment instanceof moment) {
    if (theMoment.isValid()) {
      return theMoment.format(screenFormat)
    }
  }

  return notPresentString
}

const formatDateToLongHand = date => {
  if (!date || typeof date !== 'string') throw new Error('date should not be null and be of type string')

  return moment(date, iso8601DateFormat).format('Do MMMM YYYY')
}

const renderDateTime = date => {
  const screenFormat = 'DD/MM/YYYY HH:mm'
  const iso8601DateTimeFormat = 'YYYY-MM-DDTHH:mm:ss.SSS.'
  const notPresentString = '--'

  const theMoment = typeof date === 'string' ? moment(date, iso8601DateTimeFormat) : date

  if (theMoment instanceof moment) {
    if (theMoment.isValid()) {
      return theMoment.format(screenFormat)
    }
  }

  return notPresentString
}

const switchToIsoDateFormat = displayDateString =>
  isBlank(displayDateString) ? undefined : moment(displayDateString, 'DD/MM/YYYY').format(iso8601DateFormat)

const stringIsInteger = input => {
  const parsed = Number.parseInt(input, 10)
  return !Number.isNaN(parsed)
}

const createQueryParamString = params => {
  if (typeof params !== 'object' || Array.isArray(params)) return null
  return Object.entries(params)
    .filter(([, val]) => val)
    .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
    .join('&')
}

const createValueString = (value, type) => {
  if (value === null) return '-'
  if (type === 'percentage') return `${value}%`
  if (type === 'day') return `${value} ${value === 1 ? 'day' : 'days'}`
  return value
}

module.exports = {
  properCase,
  properCaseName,
  toFullName,
  renderDate,
  renderDateTime,
  switchToIsoDateFormat,
  isBlank,
  stringIsInteger,
  formatDateToLongHand,
  createQueryParamString,
  createValueString,
}
