import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import '../add-to-playlist-modal.css';

export default class PlaylistModalRow extends Component {
  render() {
    let { playlist, handleAddToPlaylist } = this.props;

    return (
      <div className="add-to-playlist-row p-1">
        <div>
          <p className="m-0">{playlist.title}</p>
        </div>
        <div>
          <Button size="sm" variant="outline-primary" onClick={handleAddToPlaylist(playlist.id)}>
            Add
          </Button>
        </div>
      </div>
    );
  }
}
