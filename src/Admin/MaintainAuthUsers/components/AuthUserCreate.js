import React from 'react'
import PropTypes from 'prop-types'
import InputField from '@govuk-react/input-field'
import Button from '@govuk-react/button'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import { lookupMeta } from '../../../govuk-helpers'
import { errorType } from '../../../types'

const AuthUserCreate = ({ handleChange, handleCreate, error }) => (
  <GridRow>
    <GridCol setWidth="two-thirds">
      <form onSubmit={handleCreate}>
        <InputField
          meta={lookupMeta('username', error)}
          htmlFor="username"
          mb={6}
          input={{
            id: 'username',
            name: 'username',
            onChange: handleChange,
            autoComplete: 'create-username',
            spellcheck: false,
          }}
        >
          Username
        </InputField>
        <InputField
          meta={lookupMeta('email', error)}
          htmlFor="email"
          mb={6}
          input={{
            id: 'email',
            name: 'email',
            onChange: handleChange,
            autoComplete: 'create-email',
            type: 'email',
            spellcheck: false,
          }}
        >
          Email address
        </InputField>
        <InputField
          meta={lookupMeta('firstName', error)}
          htmlFor="firstName"
          mb={6}
          input={{ id: 'firstName', name: 'firstName', onChange: handleChange, spellcheck: false }}
        >
          First name
        </InputField>
        <InputField
          meta={lookupMeta('lastName', error)}
          htmlFor="lastName"
          mb={6}
          input={{ id: 'lastName', name: 'lastName', onChange: handleChange, spellcheck: false }}
        >
          Last name
        </InputField>
        <Button type="submit" id="create-button">
          Create
        </Button>
      </form>
    </GridCol>
  </GridRow>
)

AuthUserCreate.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleCreate: PropTypes.func.isRequired,
  error: errorType,
}

AuthUserCreate.defaultProps = {
  error: [],
}

export default AuthUserCreate
