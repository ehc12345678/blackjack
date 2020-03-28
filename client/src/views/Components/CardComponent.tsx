import React, { Component } from "react";
import { Card, Suit, UnknownCard } from "../../store/Card";

type CardProperties = {
    card: Card
};

export class CardComponent extends Component<CardProperties> {
    private cardValueToStr(value: number) : string {
        switch (value) {
            case 1: return 'A';
            case 10: return 'T';
            case 11: return 'J';
            case 12: return 'Q';
            case 13: return 'K';
        }
        return value.toString();
    }

    private cardSuitToStr(suit: Suit) : string {
        return suit.toString();
    }

    private imagePath(card: Card) : string {
        if (this.isUnknown(card)) {
            return "/cards/Unknown.jpg";
        }
        return "/cards/" + this.cardValueToStr(card.value) + this.cardSuitToStr(card.suit) + ".jpg";  
    }

    private altText(card: Card) : string {
        if (this.isUnknown(card)) {
            return "Unknown";
        }
        return this.cardValueToStr(card.value) + this.cardSuitToStr(card.suit);
    }

    private isUnknown(card: Card) : boolean {
        return (card.value === UnknownCard.value && card.suit === UnknownCard.suit);
    }

    render() {
        return (
            <div className="card">
                <img src={this.imagePath(this.props.card)} alt={this.altText(this.props.card)}></img>
            </div>
        );
    }
}