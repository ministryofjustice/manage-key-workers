import styled, { css } from 'react-emotion';
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

  @media (min-width: ${BREAKPOINTS.LARGESCREEN}) {
    font-size: ${FONT_SIZE.SIZE_19};
  }
`;

export const ChangeIcon = styled('span')`
  display: inline-block;
  margin: 0 ${SPACING.SCALE_1};
  height: 20px;
  width: 20px;
  background-size: cover;
  background-repeat: no-repeat;

  ${props => props.isPositiveValue && css`background-image: url(/images/icon-positive-arrow.png);`};
  ${props =>
    !props.isPositiveValue && css`background-image: url(/images/icon-negative-arrow.png);`};
`;
