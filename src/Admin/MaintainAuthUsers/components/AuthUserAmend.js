import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import InputField from '@govuk-react/input-field'
import Button from '@govuk-react/button'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import { BLACK, GREY_3 } from 'govuk-colours'
import { SPACING } from '@govuk-react/constants'
import { errorType } from '../../../types'
import { lookupMeta } from '../../../govuk-helpers'

export const ButtonContainer = styled('div')`
  display: flex;
  flex-direction: row;
  button {
    margin-right: ${SPACING.SCALE_2};
  }
`

const AuthUserAmend = ({ handleAmend, handleChange, handleCancel, error, email }) => (
  <GridRow>
    <GridCol setWidth="two-thirds">
      <form onSubmit={handleAmend} noValidate>
        <InputField
          meta={lookupMeta('email', error)}
          htmlFor="email"
          mb={6}
          input={{
            id: 'email',
            name: 'email',
            onChange: handleChange,
            autoComplete: 'alter-email',
            type: 'email',
            spellCheck: false,
            defaultValue: email,
          }}
        >
          Email address
        </InputField>
        <ButtonContainer>
          <Button type="submit" data-qa="amend-button">
            Amend
          </Button>
          <Button
            type="button"
            data-qa="cancel-button"
            onClick={handleCancel}
            buttonColour={GREY_3}
            buttonTextColour={BLACK}
          >
            Cancel
          </Button>
        </ButtonContainer>
      </form>
    </GridCol>
  </GridRow>
)

AuthUserAmend.propTypes = {
  email: PropTypes.string.isRequired,
  handleAmend: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  error: errorType,
}

AuthUserAmend.defaultProps = {
  error: [],
}

export default AuthUserAmend
