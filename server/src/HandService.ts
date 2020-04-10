import {
  HandHelper,
  Hand,
  State,
  UnknownCard,
  Player,
  Result,
  Card,
} from './store';
import { CardService, theCardService } from './CardService';
import { UserService, theUserService } from './UserService';

export const DEALER_ID = 'dealer';
export const DEALER = { id: DEALER_ID } as Player;

const helper = new HandHelper();
export class HandService {
  cardService: CardService;
  userService: UserService;

  constructor() {
    this.cardService = theCardService;
    this.userService = theUserService;
  }

  startTurn(state: State): State {
    const playersHands = [];
    var dealersHand = this.create(DEALER_ID, 0);

    dealersHand = this.addCard(dealersHand, UnknownCard);
    const { currentGame } = state;
    for (let playerId of currentGame.players) {
      var player = this.lookupPlayer(state, playerId);
      var hand = this.create(playerId, player.currentBet);
      hand = this.addCard(hand, this.cardService.nextCard());
      hand = this.addCard(hand, this.cardService.nextCard());
      playersHands.push(hand);
    }
    dealersHand = this.addCard(dealersHand, this.cardService.nextCard());
    return this.setActiveHand(
      { ...state, currentGame, playersHands, dealersHand, turnIsGoing: true },
      0
    );
  }

  create(playerId: string, currentBet: number): Hand {
    return {
      player: playerId,
      bet: currentBet,
      cards: [],
      isStaying: false,
      result: Result.PLAYING,
    };
  }

  getActiveHand(state: State): Hand {
    return state.playersHands[state.activeHand];
  }

  hitActiveHand(state: State): State {
    const hand = this.addCard(
      this.getActiveHand(state),
      this.cardService.nextCard()
    );
    var newState = {
      ...state,
      playersHands: this.replace(state.playersHands, state.activeHand, hand),
    };
    if (helper.isDone(hand)) {
      newState = this.nextActiveHand(newState);
    }
    return newState;
  }

  stayActiveHand(state: State): State {
    const hand = this.stay(this.getActiveHand(state));
    var newState = {
      ...state,
      playersHands: this.replace(state.playersHands, state.activeHand, hand),
    };
    return this.nextActiveHand(newState);
  }

  doubleDownActiveHand(state: State): State {
    const hand = this.getActiveHand(state);
    var newState = state;
    if (hand.cards.length === 2) {
      // double down is to give the active hand a card, double the bet, and stay
      var newHand = this.addCard(hand, this.cardService.nextCard());
      newHand = { ...newHand, bet: newHand.bet * 2 };
      newState = {
        ...newState,
        playersHands: this.replace(
          newState.playersHands,
          newState.activeHand,
          newHand
        ),
      };
      newState = this.stayActiveHand(newState);
    }

    return newState;
  }

  nextActiveHand(state: State): State {
    return this.setActiveHand(state, state.activeHand + 1);
  }

  setActiveHand(state: State, activeHand: number) {
    var newState = { ...state, activeHand };
    if (!this.anotherHandExists(newState)) {
      newState = this.giveDealerControl(newState);
    } else {
      var hand = this.getActiveHand(newState);
      if (helper.isDone(hand)) {
        newState = this.nextActiveHand(newState);
      }
    }
    return newState;
  }

  anotherHandExists(state: State): boolean {
    return state.activeHand < state.playersHands.length;
  }

  giveDealerControl(state: State): State {
    console.log('Dealer took control');
    var cards = state.dealersHand.cards.filter((card) => card !== UnknownCard);
    cards.push(this.cardService.nextCard());
    var dealersHand = { ...state.dealersHand, cards };
    return { ...state, dealersHand };
  }

  dealerTakesCard(state: State): State {
    var { dealersHand } = state;
    if (helper.highestTotal(dealersHand) < 17) {
      dealersHand = this.addCard(dealersHand, this.cardService.nextCard());
    }
    return { ...state, dealersHand };
  }

  splitActiveHand(state: State) {
    var newState = state;
    var hand = this.getActiveHand(state);
    if (helper.canSplit(hand)) {
      var hand1 = {
        ...hand,
        cards: [hand.cards[0], this.cardService.nextCard()],
      } as Hand;
      var hand2 = {
        ...hand,
        cards: [hand.cards[1], this.cardService.nextCard()],
      } as Hand;

      var playersHands = newState.playersHands.slice();
      playersHands.splice(newState.activeHand, 1, hand1, hand2);
      newState = this.setActiveHand(
        { ...newState, playersHands },
        newState.activeHand
      );
    }
    return newState;
  }

  endTurn(state: State): State {
    var playersHands = [];
    for (let hand of state.playersHands) {
      hand = this.setResult(hand, this.handResult(hand, state.dealersHand));
      playersHands.push(hand);
      var player = this.lookupPlayer(state, hand.player);
      switch (hand.result) {
        case Result.LOSS:
          state = this.userService.modifyPlayer(
            state,
            this.removeChips(player, hand.bet)
          );
          break;
        case Result.PUSH:
        default:
          break;
        case Result.WIN:
          state = this.userService.modifyPlayer(
            state,
            this.addChips(player, hand.bet)
          );
          break;
        case Result.BLACKJACK:
          state = this.userService.modifyPlayer(
            state,
            this.addChips(player, hand.bet * 1.5)
          );
          break;
      }
    }
    return { ...state, playersHands, turnIsGoing: false };
  }

  handResult(hand: Hand, dealersHand: Hand): Result {
    if (helper.isBusted(hand)) {
      return Result.LOSS;
    } else if (helper.isBlackjack(dealersHand)) {
      return helper.isBlackjack(hand) ? Result.PUSH : Result.LOSS;
    } else if (helper.isBlackjack(hand)) {
      return Result.BLACKJACK;
    } else if (helper.isBusted(dealersHand)) {
      return Result.WIN;
    }
    const dealerTotal = helper.bestTotal(dealersHand);
    const handTotal = helper.bestTotal(hand);
    if (dealerTotal && dealerTotal > handTotal) {
      return Result.LOSS;
    } else if (dealerTotal === handTotal) {
      return Result.PUSH;
    }
    return Result.WIN;
  }

  static create(player: Player, bet: number): Hand {
    return {
      cards: [],
      player: player.id,
      bet,
      isStaying: false,
      result: Result.PLAYING,
    };
  }

  addCard(hand: Hand, card: Card): Hand {
    return { ...hand, cards: [...hand.cards, card] };
  }

  setResult(hand: Hand, result: Result): Hand {
    return { ...hand, result };
  }

  stay(hand: Hand): Hand {
    return { ...hand, isStaying: true };
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

  public addChips(player: Player, chips: number): Player {
    var chipBalance = player.chipBalance + chips;
    console.log(
      'Adding ' + chips + ' to ' + player.name + ' new balance=' + chipBalance
    );
    return { ...player, chipBalance };
  }

  public removeChips(player: Player, chips: number): Player {
    if (player.chipBalance >= chips) {
      return this.addChips(player, -chips);
    }
    return player;
  }

  lookupPlayer(state: State, id: string): Player {
    var player = state.activeUsers.find((player) => player.id === id);
    if (player === undefined) {
      throw 'Something bad happened, could not find player ' + id;
    }
    return player;
  }
}

export const theHandService = new HandService();
