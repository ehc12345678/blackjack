import { Game } from "./Game";
import { Hand } from "./Hand";
import { Player } from "./Player";

export type State = {
    readonly currentGame: Game;
    readonly playersHands: Array<Hand>;
    readonly dealersHand: Hand;
    readonly activeHand: number;
    readonly activeUsers: Array<Player>;
    readonly turnIsGoing: boolean;
}
