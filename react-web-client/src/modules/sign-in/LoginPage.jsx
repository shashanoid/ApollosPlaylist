import React, { Component } from 'react';
import SpotifyLoginButton from './SpotifyLoginButton';
import './sign-in.css';

class LoginPage extends Component {
  render() {
    return (
      <div id="logged-out-wrapper">
        <div className="w-50 p-3 custom-card text-center">
          <h3 id="login-text-header"> Login to Apollo's Playlist</h3>
          <hr />
          <SpotifyLoginButton />
        </div>
      </div>
    );
  }
}

export default LoginPage;
