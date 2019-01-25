import styled from 'react-emotion'
import Label from '@govuk-react/label'
import Input from '@govuk-react/input'
import { SPACING } from '@govuk-react/constants'

export const DateContainer = styled(Label)`
  display: block;
  width: 135px;
`

export const DateInput = styled(Input)`
  margin-right: ${SPACING.SCALE_3};
  width: 120px;
  height: 38px;
`
