import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import PlaylistsGrid from '../playlists-grid/PlaylistsGrid';
import { getPersonalPlaylistDataAction, clearPlaylistDataAction } from '../../actions/playlistActions';

class PlaylistsView extends PureComponent {
  constructor(props) {
    super(props);

    autoBind(this);
  }

  componentWillUnmount() {
    this.props.clearPlaylistData();
  }

  render() {
    let { playlists, loadPersonalPlaylistData, clearPlaylistData } = this.props;

    return (
      <PlaylistsGrid
        playlists={playlists}
        loadPlaylistData={loadPersonalPlaylistData}
        clearPlaylistData={clearPlaylistData}
      />
    );
  }
}

const mapStateToProps = state => ({
  playlists: state.playlists,
});

const mapDispatchToProps = dispatch => ({
  loadPersonalPlaylistData: pageNumber => dispatch(getPersonalPlaylistDataAction(pageNumber)),
  clearPlaylistData: () => dispatch(clearPlaylistDataAction()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlaylistsView);
