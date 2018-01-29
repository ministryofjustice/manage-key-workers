import React, { Component } from 'react';
import axios from 'axios';

class Login extends Component {
  constructor () {
    super();
    this.state = {
      error: null,
      username: '',
      password: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount () {
  }

  async handleSubmit (event) {
    event.preventDefault();

    try {
      const data = await axios.post('/login', {
        username: this.state.username,
        password: this.state.password
      });
      this.props.onLogin(data.headers['jwt'], this.props.history);
    } catch (error) {
      this.setState({
        error: (error.response && error.response.data) || 'Something went wrong'
      });
    }
  }

  handleInputChange (event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render () {
    return (
      <div>
        <h1 className="heading-large"> Login </h1>

        {this.state.error &&
        <div className="error-summary">
          <div className="error-message">
            <div> {this.state.error} </div>
          </div>
        </div>}
        <div className={"pure-u-md-8-12"}>
          <form onSubmit={this.handleSubmit}>
            <div className={"form-group"}>
              <label className="form-label" htmlFor="username">Username</label>
              <input className="form-control" value={this.state.username} id="username" type="text" name="username"
                onChange={this.handleInputChange}/>
            </div>
            <div className={"form-group"}>
              <label className="form-label" htmlFor="password">Password</label>
              <input className="form-control" value={this.state.password} id="password" type="password" name="password"
                onChange={this.handleInputChange}/>
            </div>
            <button className="button pure-u-md-2-12" type="submit">Sign in</button>
          </form>
        </div>
      </div>

    );
  }
}

export default Login;
