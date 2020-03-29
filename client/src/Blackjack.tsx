import React, { Component } from 'react';
import { PlayerComponent } from './views/Components/PlayerComponent';
import { HandComponent } from './views/Components/HandComponent';
import './App.css';
import { Hand, HandHelper } from './store/Hand';
import { Player } from './store/Player';
import { State, defaultState } from './store/State';
import axios, { AxiosResponse } from 'axios';
import { Game } from './store/Game';
import { LoginComponent } from './views/LoginComponent';
import { w3cwebsocket as W3CWebSocket, IMessageEvent } from "websocket";

type BlackjackProps = {

};

type BlackjackState = {
    readonly currentGame: Game;
    readonly playersHands: Array<Hand>;
    readonly dealersHand: Hand;
    readonly activeHand: number;
    readonly activeUsers: Array<Player>;
    readonly turnIsGoing: boolean;
    readonly currentUser: Player | null;
}

const helper = new HandHelper();
export class Blackjack extends Component<BlackjackProps, BlackjackState> {
    webSocketClient: W3CWebSocket;

    constructor(props: BlackjackProps) {
        super(props);
        this.state = { ...defaultState, currentUser: null } as BlackjackState;
        this.webSocketClient = new W3CWebSocket("ws://localhost:10116");
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
        const { data } = await axios.post("/api/game/join", {id: loginId}) as AxiosResponse<State>;
        var currentUserResponse = await axios.get("/api/user/" + loginId) as AxiosResponse<Player>;
        this.setState({...this.state, ...data, currentUser: currentUserResponse.data});
    }

    isLoggedInPlayer(player: Player) {
        return player.id === this.state.currentUser?.id;
    }

    async handleCreateGame() {
        const { data } = await axios.put("/api/game/")  as AxiosResponse<State>;
        this.setServerState(data);
    }

    async handleStartGame() {
        const { data } = await axios.get("/api/game/start") as AxiosResponse<State>;
        this.setServerState(data);
    }

    getActiveHand(): Hand {
        if (this.state.activeHand < this.state.playersHands.length) {
            return this.state.playersHands[this.state.activeHand];
        }
        return this.state.dealersHand;
    }

    async onHit() {
        const { data } = await axios.get("/api/activeHand/hit") as AxiosResponse<State>;
        this.setServerState(data);
        if (this.isDealerInControl()) {
            this.fireDealerTakesControl();
        }
    }

    async onStay() {
        const { data } = await axios.get("/api/activeHand/stay") as AxiosResponse<State>;
        this.setServerState(data);
        if (this.isDealerInControl()) {
            this.fireDealerTakesControl();
        }
    }

    async onDealerInControl() {
        if (helper.bestTotal(this.state.dealersHand) < 17) {
            const { data } = await axios.get("/api/dealer/hit") as AxiosResponse<State>;
            this.fireDealerTakesControl();
            this.setServerState(data);
        } else {
            const { data } = await axios.get("/api/activeHand/endTurn") as AxiosResponse<State>;
            this.setServerState(data);
        }
    }

    async handleNextTurn() {
        const { data } = await axios.get("/api/activeHand/startTurn") as AxiosResponse<State>;
        this.setServerState(data);
    }

    private fireDealerTakesControl() {
        window.setTimeout(() => this.onDealerInControl(), 1000);
    }

    isDealerInControl(): boolean {
        var activeHand = this.getActiveHand();
        var inControl = activeHand === this.state.dealersHand;
        console.log('hand=' + this.state.activeHand + " " + inControl);
        return inControl;
    }

    getNextTurnButton() {
        if (!this.state.turnIsGoing) {
            return <div className="gameNextTurn"><button onClick={() => this.handleNextTurn()}>Next Turn</button></div>;
        }
    }

    async onChangeBet(player: Player, bet: number) {
        const { data } = await axios.post("/api/game/changeBet", { id: player.id, bet }) as AxiosResponse<State>;
        this.setServerState(data);
    }

    async onSplit() {
        const { data } = await axios.get("/api/activeHand/split") as AxiosResponse<State>;
        this.setServerState(data);
    }

    async onDoubleDown() {
        const { data } = await axios.get("/api/activeHand/doubleDown") as AxiosResponse<State>;
        this.setServerState(data);
    }

    getHandsForPlayer(player: Player) : Array<Hand> {
        var hands = this.state.playersHands.filter(h => h.player === player.id);
        return hands;
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
                            {this.state.currentGame.players.map((value) => {
                                return <td>
                                    <PlayerComponent player={value}
                                        hands={this.getHandsForPlayer(value)}
                                        activeHand={this.getActiveHand()}
                                        canChangeBet={!this.state.turnIsGoing}
                                        isLoggedInPlayer={this.isLoggedInPlayer(value)}
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