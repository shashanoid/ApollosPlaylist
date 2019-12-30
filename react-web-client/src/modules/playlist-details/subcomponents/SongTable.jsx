import React, { PureComponent } from 'react';
import SongRow from '../../../common/components/SongRow';

export default class SongTable extends PureComponent {
  render() {
    let { tracks, handleSongSelection } = this.props;
    return (
      <div>
        {tracks.map((track, index) => {
          return (
            <div key={`song-table-row-${index}`}>
              <SongRow song={track} handleSelectTrack={handleSongSelection(index)} showLinks={true} />
              {index !== tracks.length - 1 && <hr style={{ width: '95%' }} />}
            </div>
          );
        })}
      </div>
    );
  }
}
