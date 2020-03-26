import { DeckShoe } from "./DeskShoe";
import { Card } from "../Card";

const NUM_DECKS_IN_SHOE = 7;
export class CardApi {
    deckShoe: DeckShoe;
    
    constructor() {
        this.deckShoe = new DeckShoe(NUM_DECKS_IN_SHOE);
    }

    getNextCard() : Card {
        return this.deckShoe.getNextCard();
    }

    shuffle() {
        this.deckShoe.shuffle();
    }
}