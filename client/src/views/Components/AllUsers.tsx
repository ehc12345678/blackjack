import React, { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import Auth from '../../auth/Auth';
import { Player } from '../../store';
import Nav from './Nav';

interface AllUsersProps {
  auth: Auth;
}

interface AllUsersState {
  users: Array<Player>;
}

const AllUsers = ({ auth }: Auth) => {
  const [users, setUsers] = useState<Array<Player>>([]);

  useEffect(() => {
    const getUsers = async () => {
        const bearerToken = `Bearer ${auth.getAccessToken()}`;
        const messageResponse = (await axios.get('/api/user', {
          headers: { Authorization: bearerToken },
        })) as AxiosResponse<Array<Player>>;
        console.log('Component mount ' + JSON.stringify(messageResponse));
        if (messageResponse.data) {
          setUsers(messageResponse.data);
        }
    };
    getUsers();
  }, [auth]);

  return (
  <>
    <Nav auth={auth} />
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

export default AllUsers;
