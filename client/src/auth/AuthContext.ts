import React from 'react';
import Auth from './Auth';
const AuthContext = React.createContext<Auth | null>(null);
export default AuthContext;
