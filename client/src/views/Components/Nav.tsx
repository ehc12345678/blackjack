import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../../auth/Auth';

interface NavProps {
  auth: Auth;
}

class Nav extends Component<NavProps> {
  render() {
    const { isAuthenticated, login, logout, userHasScopes } = this.props.auth;
    return (
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          {isAuthenticated() && userHasScopes(['read:users']) && (
            <li>
              <Link to="/users">All Users</Link>
            </li>
          )}
          <li>
            {isAuthenticated() ? (
              <button onClick={logout}>Logout</button>
            ) : (
              <button onClick={login}>Login</button>
            )}
          </li>
        </ul>
      </nav>
    );
  }
}

export default Nav;
