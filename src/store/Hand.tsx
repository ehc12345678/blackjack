import { Card } from './Card';
import { Player } from './Player';
import { Result } from './HandService';

type Data = {
    readonly cards: Array<Card>;
    readonly player: Player;
    readonly bet: number;
    readonly isStaying: boolean;
    readonly result: Result;
};

export class Hand {
    readonly data: Data;

    static create(player: Player, bet: number) : Hand {
        return new Hand({cards: [], player, bet, isStaying: false, result: Result.PLAYING});
    }

    constructor(data: Data) {
        this.data = data;
    }

    addCard(card: Card) : Hand {
        return new Hand({...this.data, cards: [...this.data.cards, card]});
    }

    setResult(result: Result) : Hand {
        return new Hand({...this.data, result});
    }

    result(): Result {
        return this.data.result;
    }

    stay() : Hand {
        return new Hand({...this.data, isStaying: true});
    }

    isStaying() : boolean {
        return this.data.isStaying;
    }

    player() : Player {
        return this.data.player;
    }

    bet() : number {
        return this.data.bet;
    }

    cards(): Array<Card> {
        return this.data.cards;
    }

    highestTotal() : number {
        var total = 0;
        for (let card of this.data.cards) {
            var val = Math.min(card.value, 10);
            if (val === 1 && total + 11 <= 21) {
                val = 11;
            }
            total += val;
        }
        if (total > 21) {
            total = this.lowestTotal();
        }
        return total;
    }

    lowestTotal() : number {
        var total = 0;
        for (let card of this.data.cards) {
            total += Math.min(card.value, 10);
        }
        return total;
    }

    bestTotal() : number {
        return (this.highestTotal() <= 21 ? this.highestTotal() : this.lowestTotal());
    }

    isBusted() : boolean {
        return this.lowestTotal() > 21;
    }

    isBlackjack() : boolean {
        return this.highestTotal() === 21 && this.data.cards.length === 2;
    }

    isDone() : boolean {
        return this.isBusted() || this.isBlackjack();
    }
}