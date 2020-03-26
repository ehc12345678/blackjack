export enum Suit {
    Heart = 'H', Spade = 'S', Diamond = 'D', Club = 'C', Unknown = '?'
};
export type Card = {
    readonly value: number;
    readonly suit: Suit;
};
export const UnknownCard = {value: 0, suit: Suit.Unknown} as Card;