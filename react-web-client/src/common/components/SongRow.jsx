import React, { Component } from 'react';
import { Image } from 'react-bootstrap';

export default class SongRow extends Component {
  render() {
    let { song, showLinks } = this.props;

    if (!song) {
      return null;
    }

    return (
      <div className="song-row p-1">
        <div className="d-flex song-row-main">
          {song.album.images[0] && (
            <div className="image-border mr-2">
              <Image src={song.album.images[0].url} className="h-100" style={{ maxHeight: '3rem' }} />
            </div>
          )}

          <div>
            <h5 className="m-0 text-white">{song.title || song.name}</h5>
            <div className="d-flex" style={{ flexWrap: 'wrap' }}>
              {song.artists.map((artist, index) => {
                return (
                  <p className="m-0 pr-1 text-white" key={`song-row-${index}`}>
                    {artist.name}
                    {index !== song.artists.length - 1 ? ',' : ''}
                  </p>
                );
              })}
            </div>
          </div>
        </div>

        {showLinks && (
          <div className="song-row-links">
            {/* Not MVP */}
            {/* <div className="clickable m-2" onClick={handleSelectTrack}>
              <i className="fa fa-plus large-icon" />
            </div> */}
            <div className="clickable m-2">
              <a href={song.spotifyUrl} className="text-white">
                <i className="fa fa-spotify large-icon" />
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }
}
