import { Game } from '../../client/src/store/Game';
import { Player } from '../../client/src/store/Player';
import { HandService, theHandService } from './HandService';
import { State } from '../../client/src/store/State';
import { theUserService, UserService } from './UserService';

const CHIPS_PER_DOLLAR = 100;

export class GameService {
  handService: HandService;
  userService: UserService;

  constructor() {
    this.handService = theHandService;
    this.userService = theUserService;
  }

  createGame(state: State): State {
    var currentGame = { players: [] };
    return this.startGame({ ...state, currentGame });
  }

  addPlayer(state: State, player: string): State {
    var { currentGame } = state;
    var players = [...currentGame.players, player];
    currentGame = { ...currentGame, players };
    return { ...state, currentGame };
  }

  removePlayer(state: State, player: string): State {
    var { currentGame } = state;
    var players = currentGame.players.filter((p) => p !== player);
    currentGame = { ...currentGame, players };
    return { ...state, currentGame };
  }

  public setCurrentBet(player: Player, currentBet: number): Player {
    return { ...player, currentBet };
  }

  public buyChips(player: Player, cash: number): Player {
    if (cash < player.cashBalance) {
      var cashBalance = player.cashBalance - cash;
      var chipBalance = player.chipBalance + cash * CHIPS_PER_DOLLAR;
      return { ...player, chipBalance, cashBalance };
    }
    return player;
  }

  public cashOut(player: Player, chips: number): Player {
    if (chips < player.chipBalance) {
      var cashBalance = player.cashBalance + chips / CHIPS_PER_DOLLAR;
      var chipBalance = player.chipBalance - chips;
      return { ...player, chipBalance, cashBalance };
    }
    return player;
  }

  startGame(state: State): State {
    return state;
  }

  getHandService(): HandService {
    return this.handService;
  }

  changeBet(state: State, id: string, bet: number) {
    var player = this.userService.lookup(id);
    if (player != null) {
      state = this.userService.modifyPlayer(
        state,
        this.setCurrentBet(player, bet)
      );
    }
    return state;
  }
}
export const theGameService = new GameService();
