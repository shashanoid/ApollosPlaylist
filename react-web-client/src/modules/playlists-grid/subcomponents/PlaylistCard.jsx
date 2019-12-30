import React, { Component } from 'react';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default class PlaylistCard extends Component {
  render() {
    let { playlist } = this.props;

    return (
      <div className="col-xl-4 col-md-6 col-sm-12 p-3 center-content">
        <Link to={`user/${playlist.authorSpotifyId}/playlist/${playlist.id}`} style={{ textDecoration: 'none' }}>
          <div className="custom-card p-3 playlist-grid-item">
            <div>
              <div className="w-100 p-1 d-flex">
                <div className="image-border h-50">
                  {playlist.images[0] && <Image src={playlist.images[0].url} fluid />}
                </div>
              </div>
              <hr />
              <div className="w-100 p-1 text-left">
                <h4 className="mt-1" id="playlist-title">
                  {playlist.title}
                </h4>
                <p className="m-0" id="playlist-author">
                  {playlist.author}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }
}
