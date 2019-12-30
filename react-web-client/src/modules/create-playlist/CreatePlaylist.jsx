import React, { Component } from 'react';
import { Button, Modal, Form, Col } from 'react-bootstrap';
import autoBind from 'react-autobind';
import { TRACK_ATTRIBUTES } from './constants';
import Loading from '../../common/components/Loading';
import { getTracksFromAttributes, createUserPlaylistWithTracks } from '../../common/apiUtils';
import { _getTempoRange } from './helpers';
import { connect } from 'react-redux';
import SongTable from '../playlist-details/subcomponents/SongTable';
import './create-playlist.css';

class CreatePlaylist extends Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      showCreatePlaylistModal: false,
      playlistName: '',
      loading: false,
      tracks: null,
      energy: 0.5,
      danceability: 0.5,
      acousticness: 0.5,
      tempo: 160,
    };
  }

  handleSliderChange(event) {
    let { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleGetTracks() {
    let { energy, danceability, tempo, acousticness } = this.state;
    this.setState({ loading: true });

    let attributes = {
      energy,
      danceability,
      acousticness,
      tempo: _getTempoRange(tempo),
    };

    getTracksFromAttributes(attributes).then(response => {
      this.setState({
        loading: false,
        tracks: response.data,
      });
    });
  }

  handleTextInput(event) {
    this.setState({ playlistName: event.target.value });
  }

  handleCreatePlaylistModal() {
    this.setState({ showCreatePlaylistModal: true });
  }

  handleCloseModal() {
    this.setState({
      showCreatePlaylistModal: false,
    });
  }

  createPlaylistHandler() {
    this.setState({ loading: true });
    createUserPlaylistWithTracks(this.props.currentUser.id, this.state.playlistName, this.state.tracks).then(
      response => {
        window.location = '/#/my-playlists';
      },
    );
  }

  renderCreatePlaylistModal() {
    return (
      <Modal show={this.state.showCreatePlaylistModal} onHide={this.handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Playlist</Modal.Title>
        </Modal.Header>
        <Modal.Body>What do you want to name this playlist?</Modal.Body>
        <Form.Control
          type="text"
          name="Playlist Name"
          className="m-3 p-3"
          style={{ width: '90%' }}
          value={this.state.playlistName}
          onChange={this.handleTextInput}
        />
        <Modal.Footer>
          <Button size="md" variant="outline-primary" className="ml-1" onClick={this.handleCloseModal}>
            Close
          </Button>
          <Button size="md" variant="outline-primary" className="ml-1" onClick={this.createPlaylistHandler}>
            Create Playlist
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }

    if (this.state.tracks !== null) {
      return (
        <div className="create-playlist-container">
          {this.renderCreatePlaylistModal()}
          <div className="custom-card m-3 p-3">
            <Col xs={12}>
              <SongTable tracks={this.state.tracks} handleSongSelection={() => console.log('testing')} />
            </Col>
          </div>
          <div className="center-content m-3 p-3">
            <Button size="lg" variant="outline-primary" onClick={this.handleCreatePlaylistModal}>
              Create Playlist
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="create-playlist-container">
        <div className="custom-card m-3 p-3">
          <h4 className="ml-12 center-content" id="create-playlist-question">What attributes would you want your playlist to have?</h4>
        </div>
        <div className="custom-card m-3 p-3 energy-container">
          <h4 className="ml-12 center-content" id="create-playlist-question">Energy</h4>
          <br />
          <input
            name={TRACK_ATTRIBUTES.ENERGY}
            className="custom-range"
            type="range"
            min={0}
            max={1}
            step={0.01}
            defaultValue={0.5}
            onChange={this.handleSliderChange}
          />
        </div>

        <div className="custom-card m-3 p-3 danceability-container">
          <h4 className="ml-12 center-content" id="create-playlist-question">Danceability</h4>
          <br />
          <input
            name={TRACK_ATTRIBUTES.DANCEABILITY}
            className="custom-range"
            type="range"
            min={0}
            max={1}
            step={0.01}
            defaultValue={0.5}
            onChange={this.handleSliderChange}
          />
        </div>

        <div className="custom-card m-3 p-3 acousticness-container">
          <h4 className="ml-12 center-content" id="create-playlist-question">Acousticness</h4>
          <br />
          <input
            name={TRACK_ATTRIBUTES.ACOUSTICNESS}
            className="custom-range"
            type="range"
            min={0}
            max={1}
            step={0.01}
            defaultValue={0.5}
            onChange={this.handleSliderChange}
          />
        </div>

        <div className="custom-card m-3 p-3 tempo-container">
          <h4 className="ml-12 center-content" id="create-playlist-question">Tempo</h4>
          <br />
          <input
            name={TRACK_ATTRIBUTES.TEMPO}
            className="custom-range"
            type="range"
            min={40}
            max={225}
            step={1}
            defaultValue={132.5}
            onChange={this.handleSliderChange}
          />
        </div>

        <div className="m-3 p-3 center-content get-tracks-container">
          <Button size="lg" variant="outline-primary" onClick={this.handleGetTracks}>
            Get Tracks
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.user,
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreatePlaylist);
