import React, { Component } from 'react';
import { Image } from 'react-bootstrap';
import '../user-top-tracks.css';
import { Link } from 'react-router-dom';
import { TrackDetails } from '../subcomponents/TrackDetails';

class Track extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playing: false,
    };
  }

  // [TODO] -- pause previous song when some other song is played
  // currently it overlaps the previous song
  handleTrackPlayback(trackPreviewURL) {
    let { playing } = this.state;

    if (playing) {
      this.player.pause();
      this.setState({ playing: false });
    } else {
      this.player.src = trackPreviewURL;
      this.player.play();
      this.setState({ playing: true });
    }
  }

  renderTrack() {
    let { trackName, trackArtists, trackImage, trackPreviewURL } = this.props;
    let { playing } = this.state;

    return (
      <div className="track-item">
        <div className="track-info-container">
          <div className="track-image-container">
            <div className="track-image">
              <Image id="track-image" src={trackImage} />
            </div>
            <div id="player-container">
              <div
                onClick={() => this.handleTrackPlayback(trackPreviewURL)}
                id="play-pause"
                class={playing ? 'pause' : 'play'}
              >
                Play
              </div>
              <audio ref={ref => (this.player = ref)} />
            </div>
          </div>
        </div>
        {/* <Link to={`user/${playlist.authorSpotifyId}/track/${playlist.id}`} style={{ textDecoration: 'none' }}> */}
        <div className="track-info">
          <div id="track-title">{trackName}</div>
          <div id="track-artist">{trackArtists}</div>
        </div>
        {/* </Link> */}

        <div className="mixer">
          <Image id="mixer-icon" src="https://www.embecosm.com/app/uploads/icon-machine.png" />
        </div>
      </div>
    );
  }

  render() {
    return this.renderTrack();
  }
}

export default Track;
