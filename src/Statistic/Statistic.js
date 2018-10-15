import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Container, Heading, Value, Change } from './Statistic.styles';

class Statistic extends Component {
  constructor (props) {
    super(props);
  }

  renderChangeString = () => {
    const { change } = this.props;
    if (!change || change.value === 0) return `no change since last ${change.period}`;

    const { value, period } = change;
    const changeType = value > 0 ? 'increase' : 'decrease';

    return (
      <Fragment>
        {changeType === 'increase' && '+'}
        {value}
        {value !== 0 && (
          <img src={`/images/icon-${changeType}.png`} alt={changeType} height={20} width={20} />
        )}
        {period && `since last ${period}`}
      </Fragment>
    );
  };

  render () {
    return (
      <Container>
        <Heading>{this.props.heading}</Heading>
        <Value>{this.props.value}</Value>
        <Change>{this.renderChangeString()}</Change>
      </Container>
    );
  }
}

Statistic.propTypes = {
  heading: PropTypes.string,
  value: PropTypes.number,
  change: PropTypes.shape({
    value: PropTypes.number,
    period: PropTypes.string
  })
};

Statistic.defaultProps = {
  heading: 'Unknown statistic',
  value: 0,
  change: {
    value: 0,
    period: 'week'
  }
};

export default Statistic;
