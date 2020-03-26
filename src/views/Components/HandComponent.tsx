import React, { Component } from "react";
import { CardComponent } from "./CardComponent";
import { Hand } from "../../store/Hand";
import { Result } from "../../store/HandService";

type HandProperties = {
    hand: Hand,                                                                                                                                                                                                                                                                                                                                                                                             
    isActive: boolean,
    onHit: Function,
    onStay: Function
};

export class HandComponent extends Component<HandProperties> {
    getHandTotal() {
        const { hand } = this.props;
        if (hand.isBlackjack()) {
            return <span className="blackjack">Blackjack</span>;
        }
        if (hand.isBusted()) {
            return <span className="busted">Busted</span>;
        }
        if (hand.isStaying() || hand.highestTotal() === hand.lowestTotal()) {
            return <b>{hand.bestTotal()}</b>;
        }
        return <span><b>{this.props.hand.lowestTotal()}</b> or <b>{this.props.hand.highestTotal()}</b></span>
    }

    canHit() : boolean {
        return !(this.props.hand.isDone());
    }

    canStay() : boolean {
        return !(this.props.hand.isDone());
    }
   
    getBet() {
        if (this.props.hand.bet() > 0) {
            return <div className="handBet">Bet: ${this.props.hand.bet()}</div>;
        }
    }

    getHandResult() {
        if (this.props.hand.result() !== Result.PLAYING) {
            return <div className="handResult">{this.props.hand.result()}</div>
        }
    }

    render() {
        return (
            <div className={this.props.isActive ? "handActive" : "hand"}>
                <div className="handTotal">{this.getHandTotal()}</div>
                {this.getBet()}
                {this.props.hand.cards().map((card) => {
                    return <CardComponent card={card}/>
                })}
                <div className="handButtons">
                    <button 
                        className={this.props.isActive && this.props.hand.result() === Result.PLAYING ? "handButtonActive" : "handButtonNotActive"} 
                        disabled={!this.canHit()}
                        onClick={() => this.props.onHit()}>Hit</button>
                    <button 
                        className={this.props.isActive && this.props.hand.result() === Result.PLAYING ? "handButtonActive" : "handButtonNotActive"} 
                        disabled={!this.canStay()}
                        onClick={() => this.props.onStay()}>Stay</button>
                </div> 
                {this.getHandResult()}
            </div>
        );
    }
}