import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image } from 'react-bootstrap';

class TrackDetails extends Component {
  constructor(props) {
    super(props);
  }

  renderTrackDetails() {
    console.log('Working');
    console.log(this.state.user);
    return <div></div>;
  }

  render() {
    return this.renderTrackDetails();
  }
}

const mapStateToProps = state => ({
  currentUser: state.user,
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrackDetails);
