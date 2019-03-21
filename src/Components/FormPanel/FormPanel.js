import styled from 'styled-components'
import { GREY_4 } from 'govuk-colours'
import { spacing } from '@govuk-react/lib'

const FormPanel = styled.div`
  background: ${GREY_4};
  ${spacing.responsivePadding({ size: 4, direction: 'all' })}
`

export default FormPanel
