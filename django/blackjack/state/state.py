from typing import Any
from blackjack.state.game import Game
from blackjack.state.hand import Hand, Result
from blackjack.state.player import Player

class State:
    currentGame: Game
    playersHands: list[Hand]
    dealersHand: Hand
    activeHand: int
    activeUsers: list[Player]
    turnIsGoing: bool

    def __init__(self) -> None:
        self.currentGame = Game()
        self.playersHands = []
        self.dealersHand = Hand()
        self.activeHand = 0
        self.activeUsers = []
        self.turnIsGoing = False

        self.dealersHand.player = "dealer"
        self.dealersHand.result = Result.Playing

    def clone(self):
        newState = State()
        newState.currentGame = self.currentGame.clone()
        newState.playersHands = list(map(lambda p: p.clone(), self.playersHands))
        newState.dealersHand = self.dealersHand.clone()
        newState.activeHand = self.activeHand
        newState.activeUsers =  list(map(lambda p: p.clone(), self.activeUsers))
        newState.turnIsGoing = self.turnIsGoing
        return newState
    
    def toDict(self) -> dict[str, Any]:
        return {
            "currentGame": self.currentGame.toDict(),
            "playersHands": list(map(lambda p: p.toDict(), self.playersHands)),
            "dealersHands": self.dealersHand.toDict(),
            "activeHand": self.activeHand,
            "activeUsers": self.activeUsers,
            "turnIsGoing": self.turnIsGoing
        }        

    def __str__(self):
        return f'State: {self.toDict()}'