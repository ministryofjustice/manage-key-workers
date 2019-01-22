import styled from 'react-emotion'
import { SPACING } from '@govuk-react/constants'

const FilterStyled = styled('div')`
  display: flex;
  align-items: center;

  input {
    margin-top: 2px;
    margin-right: ${SPACING.SCALE_3};
    width: 120px;
    height: 38px;
  }
`

export default FilterStyled
