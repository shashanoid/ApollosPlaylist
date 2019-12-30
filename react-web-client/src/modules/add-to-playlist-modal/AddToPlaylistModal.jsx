import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import swal from 'sweetalert2';
import autoBind from 'react-autobind';
import SongRow from '../../common/components/SongRow';
import Loading from '../../common/components/Loading';
import { getUserEditablePlaylists, addTracksToPlaylist } from '../../common/apiUtils';
import PlaylistModalRow from './subcomponents/PlaylistModalRow';
import { deepCamelCaseKeys } from '../../common/constants';

class AddToPlaylistModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editablePlaylists: [],
    };

    autoBind(this);
  }

  handleAddToPlaylist(playlistId) {
    let { currentUser, song } = this.props;

    return () => {
      addTracksToPlaylist(currentUser.id, playlistId, [song.id]);
      swal.fire('Success', 'The song was added to the playlist.', 'success');
      this.props.onClose();
    };
  }

  componentWillMount() {
    getUserEditablePlaylists().then(response => {
      this.setState({
        editablePlaylists: deepCamelCaseKeys(response.data),
      });
    });
  }

  render() {
    let { isOpen, song, onClose } = this.props;
    let { editablePlaylists } = this.state;

    if (!isOpen || !song) {
      return null;
    }

    return (
      <Modal centered show={true} onHide={onClose}>
        <Modal.Header closeButton>
          <h5 className="m-0">Add to playlist</h5>
        </Modal.Header>

        <Modal.Body>
          <div className="p-2 w-100">
            <SongRow song={song} showLinks={false} />
          </div>
          <hr style={{ width: '95%' }} />
          <div style={{ maxHeight: '40vh', overflow: 'auto' }}>
            {editablePlaylists.length === 0 ? (
              <Loading />
            ) : (
              editablePlaylists.map((playlist, index) => {
                return (
                  <div key={`playlist-modal-row-${index}`}>
                    <PlaylistModalRow
                      playlist={playlist}
                      index={index}
                      handleAddToPlaylist={this.handleAddToPlaylist}
                    />
                    <hr style={{ width: '95%' }} className="m-2" />
                  </div>
                );
              })
            )}
          </div>
        </Modal.Body>
      </Modal>
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
)(AddToPlaylistModal);
