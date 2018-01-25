import React, {Component} from 'react';
import axios from 'axios';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
    }
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  componentDidMount() {
  }

  handleSubmit(event) {
    event.preventDefault();
    console.error("handle submit.." + event);
    axios.post('/login', {
      username: 'itag_user',
      password: 'password'
    }).then(data => {
      this.props.onLogin(data.headers['jwt'], this.props.history);
    })
      .catch(error => {
        this.setState({
          error: error.response.data || 'Something went wrong',
        })
      })
  }

  render() {
    return (
      <div>
        <h1 className="heading-large"> Login </h1>

        {this.state.error &&
        <div className="error-summary">
          <div className="error-message">
            <div> {this.state.error} </div>
          </div>
        </div>}
        <div>
          <form onSubmit={this.handleSubmit}>
            <label className="form-label" htmlFor="full-name-f1">Username</label>
            <input className="form-control" id="full-name-f1" type="text" name="username"/>
            <label className="form-label" htmlFor="password">Password</label>
            <input className="form-control" id="password" type="password" name="password"/>
            <button className="button" type="submit" value="Sign in" />
          </form>
        </div>
      </div>

    );
  }
}

export default Login;
