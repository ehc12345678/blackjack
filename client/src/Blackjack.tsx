import React, { Component } from 'react';
import { PlayerComponent } from './views/Components/PlayerComponent';
import { HandComponent } from './views/Components/HandComponent';
import './App.css';
import { Hand, HandHelper } from './store/Hand';
import { Player } from './store/Player';
import { State, defaultState } from './store/State';
import axios, { AxiosResponse } from 'axios';
import { Game } from './store/Game';

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
    constructor(props: BlackjackProps) {
        super(props);
        this.state = { ...defaultState, currentUser: null } as BlackjackState;
    }

    private setServerState(state: State) {
        var newState = {...this.state, ...state};
        this.setState(newState);
    }

    async componentDidMount() {
        const state = await axios.get("/api/state") as State;
        this.setServerState(state);
    }

    async handleLogin() {
        const index = this.state.activeUsers.length;
        const loginId = 'Login' + index;
        this.doLogin(loginId);
    }

    async handleRegister() {
        const index = this.state.activeUsers.length;
        const { data } = await axios.post("/api/user/register", { name: 'Register' + index }) as AxiosResponse<Player>;
        this.doLogin(data.id);
    }

    async doLogin(loginId: string) {
        console.log('Logging in ' + loginId);
        await axios.post("/api/user/login", { loginId: loginId });
        const { data } = await axios.post("/api/game/join", {id: loginId}) as AxiosResponse<State>;
        var currentUser = await axios.get("/api/user/" + loginId) as Player;
        this.setState({...this.state, ...data, currentUser});
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
        const { data } = await axios.post("/api/user/changeBet", { id: player.id, bet }) as AxiosResponse<State>;
        this.setServerState(data);
    }

    async onSplit() {
        const { data } = await axios.get("/api/activeHand/split") as AxiosResponse<State>;
        this.setServerState(data);
    }

    getHandsForPlayer(player: Player) : Array<Hand> {
        var hands = this.state.playersHands.filter(h => h.player === player.id);
        return hands;
    }

    render() {
        return (
            <div>
                <div>
                    <button onClick={() => this.handleLogin()}>Login</button>
                    <button onClick={() => this.handleRegister()}>Register</button>
                </div>
                <div>
                    Current: {this.state.currentUser?.name}
                </div>
                <div>
                    <h2>Game</h2>
                    <table>
                        <tr>
                            {this.state.currentGame.players.map((value) => {
                                return <td>
                                    <PlayerComponent player={value}
                                        hands={this.getHandsForPlayer(value)}
                                        activeHand={this.getActiveHand()}
                                        canChangeBet={!this.state.turnIsGoing}
                                        onHit={() => this.onHit()}
                                        onStay={() => this.onStay()}
                                        onChangeBet={(player, bet) => this.onChangeBet(player, bet)}
                                        onSplit={() => this.onSplit()}
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
                                                    onHit={() => this.onHit()}
                                                    onStay={() => this.onStay()}
                                                    onSplit={() => this.onSplit()}
                                                    isDealer={true} />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        )
    }
}