import React, { Component } from 'react';
import { ScaleLoader } from 'react-spinners';

export default class Loading extends Component {
  render() {
    return (
      <div className="center-content h-100">
        <ScaleLoader color="royalblue" />
      </div>
    );
  }
}
