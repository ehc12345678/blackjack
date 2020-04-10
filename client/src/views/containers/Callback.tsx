import React, { Component } from 'react';
import Auth from '../../auth/Auth';

interface CallbackProps {
  auth: Auth;
  location: Location | null | undefined;
}

class Callback extends Component<CallbackProps> {
  componentDidMount() {
    // handle auth if expected values in the URL
    if (
      this.props.location &&
      /access_token|id_token|error/.test(this.props.location.hash)
    ) {
      this.props.auth.handleAuthentication();
    } else {
      throw new Error('Invalid callback URL.');
    }
  }
  render() {
    return <h1>Loading...</h1>;
  }
}

export default Callback;
