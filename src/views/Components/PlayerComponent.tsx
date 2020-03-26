import { Hand } from "../../store/Hand";
import { Player } from "../../store/Player";
import React, { Component } from "react";
import { HandComponent } from "./HandComponent";

export type PlayerProperties = {
   player: Player,
   hands: Array<Hand>,
   activeHand: Hand,
   onHit: Function,
   onStay: Function 
};

export class PlayerComponent extends Component<PlayerProperties> {
    render() {
        return (
        <div className="player">
            <div className="playerName">{this.props.player.name()}</div>
            <div className="playerChips">Chips: {this.props.player.chipBalance()}</div>
            <div className="playerCash">Cash: {this.props.player.cashBalance()}</div>
            <div className="hands">
                {this.props.hands.map((value) => {
                    return <HandComponent hand={value} isActive={this.props.activeHand === value}
                        onHit={this.props.onHit} onStay={this.props.onStay}/>
                })}
            </div>    
        </div>
        )
    }
}