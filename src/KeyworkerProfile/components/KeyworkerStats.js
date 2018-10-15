import React, { Fragment } from 'react';
import Statistic from '../../Statistic/Statistic';
import GridRow from '@govuk-react/grid-row';
import GridCol from '@govuk-react/grid-col';

// Temporary dummy data for UI testing purposes and will be removed once we have real data from the API
const statsData = [
  {
    name: 'projectedSessions',
    heading: 'Number of projected key worker sessions last month',
    value: 24
  },
  {
    name: 'recordedSessions',
    heading: 'Number of recorded key worker sessions last month',
    value: 22,
    change: {
      value: 22,
      period: 'month'
    }
  },
  {
    name: 'complianceRate',
    heading: 'Compliance rate',
    value: 91.6,
    change: {
      value: -2.3,
      period: 'month'
    }
  },
  {
    name: 'caseNotesWritten',
    heading: 'Total number of key worker case notes written',
    value: 56,
    change: {
      value: 7,
      period: 'month'
    }
  }
];

const KeyworkerStats = () => (
  <GridRow>
    {statsData.map(stat => (
      <Fragment key={stat.name}>
        <GridCol columnOneQuarter>
          <Statistic {...stat} />
        </GridCol>
      </Fragment>
    ))}
  </GridRow>
);

export default KeyworkerStats;
