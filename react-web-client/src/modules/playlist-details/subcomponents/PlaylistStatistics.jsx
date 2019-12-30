import React, { Component } from 'react';
import autoBind from 'react-autobind';
import Loading from '../../../common/components/Loading';
import { ProgressBar, Row, Col } from 'react-bootstrap';
import { getPlaylistStatistics } from '../../../common/apiUtils';
import { deepCamelCaseKeys } from '../../../common/constants';

export default class PlaylistStatistics extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stats: null,
    };

    autoBind(this);
  }
  componentDidMount() {
    let { playlistId, userId } = this.props;

    // Fetch the playlist's statistics
    getPlaylistStatistics(playlistId, userId).then(response => {
      this.setState({ stats: deepCamelCaseKeys(response.data) });
    });
  }

  renderAttribute(attributeName) {
    let { stats } = this.state;

    return (
      <div className="m-3">
        {/* Capitalize the first letter of each key and display the name and percentage */}
        <p className="mb-0 attribute-name">{attributeName.charAt(0).toUpperCase() + attributeName.slice(1)}:</p>
        <ProgressBar
          srOnly
          max={stats[attributeName].max}
          min={stats[attributeName].min}
          now={stats[attributeName].value}
        />
      </div>
    );
  }

  render() {
    let { stats } = this.state;

    if (!stats) {
      return <Loading />;
    }

    return (
      <Row className="p-2">
        <Col xs={12} md={6} lg={4}>
          {this.renderAttribute('energy')}
        </Col>
        <Col xs={12} md={6} lg={4}>
          {this.renderAttribute('danceability')}
        </Col>
        <Col xs={12} md={6} lg={4}>
          {this.renderAttribute('valence')}
        </Col>
        <Col xs={12} md={6} lg={4}>
          {this.renderAttribute('instrumentalness')}
        </Col>
        <Col xs={12} md={6} lg={4}>
          {this.renderAttribute('acousticness')}
        </Col>
        <Col xs={12} md={6} lg={4}>
          {this.renderAttribute('liveness')}
        </Col>
        <Col xs={12} md={6} className="text-center" id="statistics-tempo-wrapper">
          <p className="mb-0 attribute-name">Average Tempo: </p>
          <p>{Math.round(stats.tempo.value)}BPM</p>
        </Col>
        <Col xs={12} md={6} className="text-center" id="statistics-loudness-wrapper">
          <p className="mb-0 attribute-name">Average Volume:</p>
          <p>{Math.round(stats.loudness.value)}db</p>
        </Col>
      </Row>
    );
  }
}
