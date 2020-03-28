import React, { Component } from 'react';
import { PlayerComponent } from './views/Components/PlayerComponent';
import { HandComponent } from './views/Components/HandComponent';
import './App.css';
import { Hand, HandHelper } from './store/Hand';
import { Player } from './store/Player';
import { State } from './store/State';
import axios from 'axios';
import { User } from './store/User';

type BlackjackProps = {

};

export type BlackjackState = {
    state: State,
    currentUser: User | undefined
};

const helper = new HandHelper();
export class Blackjack extends Component<BlackjackProps, BlackjackState> {
    constructor(props: BlackjackProps) {
        super(props);
        this.state = { state: {} } as BlackjackState;
    }

    async componentDidMount() {
        const state = await axios.get("/api/state") as State;
        this.setState({ ...this.state, state });
    }

    async handleLogin() {
        const index = this.state.state.activeUsers.length;
        const loginId = 'Login' + index;
        this.doLogin(loginId);
    }

    async handleRegister() {
        const index = this.state.state.activeUsers.length;
        const loginId = await axios.post("/api/user/register", { name: 'Register' + index }) as string;
        this.doLogin(loginId);
    }

    async doLogin(loginId: string) {
        const state = await axios.post("/api/user/login", { loginId }) as State;
        const user = await axios.get("/api/user/" + loginId) as User;
        this.setState({ ...this.state, state, currentUser: user });
    }

    async handleCreateGame() {
        const state = await axios.put("/api/game/") as State;
        this.setState({ ... this.state, state });
    }

    async handleStartGame() {
        const state = await axios.get("/api/game/start") as State;
        this.setState({ ... this.state, state });
    }

    getActiveHand(state: State): Hand {
        if (state.activeHand < state.playersHands.length) {
            return state.playersHands[state.activeHand];
        }
        return state.dealersHand;
    }

    async onHit() {
        const state = await axios.get("/api/activeHand/hit") as State;
        this.setState({ ... this.state, state });
        if (this.isDealerInControl(state)) {
            this.fireDealerTakesControl(state);
        }
    }

    async onStay() {
        const state = await axios.get("/api/activeHand/stay") as State;
        this.setState({ ... this.state, state });
        if (this.isDealerInControl(state)) {
            this.fireDealerTakesControl(state);
        }
    }

    async onDealerInControl(state: State) {
        var state: State;
        if (helper.bestTotal(state.dealersHand) < 17) {
            state = await axios.get("/blackjackApi/dealer/hit") as State;
            this.fireDealerTakesControl(state);
        } else {
            state = await axios.get("/blackjackApi/endTurn") as State;
        }
        this.setState({ ... this.state, state });
    }

    async handleNextTurn() {
        const state = await axios.get("/blackjackApi/nextTurn") as State;
        this.setState({ ... this.state, state });
    }

    private fireDealerTakesControl(state: State) {
        window.setTimeout(() => this.onDealerInControl(state), 1000);
    }

    isDealerInControl(state: State): boolean {
        var activeHand = this.getActiveHand(state);
        var inControl = activeHand === state.dealersHand;
        console.log('hand=' + state.activeHand + " " + inControl);
        return inControl;
    }

    getNextTurnButton() {
        if (!this.state.state.turnIsGoing) {
            return <div className="gameNextTurn"><button onClick={() => this.handleNextTurn()}>Next Turn</button></div>;
        }
    }

    async onChangeBet(player: Player, bet: number) {
        const state = await axios.post("/blackjackApi/player/changeBet", { id: player.id, bet }) as State;
        this.setState({ ... this.state, state });
    }

    async onSplit() {
        const state = await axios.get("/blackjackApi/activeHand/split") as State;
        this.setState({ ... this.state, state });
    }

    getHandsForPlayer(state: State, player: Player) : Array<Hand> {
        var hands = state.playersHands.filter(h => h.player.id === player.id);
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
                            {this.state.state.currentGame.players.map((value) => {
                                return <td>
                                    <PlayerComponent player={value}
                                        hands={this.getHandsForPlayer(this.state.state, value)}
                                        activeHand={this.getActiveHand(this.state.state)}
                                        canChangeBet={!this.state.state.turnIsGoing}
                                        onHit={() => this.onHit()}
                                        onStay={() => this.onStay()}
                                        onChangeBet={(player, bet) => this.onChangeBet(player, bet)}
                                        onSplit={() => this.onSplit()}
                                    />
                                </td>
                            })}
                        </tr>
                        <tr>
                            <td colSpan={this.state.state.currentGame.players.length} align="center">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                {this.getNextTurnButton()}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <HandComponent hand={this.state.state.dealersHand}
                                                    isActive={this.state.state.turnIsGoing && this.getActiveHand(this.state.state) === this.state.state.dealersHand}
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