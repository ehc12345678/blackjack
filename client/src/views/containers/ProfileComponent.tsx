import React from 'react';
import Nav from '../Components/Nav';
import Auth from '../../auth/Auth';
import { Auth0Profile } from '../../App';

interface ProfileProps {
  profile: Auth0Profile;
  auth: Auth;
}

const ProfileComponent = ({ profile, auth }: ProfileProps) => {
  return (
    <div>
      <Nav auth={auth} />
      <h1>Profile</h1>
      {profile && (
      <>
        <p>{profile.given_name}</p>
        <img
          style={{ maxWidth: 50, maxHeight: 50 }}
          src={profile.picture}
          alt="profile pic"
        />
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      </>
    )}
  </div>
  );
};

export default ProfileComponent;
