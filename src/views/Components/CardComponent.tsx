import React, { Component } from "react";
import { Card, Suit, UnknownCard } from "../../store/Card";

type CardProperties = {
    card: Card
};

export class CardComponent extends Component<CardProperties> {
    constructor(props: CardProperties) {
        super(props);
    }

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
        if (card === UnknownCard) {
            return "/cards/Unknown.jpg";
        }
        return "/cards/" + this.cardValueToStr(card.value) + this.cardSuitToStr(card.suit) + ".jpg";  
    }

    private altText(card: Card) : string {
        if (card === UnknownCard) {
            return "Unknown";
        }
        return this.cardValueToStr(card.value) + this.cardSuitToStr(card.suit);
    }

    render() {
        return (
            <div className="card">
                <img src={this.imagePath(this.props.card)} alt={this.altText(this.props.card)}></img>
            </div>
        );
    }
}