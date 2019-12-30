import React, { Component } from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import autoBind from 'react-autobind';
import { getDetailedPlaylistData } from '../../common/apiUtils';
import SongTable from './subcomponents/SongTable';
import Loading from '../../common/components/Loading';
import { Link } from 'react-router-dom';
import PlaylistStatistics from './subcomponents/PlaylistStatistics';
import AddToPlaylistModal from '../add-to-playlist-modal/AddToPlaylistModal';
import { deepCamelCaseKeys } from '../../common/constants';
import ErrorView from '../../common/components/ErrorView';

class PlaylistDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playlist: null,
      selectedSong: null,
      editPlaylistModalOpen: false,
      errorStatus: null,
      errorMessage: null,
    };

    autoBind(this);
  }

  handleSelectTrack(index) {
    return () => {
      this.setState({
        selectedSong: this.state.playlist.tracks[index],
        editPlaylistModalOpen: true,
      });
    };
  }

  handleCloseEditPlaylistModal() {
    this.setState({ editPlaylistModalOpen: false });
  }

  componentDidMount() {
    let splitURL = window.location.hash.split('/');
    let userId = splitURL[2];
    let playlistId = splitURL[4];

    // Get the detailes playlist data.
    getDetailedPlaylistData(playlistId, userId)
      .then(response => {
        this.setState({
          playlist: deepCamelCaseKeys(response.data),
          loading: false,
        });
      })
      .catch(error => {
        this.setState({
          errorStatus: error.request.status,
          errorMessage: JSON.parse(error.request.responseText).message,
          loading: false,
        });
      });
  }

  render() {
    let { playlist, selectedSong, editPlaylistModalOpen, errorStatus, errorMessage } = this.state;

    if (errorStatus) {
      return <ErrorView status={errorStatus} errorMessage={errorMessage} />;
    }

    if (!playlist) {
      return <Loading />;
    }

    return (
      <Row id="playlist-details-page" className="text-white">
        <Col xs={12}>
          <div className="p-3" id="playlist-details-header">
            <h4 className="ml-12 p-3" id="playlist-details-playlist-title">{playlist.title}</h4>

            <div className="w-100 ml-12 p-3 " id="playlist-details-album-artwork">
              <div className="image-border">{playlist.images[0] && <Image src={playlist.images[0].url} fluid />}</div>
            </div>

            <div className="ml-12 p-3" id="playlist-details-header-description">
              {playlist.description ? playlist.description : 'No description provided...'}
            </div>

            <div className="ml-xl-12 p-3">
              <Link to={`/user/${playlist.ownerSpotifyId}`} className="text-white d-flex">
                <i className="fa fa fa-user m-1" />
                <p className="m-0">{playlist.author}</p>
              </Link>
            </div>
            <div className="ml-xl-12 p-3">
              {/* <i className="fa fa-2x fa-heart m-1" /> */}
              <div className="clickable">
                <a className="text-white" href={playlist.spotifyUrl}>
                  <i className="fa fa-2x fa-spotify m-1" />
                </a>
              </div>
            </div>
          </div>

          <div className="p-3" id="playlist-details-metadata">
            <h4 className="m-2"> Playlist Statistics: </h4>
            <div className="custom-card p-3">
              <PlaylistStatistics
                playlistId={window.location.hash.split('/')[4]}
                userId={window.location.hash.split('/')[2]}
              />
            </div>
          </div>

          <div className="p-3" id="playlist-details-metadata">
            <div className="song-row">
              <h4 className="m-2"> Track List: </h4>
              <p className="mt-3 mr-2 ml-2 mb-0">{playlist.tracks.length} tracks</p>
            </div>

            <div className="custom-card p-3">
              <SongTable tracks={playlist.tracks} handleSongSelection={this.handleSelectTrack} />
            </div>
          </div>
        </Col>
        <AddToPlaylistModal
          isOpen={editPlaylistModalOpen}
          song={selectedSong}
          onClose={this.handleCloseEditPlaylistModal}
        />
      </Row>
    );
  }
}

export default PlaylistDetails;
