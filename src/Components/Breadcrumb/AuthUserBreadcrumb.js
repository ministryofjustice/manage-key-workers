import { connect } from 'react-redux'

const AuthUserBreadcrumb = ({ contextUser, match }) => {
  if (contextUser && contextUser.username) {
    return `${contextUser.firstName} ${contextUser.lastName}`
  }

  return match.params.username
}

const mapStateToProps = state => ({
  contextUser: state.maintainAuthUsers.contextUser,
})

export default connect(mapStateToProps)(AuthUserBreadcrumb)
