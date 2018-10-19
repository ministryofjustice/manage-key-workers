import React, { Fragment } from 'react';
import GridRow from '@govuk-react/grid-row';
import GridCol from '@govuk-react/grid-col';
import Statistic from '../../Statistic/Statistic';

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
