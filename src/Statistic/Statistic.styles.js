import styled, { css } from 'styled-components';

export const Heading = styled.h2`
  margin: 0 0 15px;
  font-size: 24px;
`;

export const Value = styled.strong`
  display: block;
  margin: 0 0 15px;
  font-size: 48px;
  font-weight: bold;
  line-height: 1;
`;

export const Change = styled.p`
  display: flex;
  align-items: center;
  margin: 0;
`;

export const ChangeIcon = styled.span`
  display: inline-block;
  margin: 0 5px;
  height: 20px;
  width: 20px;
  background-size: cover;
  background-repeat: no-repeat;

  ${props => props.isPositiveValue && css`background-image: url(/images/icon-positive-arrow.png);`};
  ${props =>
    !props.isPositiveValue && css`background-image: url(/images/icon-negative-arrow.png);`};
`;
