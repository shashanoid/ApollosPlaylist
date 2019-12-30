import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { getPersonalPlaylistDataAction } from '../../actions/playlistActions';
import { setSidebarStatusAction } from '../../actions/navigationActions';
import { isBelowMediumBreakpoint } from '../../common/constants';
import { Link } from 'react-router-dom';

class Navbar extends Component {
  constructor(props) {
    super(props);

    autoBind(this);
  }

  handleSidebarMenuClick() {
    let {
      nav: {
        sidebar: { open },
      },
      setSidebarOpenStatus,
    } = this.props;

    if (open) {
      setSidebarOpenStatus(false);
    } else {
      setSidebarOpenStatus(true);
    }
  }

  render() {
    let {
      nav: { currentPage },
    } = this.props;

    return (
      <div id="playlists-navbar-wrapper" className="playlists-navbar-dimensions">
        <div id="playlists-navbar" className="playlists-navbar-dimensions">
          {isBelowMediumBreakpoint() && (
            <div className="p-1 ml-2 mr-2" onClick={this.handleSidebarMenuClick}>
              <i className="fa fa-2x fa-bars color-white" />
            </div>
          )}

          <Link to="/my-playlists">
            <h6
              id="personal-playlists-button"
              className={currentPage === 'my-playlists' ? 'nav-button text-white underlined' : 'nav-button text-white'}
            >
              My Playlists
            </h6>
          </Link>
          <Link to="/create-playlist">
            <h6
              id="create-playlists-button"
              className={
                currentPage === 'create-playlist' ? 'nav-button text-white underlined' : 'nav-button text-white'
              }
            >
              Create Playlist
            </h6>
          </Link>

          <Link to="/top_tracks">
            <h6
              id="top-tracks-button"
              className={
                currentPage === 'top_tracks' ? 'nav-button text-white underlined' : 'nav-button text-white'
              }
            >
              Top
            </h6>
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  playlists: state.playlists,
  nav: state.nav,
});

const mapDispatchToProps = dispatch => ({
  loadPersonalPlaylistData: pageNumber => dispatch(getPersonalPlaylistDataAction(0)),
  setSidebarOpenStatus: open => dispatch(setSidebarStatusAction(open)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Navbar);
