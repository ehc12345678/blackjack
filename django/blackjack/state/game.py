from typing import Any

from blackjack.state.player import Player


class Game:
    players: list[Player]

    def __init__(self) -> None:
        self.players = []

    def clone(self):
         newGame = Game()
         newGame.players = self.players.copy()
         return newGame
    
    def toDict(self) -> dict[str, Any]:
        return {
            "players": self.players
        }