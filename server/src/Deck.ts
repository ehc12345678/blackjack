import { Card, Suit } from './store';

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

  getCards(): Array<Card> {
    return this.cards;
  }

  shuffle() {
    const SHUFFLE_FACTOR = 1000;
    for (let i = 0; i < this.cards.length; ++i) {
      this.swap(this.cards, i, getRandomInt(this.cards.length));
    }
    for (let i = this.cards.length - 1; i >= 0; --i) {
      this.swap(this.cards, i, getRandomInt(this.cards.length));
    }
    for (let i = 0; i < SHUFFLE_FACTOR; ++i) {
      this.swap(
        this.cards,
        getRandomInt(this.cards.length),
        getRandomInt(this.cards.length)
      );
    }
  }

  swap<T>(arr: Array<T>, item1: number, item2: number) {
    const tmp = arr[item1];
    arr[item1] = arr[item2];
    arr[item2] = tmp;
  }
}
