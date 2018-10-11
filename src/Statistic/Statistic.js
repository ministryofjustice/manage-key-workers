import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Heading, Value, Change, ChangeIcon } from './Statistic.styles';

class Statistic extends Component {
  constructor (props) {
    super(props);
  }

  renderChangeString (change) {
    if (!change || change.value === 0) return 'no change since last week';

    const { value, period } = change;
    const isPositiveValue = value > 0;

    return (
      <Fragment>
        {isPositiveValue && '+'}
        {value}
        {value !== 0 && <ChangeIcon isPositiveValue={isPositiveValue} />}
        {period && `since last ${period}`}
      </Fragment>
    );
  }

  render () {
    return (
      <Fragment>
        <Heading>{this.props.heading}</Heading>
        <Value>{this.props.value}</Value>
        <Change>{this.renderChangeString(this.props.change)}</Change>
      </Fragment>
    );
  }
}

Statistic.propTypes = {
  heading: PropTypes.string,
  value: PropTypes.string,
  change: PropTypes.shape({
    value: PropTypes.number,
    period: PropTypes.string
  })
};

Statistic.defaultProps = {
  heading: 'Statistic info',
  value: '-',
  change: {
    value: 0,
    period: 'week'
  }
};

export default Statistic;
