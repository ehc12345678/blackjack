import '../../App.css';

import React, { Component } from 'react';
import axios, { AxiosResponse } from 'axios';

import { PlayerComponent } from '../Components/PlayerComponent';
import { HandComponent } from '../Components/HandComponent';
import { Hand } from '../../store';
import { Player } from '../../store';
import { LoginComponent } from '../LoginComponent';
import Nav from '../Components/Nav';
import { AppState } from '../../App';
import AuthContext from '../../auth/AuthContext';
import Auth from '../../auth/Auth';

interface BlackjackProps {
  readonly state: AppState;
  auth: Auth;
}

export class Blackjack extends Component<BlackjackProps> {
  async handleRegister(name: string) {
    const { data } = (await axios.post('/api/user/register', {
      name,
    })) as AxiosResponse<Player>;
    this.handleLogin(data.id);
  }

  async handleLogin(loginId: string) {
    console.log('Logging in ' + loginId);
    await axios.post('/api/user/login', { loginId: loginId });
    var currentUserResponse = (await axios.get(
      '/api/user/' + loginId
    )) as AxiosResponse<Player>;
    this.setState({ ...this.state, currentUser: currentUserResponse.data });
    axios.post('/api/game/join', { id: loginId });
  }

  isLoggedInPlayer(player: string) {
    return player === this.props.state.currentUser?.id;
  }

  handleCreateGame() {
    axios.put('/api/game/');
  }

  handleStartGame() {
    axios.get('/api/game/start');
  }

  getActiveHand(): Hand {
    if (this.props.state.activeHand < this.props.state.playersHands.length) {
      return this.props.state.playersHands[this.props.state.activeHand];
    }
    return this.props.state.dealersHand;
  }

  onHit() {
    axios.get('/api/activeHand/hit');
  }

  onStay() {
    axios.get('/api/activeHand/stay');
  }

  handleNextTurn() {
    axios.get('/api/activeHand/startTurn');
  }

  getNextTurnButton() {
    if (!this.props.state.turnIsGoing) {
      return (
        <div className="gameNextTurn">
          <button onClick={() => this.handleNextTurn()}>Next Turn</button>
        </div>
      );
    }
  }

  onChangeBet(player: Player, bet: number) {
    axios.post('/api/game/changeBet', { id: player.id, bet });
  }

  onSplit() {
    axios.get('/api/activeHand/split');
  }

  onDoubleDown() {
    axios.get('/api/activeHand/doubleDown');
  }

  getHandsForPlayer(player: string): Array<Hand> {
    var hands = this.props.state.playersHands.filter(
      (h) => h.player === player
    );
    return hands;
  }

  getPlayer(playerId: string): Player {
    var player = this.props.state.activeUsers.find((p) => playerId === p.id);
    if (player) {
      return player;
    }
    throw new Error('Could not find player ' + playerId);
  }

  getLoginComponent() {
    if (this.props.state.currentUser === null) {
      return (
        <LoginComponent
          onLogin={(loginId: string) => this.handleLogin(loginId)}
          onRegister={(name: string) => this.handleRegister(name)}
        />
      );
    }
    return <div>Current: {this.props.state.currentUser?.name}</div>;
  }

  render() {
    const { auth } = this.props;

    return (
      <AuthContext.Provider value={auth}>
        <div>
          <Nav auth={auth} />
          <h2>Game</h2>
          <div className="game">
            <div className="playersContainer">
              {this.props.state.currentGame.players.map((playerId, index) => {
                return (
                    <PlayerComponent
                      player={this.getPlayer(playerId)}
                      hands={this.getHandsForPlayer(playerId)}
                      activeHand={this.getActiveHand()}
                      canChangeBet={!this.props.state.turnIsGoing}
                      isLoggedInPlayer={this.isLoggedInPlayer(playerId)}
                      onHit={() => this.onHit()}
                      onStay={() => this.onStay()}
                      onChangeBet={(player, bet) =>
                        this.onChangeBet(player, bet)
                      }
                      onSplit={() => this.onSplit()}
                      onDoubleDown={() => this.onDoubleDown()}
                      key={"player" +index}
                    />
                  )
                })}
              </div>
              {this.getNextTurnButton()}
              <div className="dealerContainer">
                <HandComponent
                  hand={this.props.state.dealersHand}
                  isActive={
                    this.props.state.turnIsGoing &&
                    this.getActiveHand() ===
                      this.props.state.dealersHand
                  }
                  isLoggedInUser={false}
                  onHit={() => this.onHit()}
                  onStay={() => this.onStay()}
                  onSplit={() => this.onSplit()}
                  onDoubleDown={() => this.onDoubleDown()}
                  isDealer={true}
                  key="dealer"
                />
              </div>
          </div>
          </div>
      </AuthContext.Provider>
    );
  }
}
