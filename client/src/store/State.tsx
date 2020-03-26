import { Game } from "./Game";
import { DealersHand } from "./DealersHand";
import { Hand } from "./Hand";
import { User } from "./UserService";

export type State = {
    readonly currentGame: Game;
    readonly playersHands: Array<Hand>;
    readonly dealersHand: DealersHand;
    readonly activeHand: number;
    readonly activeUsers: Map<String, User>;
    readonly currentUser: User | null;
    readonly turnIsGoing: boolean;
}

export const defaultState : State = {
    currentGame: new Game(),
    playersHands: new Array<Hand>(),
    dealersHand: DealersHand.create(),
    activeHand: 0,
    activeUsers: new Map<String, User>(),
    currentUser: null,
    turnIsGoing: false
}