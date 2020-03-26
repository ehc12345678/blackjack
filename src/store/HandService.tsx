import { Hand } from './Hand';
import { DealersHand } from './DealersHand';
import { UnknownCard } from './Card';
import { CardService } from './CardService';
import { State } from './State';

export enum Result { LOSS = "Loss", PUSH = "Push", WIN = "Win", BLACKJACK = "Blackjack", PLAYING = "Playing" };
export class HandService {
    cardService: CardService;
    
    constructor() {
        this.cardService = new CardService();
    }

    startTurn(state: State) : State {
        const playersHands = [];
        var dealersHand = DealersHand.create();

        dealersHand = dealersHand.addCard(UnknownCard);
        const { currentGame } = state;
        for (let player of currentGame.players) {
            var hand = Hand.create(player, player.currentBet());
            hand = hand.addCard(this.cardService.nextCard()).addCard(this.cardService.nextCard());
            playersHands.push(hand);
        }
        dealersHand = dealersHand.addCard(this.cardService.nextCard());
        return this.setActiveHand({ ...state, currentGame, playersHands, dealersHand, turnIsGoing: true }, 0);
    }

    getActiveHand(state: State) : Hand {
       return state.playersHands[state.activeHand];
    }

    hitActiveHand(state: State) : State {
        const hand = this.getActiveHand(state).addCard(this.cardService.nextCard());
        var newState = { ...state, playersHands: this.replace(state.playersHands, state.activeHand, hand) };
        if (hand.isDone()) {
            newState = this.nextActiveHand(newState);
        }
        return newState;
    }

    stayActiveHand(state: State) : State {
        const hand = this.getActiveHand(state).stay();
        var newState = { ...state, playersHands: this.replace(state.playersHands, state.activeHand, hand) };
        return this.nextActiveHand(newState);
    }

    nextActiveHand(state: State) : State {
        return this.setActiveHand(state, state.activeHand + 1);
    }

    setActiveHand(state: State, activeHand: number) {
        var newState = {...state, activeHand};
        if (!this.anotherHandExists(newState)) {
            newState = this.giveDealerControl(newState);
        } else {
            var hand = this.getActiveHand(newState);
            if (hand.isDone()) {
                newState = this.nextActiveHand(newState);
            }
        }
        return newState;
    }

    anotherHandExists(state: State) : boolean {
        return state.activeHand < state.playersHands.length;
    }

    giveDealerControl(state: State) : State {
        var dealersHand = state.dealersHand.replaceUnknownCard(this.cardService.nextCard());
        return this.endTurn({...state, dealersHand});
    }

    dealerTakesCard(state: State) : State {
        var { dealersHand } = state;
        if (dealersHand.shouldHit()) {
            dealersHand = dealersHand.addCard(this.cardService.nextCard());
        }
        return { ...state, dealersHand };
    }

    splitActiveHand(state: State) {
        var newState = state;
        var hand = this.getActiveHand(state);
        if (hand.canSplit()) {
            var hand1 = 
                Hand.create(hand.player(), hand.bet()).
                    addCard(hand.cards()[0]).
                    addCard(this.cardService.nextCard());
            var hand2 = 
                Hand.create(hand.player(), hand.bet()).
                    addCard(hand.cards()[1]).
                    addCard(this.cardService.nextCard());
            
            var playersHands = newState.playersHands.slice();
            playersHands.splice(newState.activeHand, 1, hand1, hand2);
            newState = this.setActiveHand({...newState, playersHands}, newState.activeHand);
        }
        return newState;
    }

    endTurn(state: State) : State {
        var { currentGame } = state;
        var playersHands = [];
        for (let hand of state.playersHands) {
            hand = hand.setResult(this.handResult(hand, state.dealersHand));
            playersHands.push(hand);
            switch (hand.result()) {
                case Result.LOSS:
                    currentGame = currentGame.modifyPlayer(hand.player().removeChips(hand.bet()));
                    break;
                case Result.PUSH:
                default:    
                    break;
                case Result.WIN:
                    currentGame = currentGame.modifyPlayer(hand.player().addChips(hand.bet()));
                    break;
                case Result.BLACKJACK:
                    currentGame = currentGame.modifyPlayer(hand.player().addChips(hand.bet() * 1.5));
                    break;
            }
        }
        return {...state, currentGame, playersHands, turnIsGoing: false};
    }

    handResult(hand: Hand, dealersHand: DealersHand) : Result {
        if (hand.isBusted()) {
            return Result.LOSS;
        } else if (dealersHand.isBlackjack()) {
            return hand.isBlackjack() ? Result.PUSH : Result.LOSS;
        } else if (hand.isBlackjack()) {
            return Result.BLACKJACK;
        } else if (dealersHand.isBusted()) {
            return Result.WIN;
        } 
        const dealerTotal = dealersHand.bestTotal();
        const handTotal = hand.bestTotal();
        if (dealerTotal && dealerTotal > handTotal) {
            return Result.LOSS;
        } else if (dealerTotal === handTotal) {
            return Result.PUSH
        } 
        return Result.WIN;
    }

    replace<T>(arr: Array<T>, index: number, replaceItem: T) {
        return arr.map((item, i) => {
            if (i !== index) {
              // This isn't the item we care about - keep it as-is
              return item;
            }
        
            return replaceItem;
          });
    }
}