import React, { Component } from 'react';
import autoBind from 'react-autobind';
import Track from './subcomponents/Track';
import Loading from '../../common/components/Loading';
import ErrorView from '../../common/components/ErrorView';
import { getUserTopTracks } from '../../common/apiUtils';
import './user-top-tracks.css';

class UserTopTracks extends Component {
  constructor(props) {
    super(props);

    autoBind(this);

    this.state = {
      topTracks: null,
      error: false,
    };
  }

  renderUserTopTracks() {
    let { topTracks, error, errorStatus, errorMessage } = this.state;

    if (error) {
      return <ErrorView status={errorStatus} errorMessage={errorMessage} />;
    }

    if (!topTracks) {
      return <Loading />;
    }

    return (
      <div id="user-top-tracks-container">
        <div className="custom-card m-3 p-3">
          <div className="track-container">
            {topTracks.map((track, index) => {
              return (
                <div>
                  <Track trackName={track.name} trackArtists={track.artists} trackImage={track.image} trackPreviewURL={track.preview_url} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    getUserTopTracks()
      .then(response => {
        this.setState({ topTracks: response.data });
      })
      .catch(error => {
        this.setState({
          errorStatus: error.request.status,
          errorMessage: JSON.parse(error.request.responseText).message,
          error: true,
        });
      });
  }

  render() {
    return this.renderUserTopTracks();
  }
}

export default UserTopTracks;
