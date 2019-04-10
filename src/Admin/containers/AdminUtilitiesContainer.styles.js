import styled from 'styled-components'
import { MEDIA_QUERIES, GUTTER_HALF } from '@govuk-react/constants'

export const AdminUtilities = styled('div')`
  ${MEDIA_QUERIES.TABLET} {
    display: flex;
    flex-wrap: wrap;
    margin-left: -${GUTTER_HALF};
  }
`

export const AdminUtility = styled('div')`
  padding-bottom: ${GUTTER_HALF};
  ${MEDIA_QUERIES.TABLET} {
    width: 33.3333%;
    padding-left: ${GUTTER_HALF};
  }
`
