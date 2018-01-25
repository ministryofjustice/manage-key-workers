import React, { Component } from 'react';
import axios from 'axios';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
    }
  }
  componentDidMount(){
    console.error('mounted');
     axios.post('/login', {
       username: 'username',
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
    console.error('render');
    return (
      <div> 
        <h1 className="heading-large"> Login  </h1>   

        {this.state && this.state.error &&     
        <div className="error-summary">
            <div className="error-message">
                 <div>{this.state && this.state.error}</div>
             </div>
         </div> }
      </div>
    );
  }
}

export default Login;
