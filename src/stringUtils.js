const moment = require('moment');

const properCase = (word) => {
  return ((typeof word === 'string') && (word.length >= 1)) ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word;
};

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = (name) => {
  return isBlank(name) ? '' : name.split('-').map(properCase).join('-');
};

function isBlank (str) {
  return (!str || /^\s*$/.test(str));
}

const toFullName = ({ firstName, lastName, name }) =>
  !isBlank(name) ? name.split(' ').map(properCaseName).join(', ') :
    (!isBlank(lastName) ? `${properCaseName(lastName)}, ` : '') + (!isBlank(firstName) ? properCaseName(firstName) : '');

/**
 * Render a moment object or ISO 8601 formatted string in the standard ui date format.  This format is
 * dd/MM/yyyy.  If the date parameter is not present or cannot be understood the function returns '--'.
 * @param date An object which is a moment, an ISO 8601 date formatted string or anything else including null or undefined.
 */
const renderDate = (date) => {
  const screenFormat = 'DD/MM/YYYY';
  const iso8601DateFormat = 'YYYY-MM-DD';
  const notPresentString = '--';

  const theMoment = (typeof date === 'string') ? moment(date, iso8601DateFormat) : date;

  if (theMoment instanceof moment) {
    if (theMoment.isValid()) {
      return theMoment.format(screenFormat);
    }
  }

  return notPresentString;
};

const renderDateTime = (date) => {
  const screenFormat = 'DD/MM/YYYY HH:mm';
  const iso8601DateTimeFormat = 'YYYY-MM-DDTHH:mm:ss.SSS.';
  const notPresentString = '--';

  const theMoment = (typeof date === 'string') ? moment(date, iso8601DateTimeFormat) : date;

  if (theMoment instanceof moment) {
    if (theMoment.isValid()) {
      return theMoment.format(screenFormat);
    }
  }

  return notPresentString;
};

module.exports = {
  properCase,
  properCaseName,
  toFullName,
  renderDate,
  renderDateTime
};
