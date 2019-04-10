import React from 'react'
import PropTypes from 'prop-types'
import InputField from '@govuk-react/input-field'
import Button from '@govuk-react/button'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import { lookupMeta } from '../../../govuk-helpers'
import { errorType } from '../../../types'

const AuthUserSearch = ({ user, handleChange, handleSearch, error }) => (
  <GridRow>
    <GridCol setWidth="two-thirds">
      <form onSubmit={handleSearch}>
        <InputField
          meta={lookupMeta('user', error)}
          htmlFor="user"
          mb={6}
          input={{ id: 'user', name: 'user', defaultValue: user, onChange: handleChange }}
        >
          Username or email address
        </InputField>
        <Button type="submit" id="search-button">
          Search
        </Button>
      </form>
    </GridCol>
  </GridRow>
)

AuthUserSearch.propTypes = {
  user: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  error: errorType,
}

AuthUserSearch.defaultProps = {
  error: [],
}

export default AuthUserSearch
