import React, { Component } from 'react';
import { PlayerComponent } from './views/Components/PlayerComponent';
import { HandComponent } from './views/Components/HandComponent';
import './App.css';
import { Hand } from './store/Hand';
import { Player } from './store/Player';
import { State, defaultState } from './store/State';
import axios, { AxiosResponse } from 'axios';
import { Game } from './store/Game';
import { LoginComponent } from './views/LoginComponent';
import { w3cwebsocket as W3CWebSocket, IMessageEvent } from "websocket";

type BlackjackProps = {

};

const host = window.location.host.substring(0, window.location.host.indexOf(':'));

type BlackjackState = {
    readonly currentGame: Game;
    readonly playersHands: Array<Hand>;
    readonly dealersHand: Hand;
    readonly activeHand: number;
    readonly activeUsers: Array<Player>;
    readonly turnIsGoing: boolean;
    readonly currentUser: Player | null;
}

export class Blackjack extends Component<BlackjackProps, BlackjackState> {
    webSocketClient: W3CWebSocket;

    constructor(props: BlackjackProps) {
        super(props);
        this.state = { ...defaultState, currentUser: null } as BlackjackState;
        this.webSocketClient = new W3CWebSocket("ws://" + host + ":" + 10116);
    }

    private setServerState(state: State) {
        var newState = {...this.state, ...state};
        this.setState(newState);
    }

    async componentDidMount() {
        const { data } = await axios.get("/api/state") as AxiosResponse<State>;
        this.setServerState(data);

        this.webSocketClient.onopen = () => {
            console.log('WebSocket Client Connected');
          };
        this.webSocketClient.onmessage = (message: IMessageEvent) => {
            var jsonString = message.data as string;
            console.log('WebSocket message received: ' + jsonString);
            this.setServerState(JSON.parse(jsonString));
        };
    }

    async handleRegister(name: string) {
        const { data } = await axios.post("/api/user/register", { name }) as AxiosResponse<Player>;
        this.handleLogin(data.id);
    }

    async handleLogin(loginId: string) {
        console.log('Logging in ' + loginId);
        await axios.post("/api/user/login", { loginId: loginId });
        var currentUserResponse = await axios.get("/api/user/" + loginId) as AxiosResponse<Player>;
        this.setState({...this.state, currentUser: currentUserResponse.data});
        axios.post("/api/game/join", {id: loginId});
    }

    isLoggedInPlayer(player: string) {
        return player === this.state.currentUser?.id;
    }

    handleCreateGame() {
        axios.put("/api/game/");
    }

    handleStartGame() {
        axios.get("/api/game/start");
    }

    getActiveHand(): Hand {
        if (this.state.activeHand < this.state.playersHands.length) {
            return this.state.playersHands[this.state.activeHand];
        }
        return this.state.dealersHand;
    }

    onHit() {
        axios.get("/api/activeHand/hit");
    }

    onStay() {
        axios.get("/api/activeHand/stay");
    }

    handleNextTurn() {
        axios.get("/api/activeHand/startTurn");
    }

    getNextTurnButton() {
        if (!this.state.turnIsGoing) {
            return <div className="gameNextTurn"><button onClick={() => this.handleNextTurn()}>Next Turn</button></div>;
        }
    }

    onChangeBet(player: Player, bet: number) {
        axios.post("/api/game/changeBet", { id: player.id, bet });
    }

    onSplit() {
        axios.get("/api/activeHand/split");
    }

    onDoubleDown() {
        axios.get("/api/activeHand/doubleDown");
    }

    getHandsForPlayer(player: string) : Array<Hand> {
        var hands = this.state.playersHands.filter(h => h.player === player);
        return hands;
    }

    getPlayer(playerId: string) : Player {
        var player = this.state.activeUsers.find(p => playerId === p.id);
        if (player) {
            return player;
        }
        throw "Could not find player " + playerId;
    }

    getLoginComponent() {
        if (this.state.currentUser === null) {
            return <LoginComponent 
                onLogin={(loginId: string) => this.handleLogin(loginId)} 
                onRegister={(name: string) => this.handleRegister(name)}/>
        }
        return (
            <div>Current: {this.state.currentUser?.name}</div>
        );
    }

    render() {
        return (
            <div>
                {this.getLoginComponent()}
                <h2>Game</h2>
                <div>
                    <table>
                        <tbody>
                        <tr>
                            {this.state.currentGame.players.map((playerId) => {
                                return <td>
                                    <PlayerComponent player={this.getPlayer(playerId)}
                                        hands={this.getHandsForPlayer(playerId)}
                                        activeHand={this.getActiveHand()}
                                        canChangeBet={!this.state.turnIsGoing}
                                        isLoggedInPlayer={this.isLoggedInPlayer(playerId)}
                                        onHit={() => this.onHit()}
                                        onStay={() => this.onStay()}
                                        onChangeBet={(player, bet) => this.onChangeBet(player, bet)}
                                        onSplit={() => this.onSplit()}
                                        onDoubleDown={() => this.onDoubleDown()}
                                    />
                                </td>
                            })}
                        </tr>
                        <tr>
                            <td colSpan={this.state.currentGame.players.length} align="center">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                {this.getNextTurnButton()}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <HandComponent hand={this.state.dealersHand}
                                                    isActive={this.state.turnIsGoing && this.getActiveHand() === this.state.dealersHand}
                                                    isLoggedInUser={false}
                                                    onHit={() => this.onHit()}
                                                    onStay={() => this.onStay()}
                                                    onSplit={() => this.onSplit()}
                                                    onDoubleDown={() => this.onDoubleDown()}
                                                    isDealer={true} />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}