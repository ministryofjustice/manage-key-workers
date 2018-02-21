import React, { Component } from 'react';
import axiosWrapper from './backendWrapper';
import PropTypes from 'prop-types';
import { setLoginDetails, setLoginInputChange, setError } from './actions';
import { connect } from 'react-redux';

class Login extends Component {
  constructor () {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  async handleSubmit (event) {
    event.preventDefault();
    if (this.props.username) {
      try {
        const data = await axiosWrapper.post('/login',
          {
            username: this.props.username.toUpperCase(),
            password: this.props.password
          });
        await this.props.onLogin(data.headers['jwt'], data, this.props.history);
      } catch (error) {
        this.props.setErrorDispatch((error.response && error.response.data) || 'Something went wrong: ' + error.message);
      }
    }
  }

  handleInputChange (event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.props.loginInputChangeDispatch(name, value);
  }

  render () {
    return (
      <div>
        <h1 className="heading-large"> Login </h1>

        {this.props.error &&
        <div className="error-summary">
          <div className="error-message">
            <div> {this.props.error} </div>
          </div>
        </div>}
        <div className={"pure-u-md-8-12"}>
          <form onSubmit={this.handleSubmit}>
            <div className={"form-group"}>
              <label className="form-label" htmlFor="username">Username</label>
              <input className="form-control" value={this.props.username} id="username" type="text" name="username"
                onChange={this.handleInputChange}/>
            </div>
            <div className={"form-group"}>
              <label className="form-label" htmlFor="password">Password</label>
              <input className="form-control" value={this.props.password} id="password" type="password" name="password"
                onChange={this.handleInputChange}/>
            </div>
            <button className="button pure-u-md-2-12" type="submit">Sign in</button>
          </form>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.object,
  onLogin: PropTypes.func.isRequired,
  username: PropTypes.string,
  password: PropTypes.string,
  error: PropTypes.string,
  fromDate: PropTypes.string,
  setErrorDispatch: PropTypes.func.isRequired,
  loginInputChangeDispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    username: state.app.username,
    password: state.app.password,
    error: state.app.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loginDetailsDispatch: (jwt, user) => {
      dispatch(setLoginDetails(jwt, user));
    },
    loginInputChangeDispatch: (fieldName, value) => {
      dispatch(setLoginInputChange(fieldName, value));
    },
    setErrorDispatch: (error) => {
      dispatch(setError(error));
    }
  };
};

const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(Login);

export {
  Login,
  LoginContainer
};
export default Login;
