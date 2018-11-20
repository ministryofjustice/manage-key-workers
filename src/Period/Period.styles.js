import styled from 'react-emotion'
import { SPACING } from '@govuk-react/constants'

const FilterStyled = styled('div')`
  display: flex;
  flow-direction: row;
  align-items: center;

  input {
    margin-top: 2px;
    margin-right: ${SPACING.SCALE_3};
    width: 50px;
    height: 38px;
  }

  label[name='period'] {
    margin-bottom: 0;
  }

  select {
    width: 122px;
    margin-right: ${SPACING.SCALE_3};
    height: 38px;
  }
`

export default FilterStyled
