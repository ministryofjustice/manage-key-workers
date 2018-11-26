import styled from 'react-emotion'
import { SPACING } from '@govuk-react/constants'

const FilterStyled = styled('div')`
  display: flex;

  input {
    margin-right: ${SPACING.SCALE_3};
    width: 50px;
  }

  select {
    width: 122px;
    margin-right: ${SPACING.SCALE_3};
  }
`

export default FilterStyled
