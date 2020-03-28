import { Game } from '../../client/src/store/Game';
import { Player } from "../../client/src/store/Player";
import { HandService } from "./HandService";
import { State } from "../../client/src/store/State";
import { Hand } from "../../client/src/store/Hand";

const CHIPS_PER_DOLLAR = 100;

export class GameService {
    handService: HandService;

    constructor() {
        this.handService = new HandService();
    }

    createGame(state: State) : State {
        var currentGame = {players: []};
        return this.startGame({...state, currentGame});
    }

    addPlayer(state: State, player: Player) : State {
        var { currentGame } = state;
        var players = [...currentGame.players, player];
        currentGame = {...currentGame, players};
        return { ...state, currentGame };
    }

    removePlayer(state: State, player: Player) : State {
        var { currentGame } = state;
        var players = currentGame.players.filter(p => p.id !== player.id);
        currentGame = {...currentGame, players};
        return { ...state, currentGame };
    }

    modifyPlayer(game: Game, player: Player) : Game {
        return this.handService.modifyPlayer(game, player);
    }

    public setCurrentBet(player: Player, currentBet: number) : Player {
        return {...player, currentBet};
    }

    public buyChips(player: Player, cash: number) : Player {
        if (cash < player.cashBalance) {
            var cashBalance = player.cashBalance - cash;
            var chipBalance = player.chipBalance + (cash * CHIPS_PER_DOLLAR);
            return {...player, chipBalance, cashBalance};
        }
        return player;
    }

    public cashOut(player: Player, chips: number) : Player {
        if (chips < player.chipBalance) {
            var cashBalance = player.cashBalance + (chips / CHIPS_PER_DOLLAR);
            var chipBalance = player.chipBalance - chips;
            return {...player, chipBalance, cashBalance};
        }
        return player;
    }

    startGame(state: State) : State {
        var { currentGame } = state;
        if (currentGame.players.length === 0) {
            var players : Array<Player>;
            players = state.activeUsers.map(user => {
                return {id: user.id, name: user.name, currentBet: 40, chipBalance: 5000, cashBalance: 100} as Player;
            });            
            currentGame = {...currentGame, players};
            return {...state, currentGame};
        }
        return state;
    }

    getHandService() : HandService {
        return this.handService;
    }

    changeBet(state: State, player: Player, bet: number) {
        var { currentGame } = state;
        currentGame = this.modifyPlayer(currentGame, this.setCurrentBet(player, bet));
        return { ...state, currentGame };
    }
}