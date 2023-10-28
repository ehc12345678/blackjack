import math
from blackjack.state.game import Game
from blackjack.state.player import Player
from blackjack.state.state import State
from blackjack.store.hand_service import HandService
from blackjack.store.user_service import UserService

CHIPS_PER_DOLLAR = 100

class GameService:    
    def __init__(self, handService: HandService, userService: UserService) -> None:
        self.handService = handService
        self.userService = userService

    def createGame(self, state: State) -> State:
        newState = state.clone()
        state.currentGame = Game()
        return self.startGame(newState)

    def addPlayer(self, state: State, playerId: str) -> State : 
        currentGame = state.currentGame.clone()

        player = self.userService.lookup(playerId)
        if (player != None):
            currentGame.players.append(player)

        newState = state.clone()
        newState.currentGame = currentGame
        return newState

    def removePlayer(self, state: State, player: str) -> State :
        currentGame = state.currentGame.clone()
        currentGame.players = list(filter(lambda p : p.id != player, currentGame.players))

        newState = state.clone()
        newState.currentGame = currentGame
        return newState

    def setCurrentBet(self, player: Player, currentBet: int) -> Player :
        newPlayer = player.clone()
        newPlayer.currentBet = currentBet
        return newPlayer

    def buyChips(self, player: Player, cash: int) -> Player :
        if (cash < player.cashBalance):
            cashBalance = player.cashBalance - cash
            chipBalance = player.chipBalance + cash * CHIPS_PER_DOLLAR

            newPlayer = player.clone()
            newPlayer.chipBalance = chipBalance
            newPlayer.cashBalance = cashBalance
            return newPlayer

        return player

    def cashOut(self, player: Player, chips: int) -> Player :
        if chips < player.chipBalance:
            cashBalance = player.cashBalance + math.trunc(chips / CHIPS_PER_DOLLAR)
            chipBalance = player.chipBalance - chips

            newPlayer = player.clone()
            newPlayer.chipBalance = chipBalance
            newPlayer.cashBalance = cashBalance
            return newPlayer

        return player

    def startGame(self, state: State) -> State :
        return state

    def getHandService(self) -> HandService :
        return self.handService

    def changeBet(self, state: State, id: str, bet: int) -> State : 
        player = self.userService.lookup(id)
        if player != None:
            return self.userService.modifyPlayer(state, self.setCurrentBet(player, bet))
        return state
        