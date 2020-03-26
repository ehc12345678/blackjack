import { Hand } from "../../store/Hand";
import { Player } from "../../store/Player";
import React, { Component, ChangeEvent } from "react";
import { HandComponent } from "./HandComponent";

export type PlayerProperties = {
   player: Player,
   hands: Array<Hand>,
   activeHand: Hand,
   canChangeBet: boolean,
   onHit: () => void,
   onStay: () => void,
   onSplit: () => void,
   onChangeBet: (player: Player, bet: number) => void
};

type PlayerState = {
    changeBetVisible: boolean,
    bet: number
};

export class PlayerComponent extends Component<PlayerProperties, PlayerState> {
    toggleBetVisiblity: (event: any) => void;
    onSetBet: (event: any) => void;
    onBetValueChange: (event: any) => void;

    constructor(props: PlayerProperties) {
        super(props);
        this.state = {changeBetVisible: false, bet: props.player.currentBet()};
        this.toggleBetVisiblity = this.handleToggleBetVisibility.bind(this);
        this.onSetBet = this.handleSetBet.bind(this);
        this.onBetValueChange = this.handleBetValueChange.bind(this);
    }

    handleToggleBetVisibility() {
        this.setState({changeBetVisible: !this.state.changeBetVisible});
    }

    handleSetBet() {
        this.props.onChangeBet(this.props.player, this.state.bet);
        this.handleToggleBetVisibility();
    }

    handleBetValueChange(event: ChangeEvent<HTMLInputElement>) {
        var bet = +event.target.value;
        this.setState({...this.state, bet});
    }
   
    getBetControls() {
        var changeControlsForm;
        var changeBetButton;
        if (this.state.changeBetVisible) {
            changeControlsForm = (
                <div className="playerBetForm">
                    <input type="text" value={this.state.bet} onChange={this.onBetValueChange}/>
                    <button onClick={this.onSetBet}>OK</button>
                    <button onClick={this.toggleBetVisiblity}>Cancel</button>
                </div>
            );
        } 
        
        if (this.props.canChangeBet) {
            changeBetButton = <button onClick={this.toggleBetVisiblity}>Change Bet</button>
            return <div className="playerBet">Current Bet: ${this.state.bet}{changeBetButton}{changeControlsForm}</div>
        }
    }

    render() {
        return (
        <div className="player">
            <div className="playerName">{this.props.player.name()}</div>
            <div className="playerChips">Chips: {this.props.player.chipBalance()}</div>
            <div className="playerCash">Cash: {this.props.player.cashBalance()}</div>
            { this.getBetControls() }
            <div className="hands">
                {this.props.hands.map((value) => {
                    return <HandComponent hand={value} isActive={this.props.activeHand === value}
                        onHit={this.props.onHit} onStay={this.props.onStay} onSplit={this.props.onSplit} isDealer={false}/>
                })}
            </div>    
        </div>
        )
    }
}