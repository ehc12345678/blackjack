import React, { Component } from 'react';
import Auth from './auth/Auth';
import { State, defaultState } from './store';
import { Player } from './store';
import { w3cwebsocket as W3CWebSocket, IMessageEvent } from 'websocket';
import axios, { AxiosResponse } from 'axios';
import AppContainer from './views/containers/AppContainer';

const host = window.location.host.substring(
  0,
  window.location.host.indexOf(':')
);

export interface Auth0Profile {
  nickname: string;
  picture: string;
  given_name: string;
  email: string;
}

interface AppProps {
  history: History | null | undefined;
  location: Location | null | undefined;
}

export interface AppState extends State {
  readonly currentUser: Player | null;
  readonly currentAuth0Profile: Auth0Profile | null;
  readonly auth: Auth;
  readonly tokenRenewalComplete: boolean;
}

class App extends Component<AppProps, AppState> {
  webSocketClient: W3CWebSocket;

  constructor(props: AppProps) {
    super(props);
    this.state = {
      ...defaultState,
      currentUser: null,
      currentAuth0Profile: null,
      tokenRenewalComplete: false,
      auth: new Auth(this.props.history, this.loadUserProfile),
    } as AppState;
    this.webSocketClient = new W3CWebSocket('ws://' + host + ':' + 10116);
  }

  async componentDidMount() {
    const { data } = (await axios.get('/api/state')) as AxiosResponse<State>;
    this.setServerState(data);

    this.webSocketClient.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    this.webSocketClient.onmessage = (message: IMessageEvent) => {
      var jsonString = message.data as string;
      console.log('WebSocket message received: ' + jsonString);
      this.setServerState(JSON.parse(jsonString));
    };
    const { auth } = this.state;
    auth.renewToken(() => this.loadUserProfile());
  }

  setServerState = (state: State) => {
    var newState = { ...this.state, ...state };
    this.setState(newState);
  };

  loadUserProfile = () => {
    this.setState({ ...this.setState, tokenRenewalComplete: true });
    this.state.auth.getProfile((profile: Auth0Profile, _error: string) => {
      this.setState({
        ...this.state,
        currentAuth0Profile: profile,
      });
      this.onAuthProfile(profile);
    });
  };

  async onAuthProfile(profile: Auth0Profile) {
    if (!profile) return;

    const loginId = profile.email.substring(0, profile.email.indexOf('@'));
    var currentUserResponse = (await axios.get(
      '/api/user/' + encodeURI(loginId)
    )) as AxiosResponse<Player>;
    if (currentUserResponse.status === 404 || !currentUserResponse.data) {
      const name = profile.given_name;
      await axios.post('/api/user/register', {
        name,
        loginId,
      });
      currentUserResponse = (await axios.get(
        '/api/user/' + encodeURI(loginId)
      )) as AxiosResponse<Player>;
    }
    console.log('Logging in ' + loginId);
    await axios.post('/api/user/login', { loginId: loginId });

    this.setState({ ...this.state, currentUser: currentUserResponse.data });
    axios.post('/api/game/join', { id: loginId });
  }

  render() {
    return (
      <AppContainer 
        auth={this.state.auth} 
        tokenRenewalComplete={this.state.tokenRenewalComplete} 
        state={this.state} 
        location={this.props.location}        
      />
    );
  }
}

export default App;
