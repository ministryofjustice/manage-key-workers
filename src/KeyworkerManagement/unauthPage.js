import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Page from '../Components/Page'

class UnauthPage extends Component {
  componentDidMount() {
    const { dispatchLoaded } = this.props
    dispatchLoaded(true)
  }

  render() {
    return (
      <Page title="Unauthorised Access">
        <div className="pure-g">
          <div className="pure-u-md-8-12 padding-bottom-large">
            <div className="pure-u-md-6-12">
              <div>You are not authorised to use this application</div>
            </div>
          </div>
        </div>
      </Page>
    )
  }
}

UnauthPage.propTypes = {
  dispatchLoaded: PropTypes.func.isRequired,
}

export default UnauthPage
