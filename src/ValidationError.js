import React from 'react'
import PropTypes from 'prop-types'

const ValidationErrors = ({ validationErrors, fieldName }) => {
  const isErrors = Object.keys(validationErrors).length > 0

  if (!isErrors) return null

  if (isErrors && validationErrors[fieldName])
    return <span className="error-message">{validationErrors[fieldName]}</span>

  // TODO: If there is any error, this helps with lining fields up, but this depends on layout!
  return <span>&nbsp;</span>
}

ValidationErrors.propTypes = {
  fieldName: PropTypes.string.isRequired,
  validationErrors: PropTypes.shape({}).isRequired,
}

export default ValidationErrors
