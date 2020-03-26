import { Card, Suit } from "../Card";

function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}

export class Deck {
    cards: Array<Card>;

    constructor(shouldAddDefaultCards: boolean = true) {
        this.cards = [];
        if (shouldAddDefaultCards) {
            this.addDefaultCards();
        } 
    }

    protected addDefaultCards() {
        for (let i = 1; i <= 13; ++i) {
            this.cards.push({ value: i, suit: Suit.Club });
            this.cards.push({ value: i, suit: Suit.Heart });
            this.cards.push({ value: i, suit: Suit.Diamond });
            this.cards.push({ value: i, suit: Suit.Spade });
        }
    }

    getCards() : Array<Card> {
        return this.cards;
    }

    shuffle() {
        const SHUFFLE_FACTOR = 1000;
        for (let i = 0; i < SHUFFLE_FACTOR; ++i) {
            const first = getRandomInt(this.cards.length);
            const second = getRandomInt(this.cards.length);
            
            const temp = this.cards[first];
            this.cards[second] = this.cards[first];
            this.cards[first] = temp;
        }
    }
}