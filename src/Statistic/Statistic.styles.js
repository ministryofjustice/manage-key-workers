import styled from 'styled-components'
import { SPACING, FONT_SIZE, BREAKPOINTS } from '@govuk-react/constants'

export const Container = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export const Heading = styled('h2')`
  flex: 1 0 auto;
  margin: 0 0 ${SPACING.SCALE_3};
  font-size: ${FONT_SIZE.SIZE_16};

  @media (min-width: ${BREAKPOINTS.LARGESCREEN}) {
    font-size: ${FONT_SIZE.SIZE_19};
  }
`

export const Value = styled('strong')`
  display: block;
  margin: 0 0 ${SPACING.SCALE_3};
  font-size: ${FONT_SIZE.SIZE_24};
  font-weight: bold;
  line-height: 1;

  @media (min-width: ${BREAKPOINTS.LARGESCREEN}) {
    font-size: 36px;
  }
`
