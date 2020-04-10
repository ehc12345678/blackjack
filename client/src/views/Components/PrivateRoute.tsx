import * as React from 'react';
import { Route, RouteProps } from 'react-router-dom';
import AuthContext from '../../auth/AuthContext';

interface PrivateRouteProps extends RouteProps {
  // tslint:disable-next-line:no-any
  component?: any;
  // tslint:disable-next-line:no-any
  children?: any;
  scopes?: Array<String>;
}

export const PrivateRoute = (props: PrivateRouteProps) => {
  const { component: Component, scopes, children, ...rest } = props;

  return (
    <AuthContext.Consumer>
      {(auth) =>
        auth && (
          <Route
            {...rest}
            render={(routeProps) => {
              if (!auth.isAuthenticated()) return auth.login();
              if (scopes && !auth.userHasScopes(scopes)) {
                return <h1>Unauthorized for scopes: {scopes.join(',')}</h1>;
              }

              return Component ? (
                <Component auth={auth} {...props} />
              ) : (
                children
              );
            }}
          />
        )
      }
    </AuthContext.Consumer>
  );
};
