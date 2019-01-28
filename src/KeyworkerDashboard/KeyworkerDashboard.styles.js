import styled from 'react-emotion'
import { BREAKPOINTS, FONT_SIZE, SPACING } from '@govuk-react/constants'
import Header from '@govuk-react/header'

const Ratio = styled('strong')`
  margin: 0;
  font-size: ${FONT_SIZE.SIZE_24};
  font-weight: 700;

  @media (min-width: ${BREAKPOINTS.LARGESCREEN}) {
    font-size: 36px;
  }
`

const RatioHeader = styled(Header)`
  font-weight: 200;
  margin-right: ${SPACING.SCALE_3};
  margin-bottom: ${SPACING.SCALE_3} !important;
`

const NoDataMessage = styled('p')`
  font-weight: 700;
`

NoDataMessage.displayName = 'NoDataMessage'

export { Ratio, RatioHeader, NoDataMessage }
