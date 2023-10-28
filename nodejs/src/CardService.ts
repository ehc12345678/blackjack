import { Card } from './store';
import { DeckShoe } from './DeskShoe';

const NUM_DECKS_IN_SHOE = 7;
export class CardService {
  deckShoe: DeckShoe;

  constructor() {
    this.deckShoe = new DeckShoe(NUM_DECKS_IN_SHOE);
  }

  nextCard(): Card {
    return this.deckShoe.getNextCard();
  }

  shuffle() {
    this.deckShoe.shuffle();
  }
}

export const theCardService = new CardService();
