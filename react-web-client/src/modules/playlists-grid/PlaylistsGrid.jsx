import React, { Component } from 'react';
import './playlists.css';
import PlaylistCard from './subcomponents/PlaylistCard';
import autoBind from 'react-autobind';
import Loading from '../../common/components/Loading';
import Paginator from '../../common/components/Paginator';
import { Modal, Button } from 'react-bootstrap';
import { userPlaylistUnfollow } from '../../common/apiUtils';
import ErrorView from '../../common/components/ErrorView';

class PlaylistsGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageNumber: 0,
      showUnfollowModal: false,
      unfollowPlaylistId: null,
      userId: null,
    };

    autoBind(this);
  }

  componentDidMount() {
    let { loadPlaylistData } = this.props;
    let { pageNumber } = this.state;

    loadPlaylistData(pageNumber);
  }

  handlePageClick(pageNumber) {
    let { loadPlaylistData, playlists } = this.props;
    return () => {
      this.setState({ pageNumber });

      if (!playlists.items[pageNumber]) {
        loadPlaylistData(pageNumber);
      }
    };
  }

  handlePreviousClick() {
    let { pageNumber } = this.state;
    let { loadPlaylistData, playlists } = this.props;

    this.setState({ pageNumber: pageNumber - 1 });
    if (!playlists.items[pageNumber - 1]) {
      loadPlaylistData(pageNumber - 1);
    }
  }

  handleNextClick() {
    let { pageNumber } = this.state;
    let { loadPlaylistData, playlists } = this.props;

    this.setState({ pageNumber: pageNumber + 1 });
    if (!playlists.items[pageNumber + 1]) {
      loadPlaylistData(pageNumber + 1);
    }
  }

  handleUnfollow(playlistId, userId) {
    return e => {
      this.setState({
        showUnfollowModal: true,
        unfollowPlaylistId: playlistId,
        userId,
      });
    };
  }

  handleCloseModal() {
    this.setState({
      showUnfollowModal: false,
    });
  }

  unfollowPlaylistHandler() {
    let { userId, unfollowPlaylistId } = this.state;
    userPlaylistUnfollow(userId, unfollowPlaylistId).then(() => {
      this.handleCloseModal();
      window.location.reload();
    });
  }

  renderUnfollowModal() {
    return (
      <Modal show={this.state.showUnfollowModal} onHide={this.handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure you want to unfollow this playlist?</Modal.Title>
        </Modal.Header>
        <Modal.Body>By unfollowing this playlist you will no longer see it under your playlists</Modal.Body>
        <Modal.Footer>
          <Button size="md" variant="outline-primary" className="ml-1" onClick={this.handleCloseModal}>
            Close
          </Button>
          <Button size="md" variant="outline-danger" className="ml-1" onClick={this.unfollowPlaylistHandler}>
            Unfollow
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    let { playlists } = this.props;
    let { pageNumber } = this.state;

    if (playlists.loading) {
      return <Loading />;
    }

    if (playlists.status) {
      return <ErrorView status={playlists.status} errorMessage={playlists.errorMessage} />;
    }

    return (
      <div id="playlists-grid" className="">
        {this.renderUnfollowModal()}
        <div className="row">
          {playlists.items[pageNumber].map((playlist, index) => {
            return <PlaylistCard playlist={playlist} key={index} index={index} handleUnfollow={this.handleUnfollow} />;
          })}
        </div>
        <br />
        <div className="row justify-center">
          {Math.ceil(playlists.total / 12) > 1 && (
            <Paginator
              numberOfPages={Math.ceil(playlists.total / 12)}
              currentPage={pageNumber}
              handlePageClick={this.handlePageClick}
              handleNext={this.handleNextClick}
              handlePrevious={this.handlePreviousClick}
            />
          )}
        </div>
      </div>
    );
  }
}

export default PlaylistsGrid;
