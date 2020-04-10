import { Game } from './Game';
import { Hand, Result } from './Hand';
import { Player } from './Player';

export interface State {
  readonly currentGame: Game;
  readonly playersHands: Array<Hand>;
  readonly dealersHand: Hand;
  readonly activeHand: number;
  readonly activeUsers: Array<Player>;
  readonly turnIsGoing: boolean;
}

export const defaultState = {
  currentGame: { players: [] } as Game,
  playersHands: [],
  dealersHand: {
    cards: [],
    player: 'dealer',
    bet: 0,
    isStaying: false,
    result: Result.PLAYING,
  } as Hand,
  activeHand: 0,
  activeUsers: [],
  turnIsGoing: false,
} as State;
