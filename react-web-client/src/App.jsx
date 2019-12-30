import React, { Component } from 'react';
import './index.css';
import { connect } from 'react-redux';
import { HashRouter, Route } from 'react-router-dom';
import Sidebar from './modules/sidebar/Sidebar';
import LoginPage from './modules/sign-in/LoginPage';
import MyPlaylists from './modules/my-playlists/MyPlaylists';
import Navbar from './modules/navbar/Navbar';
import PlaylistDetails from './modules/playlist-details/PlaylistDetails';
import CreatePlaylist from './modules/create-playlist/CreatePlaylist';
import UserTopTracks from './modules/user-top-tracks/UserTopTracks';
import TrackDetails from './modules/user-top-tracks/subcomponents/TrackDetails';
import { pageChangeAction } from './actions/navigationActions';
import { getCookie } from './common/constants';
class App extends Component {
  render() {
    let loggedIn = false;
    let token = getCookie('spotifyAccessToken');

    if (token !== '') {
      loggedIn = true;
    }

    let currentPageUpdate = () => {
      let page = window.location.hash.split('/')[1] ? window.location.hash.split('/')[1] : '';
      this.props.handlePageChange(page);
    };

    window.addEventListener('hashchange', currentPageUpdate);
    window.addEventListener('load', currentPageUpdate);

    return (
      <HashRouter>
        <div className="d-flex" id="app-wrapper">
          {loggedIn ? (
            <div className="w-100 d-flex" id="logged-in-wrapper">
              <Sidebar />
              <div id="playlists-view-wrapper">
                <Navbar />
                <Route path="/(|my-playlists)/" component={MyPlaylists} />
                <Route path="/create-playlist" component={CreatePlaylist} />
                <Route path="/user/:userId/playlist/:playlistId" component={PlaylistDetails} />
                <Route path="/user/:userId/track/:songId" component={TrackDetails} />
                <Route path="/top_tracks" component={UserTopTracks} />
              </div>
            </div>
          ) : (
            <LoginPage />
          )}
        </div>
      </HashRouter>
    );
  }
}

const mapStateToProps = state => ({
  ...state,
});

const mapDispatchToProps = dispatch => ({
  handlePageChange: newPage => dispatch(pageChangeAction(newPage)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
