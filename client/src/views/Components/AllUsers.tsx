import React, { Component } from 'react';
import axios, { AxiosResponse } from 'axios';
import Auth from '../../auth/Auth';
import { Player } from '../../store/Player';
import Nav from './Nav';

interface AllUsersProps {
  auth: Auth;
}

interface AllUsersState {
  users: Array<Player>;
}

class AllUsers extends Component<AllUsersProps, AllUsersState> {
  constructor(props: AllUsersProps) {
    super(props);
    this.state = { users: [] };
  }

  async componentDidMount() {
    const bearerToken = `Bearer ${this.props.auth.getAccessToken()}`;
    const messageResponse = (await axios.get('/api/user', {
      headers: { Authorization: bearerToken },
    })) as AxiosResponse<Array<Player>>;
    console.log('Component mount ' + JSON.stringify(messageResponse));
    if (messageResponse.data) {
      this.setState({ users: messageResponse.data });
    }
  }

  render() {
    const { users } = this.state;
    return (
      <>
        <Nav auth={this.props.auth} />
        <h1>All Users</h1>
        <table>
          <tbody>
            <th>Name</th>
            <th>Chips</th>
            <th>Money</th>
            {users.map((user) => {
              return (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.chipBalance}</td>
                  <td>${user.cashBalance}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  }
}

export default AllUsers;
