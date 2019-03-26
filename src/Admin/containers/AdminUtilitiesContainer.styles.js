import styled from 'styled-components'
import { BREAKPOINTS } from '@govuk-react/constants'

export const AdminUtilities = styled('div')`
  display: flex;
  flex-wrap: wrap;
`

export const AdminUtility = styled('div')`
  padding-bottom: 15px;
  @media (min-width: ${BREAKPOINTS.TABLET}) {
    width: 33.3333%;
    padding-left: 10px;
  }
`
