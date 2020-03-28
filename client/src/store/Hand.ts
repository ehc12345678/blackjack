import { Card } from './Card';

export enum Result { LOSS = "Loss", PUSH = "Push", WIN = "Win", BLACKJACK = "Blackjack", PLAYING = "Playing" };

export type Hand = {
    readonly cards: Array<Card>;
    readonly player: string;
    readonly bet: number;
    readonly isStaying: boolean;
    readonly result: Result;
};

export class HandHelper {
    canSplit(hand: Hand): boolean {
        const { cards } = hand;
        return (cards.length === 2 && cards[0].value === cards[1].value);
    }

    highestTotal(hand: Hand) : number {
        var total = 0;
        for (let card of hand.cards) {
            var val = Math.min(card.value, 10);
            if (val === 1 && total + 11 <= 21) {
                val = 11;
            }
            total += val;
        }
        if (total > 21) {
            total = this.lowestTotal(hand);
        }
        return total;
    }

    lowestTotal(hand: Hand) : number {
        var total = 0;
        for (let card of hand.cards) {
            total += Math.min(card.value, 10);
        }
        return total;
    }

    bestTotal(hand: Hand) : number {
        return (this.highestTotal(hand) <= 21 ? this.highestTotal(hand) : this.lowestTotal(hand));
    }

    isBusted(hand: Hand) : boolean {
        return this.lowestTotal(hand) > 21;
    }

    isBlackjack(hand: Hand) : boolean {
        return this.highestTotal(hand) === 21 && hand.cards.length === 2;
    }

    isDone(hand: Hand) : boolean {
        return this.isBusted(hand) || hand.isStaying || this.isBlackjack(hand);
    }
}