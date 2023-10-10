import React, { useEffect } from 'react';
import Auth from '../../auth/Auth';

interface CallbackProps {
  auth: Auth;
  location: Location | null | undefined;
}

const Callback = ({ auth, location }: CallbackProps) => {
  useEffect(() => {
    // handle auth if expected values in the URL
    if (location && /access_token|id_token|error/.test(location.hash)) {
      auth.handleAuthentication();
    } else {
      throw new Error('Invalid callback URL.');
    }
  }, [auth, location]);
  return <h1>Loading...</h1>;
}

export default Callback;
