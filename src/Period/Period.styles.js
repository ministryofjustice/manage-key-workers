import styled from 'react-emotion'
import { SPACING, FONT_SIZE, BREAKPOINTS } from '@govuk-react/constants'

export const FilterStyled = styled('div')`
  display: flex;
  align-items: flex-end;
  margin-bottom: ${SPACING.SCALE_4};
`

export const DefaultText = styled('p')`
  font-size: ${FONT_SIZE.SIZE_16};

  @media (min-width: ${BREAKPOINTS.LARGESCREEN}) {
    margin-bottom: 0;
    font-size: ${FONT_SIZE.SIZE_19};
  }
`
