import React, { Component } from "react";
import { CardComponent } from "./CardComponent";
import { Hand, Result, HandHelper } from "../../store/Hand";

type HandProperties = {
    hand: Hand,                                                                                                                                                                                                                                                                                                                                                                                             
    isActive: boolean,
    isDealer: boolean,
    onHit: () => void,
    onStay: () => void,
    onSplit: () => void
};

const helper = new HandHelper();
export class HandComponent extends Component<HandProperties> {
    getHandTotal() {
        const { hand } = this.props;
        if (helper.isBlackjack(hand)) {
            return <span className="blackjack">Blackjack</span>;
        }
        if (helper.isBusted(hand)) {
            return <span className="busted">Busted</span>;
        }
        const lowest = helper.lowestTotal(hand);
        const highest = helper.highestTotal(hand);
        if (lowest > 0 && (hand.isStaying || lowest === highest)) {
            return <b>{helper.bestTotal(hand)}</b>;
        }
        if (lowest > 0) {
            return <span><b>{lowest}</b> or <b>{highest}</b></span>
        }
    }

    canHit() : boolean {
        return !(helper.isDone(this.props.hand));
    }

    canStay() : boolean {
        return this.canHit();
    }
   
    getBet() {
        if (this.props.hand.bet > 0) {
            return <div className="handBet">Bet: ${this.props.hand.bet}</div>;
        }
    }

    getHandResult() {
        if (this.props.hand.result !== Result.PLAYING) {
            return <div className="handResult">{this.props.hand.result}</div>
        }
    }

    buttonsShouldBeVisible() : boolean {
        return !this.props.isDealer && this.props.isActive && this.props.hand.result === Result.PLAYING;
    }

    getSplitButton() {
        if (helper.canSplit(this.props.hand) && this.buttonsShouldBeVisible()) {
            return <button onClick={() => this.props.onSplit()}>Split</button>
        }
    }

    render() {
        var active = this.props.isActive ? "Active" : "";
        var btnActive = this.buttonsShouldBeVisible() ? "Active" : "";
        return (
            <div className={"hand" + active}>
                <div className={"handTotal" + active}>{this.getHandTotal()}</div>
                {this.getBet()}
                {this.props.hand.cards.map((card) => {
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
                    { this.getSplitButton() }    
                </div> 
                {this.getHandResult()}
            </div>
        );
    }
}