import styled from 'react-emotion';
import { SPACING, FONT_SIZE, BREAKPOINTS } from '@govuk-react/constants';

export const Container = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const Heading = styled('h2')`
  flex: 1;
  margin: 0 0 ${SPACING.SCALE_3};
  font-size: ${FONT_SIZE.SIZE_16};

  @media (min-width: ${BREAKPOINTS.LARGESCREEN}) {
    font-size: ${FONT_SIZE.SIZE_19};
  }
`;

export const Value = styled('strong')`
  display: block;
  margin: 0 0 ${SPACING.SCALE_3};
  font-size: ${FONT_SIZE.SIZE_24};
  font-weight: bold;
  line-height: 1;

  @media (min-width: ${BREAKPOINTS.LARGESCREEN}) {
    font-size: 36px;
  }
`;

export const Change = styled('p')`
  display: flex;
  align-items: center;
  margin: 0;
  font-size: ${FONT_SIZE.SIZE_16};

  img {
    margin: -${SPACING.SCALE_1} ${SPACING.SCALE_1} 0;
  }

  @media (min-width: ${BREAKPOINTS.LARGESCREEN}) {
    font-size: ${FONT_SIZE.SIZE_19};
  }
`;
