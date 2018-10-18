import React, { Fragment } from 'react';
import Statistic from '../../Statistic/Statistic';
import GridRow from '@govuk-react/grid-row';
import GridCol from '@govuk-react/grid-col';

const KeyworkerStats = ({ stats }) => (
  <GridRow>
    {stats.map(stat => (
      <Fragment key={stat.name}>
        <GridCol columnOneQuarter>
          <Statistic {...stat} />
        </GridCol>
      </Fragment>
    ))}
  </GridRow>
);

export default KeyworkerStats;
