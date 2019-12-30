import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { handleLogOut } from './_helper';

class SpotifyLogoutButton extends Component {
  constructor(props) {
    super(props);

    autoBind(this);
  }

  render() {
    return (
      <button className="btn btn-medium btn-danger" onClick={handleLogOut}>
        Log Out
      </button>
    );
  }
}

export default SpotifyLogoutButton;
