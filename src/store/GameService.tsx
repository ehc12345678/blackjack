import { Game } from "./Game";
import { Player } from "./Player";
import { HandService } from "./HandService";
import { State } from "./State";
import { Hand } from "./Hand";

export class GameService {
    handService: HandService;

    constructor() {
        this.handService = new HandService();
    }

    createGame(state: State) : State {
        var currentGame = new Game();
        return this.startGame({...state, currentGame});
    }

    addPlayer(state: State, player: Player) : State {
        var { currentGame } = state;
        currentGame = currentGame.addPlayer(player);
        return { ...state, currentGame };
    }

    removePlayer(state: State, player: Player) : State {
        var { currentGame } = state;
        currentGame = currentGame.removePlayer(player);
        return { ...state, currentGame };
    }

    startGame(state: State) : State {
        var { currentGame } = state;
        if (currentGame.players.length === 0) {
            return state;
        }
        return this.getHandService().startTurn(state);
    }

    getHandService() : HandService {
        return this.handService;
    }

    getHandsForPlayer(state: State, player: Player) : Array<Hand> {
        var hands = state.playersHands.filter(h => h.player().id() === player.id());
        return hands;
    }
}