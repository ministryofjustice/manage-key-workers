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
    axios.post('/login', {
      username: 'itag_user',
      password: 'password2'
    }).then(data => {
      this.props.onLogin(data.headers['jwt'], this.props.history);
    })
      .catch(error => {
        this.setState({
          error: error.response.data || 'Something went wrong',
        })
      })
    event.preventDefault();
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
          <form>
            <label class="form-label" for="full-name-f1">Username</label>
            <input class="form-control" id="full-name-f1" type="text" name="username"/>
            <label class="form-label" for="password">Password</label>
            <input class="form-control" id="password" type="password" name="password"/>
            <input type="submit" value="Sign in" onSubmit={this.handleSubmit}/>
          </form>
        </div>
      </div>

    );
  }
}

export default Login;
