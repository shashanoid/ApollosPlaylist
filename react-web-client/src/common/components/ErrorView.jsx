import React, { PureComponent } from 'react';
import { Button } from 'react-bootstrap';
import autoBind from 'react-autobind';
import { handleLogOut } from '../../modules/sign-in/_helper';
import './common-components.css';

export default class ErrorView extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  handleOnClick() {
    this.props.status === 401 ? handleLogOut() : window.location.reload();
  }

  render() {
    let { errorMessage } = this.props;
    return (
      <div className="error-view-container p-3">
        <div className="error-view-item custom-card p-3 ml-sm-col-10 ml-col-3">
          <p>{errorMessage ? errorMessage : 'Error while loading, please try again'} </p>
          <Button size="sm" variant="outline-primary" onClick={this.handleOnClick}>
            Reload
          </Button>
        </div>
      </div>
    );
  }
}
