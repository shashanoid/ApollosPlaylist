import React, { Component } from 'react';
import { connect } from 'react-redux';
import './sidebar.css';
import { getProfileDataAction } from '../../actions/profileActions';
import { setSidebarStatusAction } from '../../actions/navigationActions';
import { isBelowMediumBreakpoint, isBelowSmallBreakpoint } from '../../common/constants';
import SpotifyLogoutButton from '../sign-in/SpotifyLogoutButton';
import { Image } from 'react-bootstrap';
import autoBind from 'react-autobind';

class Sidebar extends Component {
  constructor(props) {
    super(props);

    autoBind(this);
  }

  componentDidMount() {
    let { getUserProfileData, setSidebarOpenStatus } = this.props;
    getUserProfileData();

    window.addEventListener('resize', () => {
      if (isBelowMediumBreakpoint()) {
        if (this.props.open) {
          setSidebarOpenStatus(false);
        }
      } else {
        if (!this.props.open) {
          setSidebarOpenStatus(true);
        }
      }
    });
  }

  handleSidebarClose() {
    this.props.setSidebarOpenStatus(false);
  }

  render() {
    let { user, open } = this.props;

    let sidebarWidth = 200;
    if (isBelowSmallBreakpoint()) {
      sidebarWidth = 160;
    }

    let image = user.images ? user.images[0] : null;

    return (
      <div>
        <div
          id="main-sidebar-ghost"
          style={{
            width: open && !isBelowMediumBreakpoint() ? `${sidebarWidth}px` : '0px',
          }}
        />
        <div
          id="main-sidebar"
          style={{
            marginLeft: open ? '0px' : `-${sidebarWidth + 20}px`,
            width: `${sidebarWidth}px`,
            overflowY: isBelowMediumBreakpoint() ? 'auto' : 'hidden',
          }}
        >
          <h1>Apollo's Playlist</h1>
          <div className="text-center">
            <h5> Logged in profile: </h5>

            <Image src={image ? image.url : '/img/placeholder-image.png'} fluid roundedCircle />
            <h6>{user.displayName}</h6>
            <p className="mb-0">Spotify Followers: {user.followers ? user.followers.total : null}</p>
            <p className="mb-0">Country: {user.country}</p>
          </div>
          <br />
          <br />
          <div>
            <SpotifyLogoutButton />
          </div>
        </div>
        <div
          id="main-sidebar-overlay"
          className={open && isBelowMediumBreakpoint() ? '' : 'd-none'}
          onClick={this.handleSidebarClose}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  ...state.nav.sidebar,
});

const mapDispatchToProps = dispatch => ({
  getUserProfileData: () => dispatch(getProfileDataAction()),
  setSidebarOpenStatus: open => dispatch(setSidebarStatusAction(open)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Sidebar);
