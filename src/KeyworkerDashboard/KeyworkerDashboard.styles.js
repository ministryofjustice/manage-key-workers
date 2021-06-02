import styled from 'styled-components'
import { BREAKPOINTS, FONT_SIZE, SPACING } from '@govuk-react/constants'
import Heading from '@govuk-react/heading'

const Ratio = styled('strong')`
  margin: 0;
  font-size: ${FONT_SIZE.SIZE_24};
  font-weight: 700;

  @media (min-width: ${BREAKPOINTS.LARGESCREEN}) {
    font-size: 36px;
  }
`

const RatioHeader = styled(Heading)`
  font-weight: 200;
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
