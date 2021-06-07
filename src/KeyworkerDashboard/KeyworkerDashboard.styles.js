import styled from 'styled-components'
import { BREAKPOINTS, FONT_SIZE, SPACING } from '@govuk-react/constants'

const Ratio = styled('p')`
  margin: 0;
  font-size: ${FONT_SIZE.SIZE_36};

  @media (min-width: ${BREAKPOINTS.LARGESCREEN}) {
    font-size: 36px;
  }
`

const RatioHeader = styled('h2')`
  font-size: ${FONT_SIZE.SIZE_19};
  font-weight: 900;
  margin-right: ${SPACING.SCALE_3};
  margin-bottom: ${SPACING.SCALE_3} !important;
`

const NoDataMessage = styled('p')`
  font-weight: 700;
`

export const PeriodText = styled('p')`
  font-size: ${FONT_SIZE.SIZE_16};
  margin-bottom: ${SPACING.SCALE_3};

  @media (min-width: ${BREAKPOINTS.LARGESCREEN}) {
    font-size: ${FONT_SIZE.SIZE_19};
  }
`

NoDataMessage.displayName = 'NoDataMessage'

export { Ratio, RatioHeader, NoDataMessage }
