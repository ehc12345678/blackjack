import { Deck } from './Deck';
import { Card } from './store';

export class DeckShoe extends Deck {
  cardOnTop = 0;

  constructor(numDecks: number) {
    super(false);
    for (let i = 0; i < numDecks; ++i) {
      this.addDefaultCards();
    }
    this.shuffle();
  }

  shuffle() {
    super.shuffle();
    this.cardOnTop = 0;
  }

  getNextCard(): Card {
    if (this.cardOnTop >= this.cards.length) {
      this.shuffle();
    }
    return this.cards[this.cardOnTop++];
  }
}
