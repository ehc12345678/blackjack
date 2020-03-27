import { Game } from "./Game";
import { Hand } from "./Hand";
import { User } from "./User";

export type State = {
    readonly currentGame: Game;
    readonly playersHands: Array<Hand>;
    readonly dealersHand: Hand;
    readonly activeHand: number;
    readonly activeUsers: Map<String, User>;
    readonly turnIsGoing: boolean;
}
