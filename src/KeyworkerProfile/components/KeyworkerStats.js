import React from 'react';
import Statistic from '../../Statistic/Statistic';
import GridRow from '@govuk-react/grid-row';
import GridCol from '@govuk-react/grid-col';

// Will become functional once we have real data from the API
const KeyworkerStats = () => (
  <GridRow>
    <GridCol columnOneQuarter>
      <Statistic />
    </GridCol>
    <GridCol columnOneQuarter>
      <Statistic />
    </GridCol>
    <GridCol columnOneQuarter>
      <Statistic />
    </GridCol>
    <GridCol columnOneQuarter>
      <Statistic />
    </GridCol>
  </GridRow>
);

export default KeyworkerStats;
