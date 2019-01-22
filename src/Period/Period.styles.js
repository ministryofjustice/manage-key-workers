import styled from 'react-emotion'
import { SPACING, FONT_SIZE, BREAKPOINTS } from '@govuk-react/constants'

export const FilterStyled = styled('div')`
  display: flex;
  align-items: flex-end;
  margin-bottom: ${SPACING.SCALE_3};

  input {
    margin-right: ${SPACING.SCALE_3};
    width: 120px;
    height: 38px;
  }
`

export const DefaultText = styled('p')`
  font-size: ${FONT_SIZE.SIZE_16};

  @media (min-width: ${BREAKPOINTS.LARGESCREEN}) {
    margin-bottom: 0;
    font-size: ${FONT_SIZE.SIZE_19};
  }
`
