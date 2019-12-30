import React, { Component } from 'react';
import SpotifyLogin from 'react-spotify-login';
import { spotifyScopes, setCookie } from '../../common/constants';
import autoBind from 'react-autobind';
import { redirectURI, clientID } from './constants';
import './sign-in.css';

class SpotifyLoginButton extends Component {
  constructor(props) {
    super(props);

    autoBind(this);
  }

  async handleAccessToken(data) {
    let token = data.access_token;

    // Set the token in cookies, we want to make sure that this happens first so we await it.
    await setCookie('spotifyAccessToken', token, 1);
    document.location.reload();
  }

  render() {
    return (
      <SpotifyLogin
        clientId={clientID}
        redirectUri={redirectURI}
        onSuccess={this.handleAccessToken}
        onFailure={error => console.log(error)}
        scope={spotifyScopes}
        className="btn btn-md btn-primary"
      />
    );
  }
}

export default SpotifyLoginButton;
