import React from 'react'
import PropTypes from 'prop-types'
import InputField from '@govuk-react/input-field'
import Button from '@govuk-react/button'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'

const AuthUserSearch = ({ user, handleChange, handleSearch }) => (
  <GridRow>
    <GridCol setWidth="two-thirds">
      <form onSubmit={handleSearch}>
        <InputField
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
  user: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
}

AuthUserSearch.defaultProps = {
  user: '',
}

export default AuthUserSearch
