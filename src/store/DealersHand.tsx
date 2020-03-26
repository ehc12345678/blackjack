import { Hand } from "./Hand";
import { Player } from "./Player";
import { Card, UnknownCard } from "./Card";
import { Result } from "./HandService";

const DEALER = Player.create('Dealer','dealer');

export class DealersHand extends Hand {
    static create() : DealersHand {
        return new DealersHand({player: DEALER, cards: [], bet: 0, isStaying: false, result: Result.PLAYING});
    }
    
    shouldHit() : boolean {
        return !this.isStaying();
    }

    isStaying() : boolean {
        return this.highestTotal() >= 17;
    }

    replaceUnknownCard(newCard: Card) : DealersHand {
        var cards = this.data.cards.filter(card => card !== UnknownCard)
        cards.push(newCard);
        return new DealersHand({...this.data, cards});
    }

    addCard(newCard: Card) : DealersHand {
        return new DealersHand({...this.data, cards: [...this.data.cards, newCard]});
    }
}