import React, { ReactElement } from 'react';
import { Route } from 'react-router';
import Auth from "../../auth/Auth";
import AuthContext from '../../auth/AuthContext';
import { Blackjack } from './Blackjack';
import { AppState } from '../../App';
import Callback from './Callback';
import { PrivateRoute } from '../Components/PrivateRoute';
import ProfileComponent from './ProfileComponent';
import AllUsers from '../Components/AllUsers';

interface AppContainerProps {
    auth: Auth,
    tokenRenewalComplete: boolean,
    state: AppState,
    location: Location | null | undefined;
}

const AppContainer = ({ auth, tokenRenewalComplete, state, location }: AppContainerProps): ReactElement => {
    if (!tokenRenewalComplete) return (<div>'Loading...'</div>);
    return (
      <AuthContext.Provider value={auth}>
        <div className="body">
          <Route
            path="/"
            exact
            render={(props) => (
              <Blackjack
                state={state}
                auth={auth}
                {...props}
              />
            )}
          />
          <Route
            path="/callback"
            render={(props) => (
              <Callback auth={auth} location={location} />
            )}
          />
          <PrivateRoute path="/profile" component={ProfileComponent} />
          <PrivateRoute
            path="/users"
            component={AllUsers}
            scopes={['read:users']}
          />
        </div>
      </AuthContext.Provider>
    );
}

export default AppContainer;
