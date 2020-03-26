import React, { Component } from "react";
import { CardComponent } from "./CardComponent";
import { Hand } from "../../store/Hand";
import { Result } from "../../store/HandService";

type HandProperties = {
    hand: Hand,                                                                                                                                                                                                                                                                                                                                                                                             
    isActive: boolean,
    isDealer: boolean,
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
        const lowest = hand.lowestTotal();
        const highest = hand.highestTotal();
        if (lowest > 0 && (hand.isStaying() || lowest === highest)) {
            return <b>{hand.bestTotal()}</b>;
        }
        if (lowest > 0) {
            return <span><b>{lowest}</b> or <b>{highest}</b></span>
        }
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

    buttonsShouldBeVisible() : boolean {
        return !this.props.isDealer && this.props.isActive && this.props.hand.result() === Result.PLAYING;
    }

    render() {
        var active = this.props.isActive ? "Active" : "";
        var btnActive = this.buttonsShouldBeVisible() ? "Active" : "";
        return (
            <div className={"hand" + active}>
                <div className={"handTotal" + active}>{this.getHandTotal()}</div>
                {this.getBet()}
                {this.props.hand.cards().map((card) => {
                    return <CardComponent card={card}/>
                })}
                <div className="handButtons">
                    <button 
                        className={"handButton" + btnActive} 
                        disabled={!this.canHit()}
                        onClick={() => this.props.onHit()}>Hit</button>
                    <button 
                        className={"handButton" + btnActive} 
                        disabled={!this.canStay()}
                        onClick={() => this.props.onStay()}>Stay</button>
                </div> 
                {this.getHandResult()}
            </div>
        );
    }
}