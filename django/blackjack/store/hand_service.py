import math
from blackjack.state.card import UNKNOWN_CARD, Card
from blackjack.state.hand import Hand, HandHelper, Result
from blackjack.state.player import Player
from blackjack.state.state import State
from blackjack.store.card_service import CardService
from blackjack.store.user_service import UserService


DEALER_ID = 'dealer'

class HandService:
    def __init__(self, cardService: CardService, userService: UserService) -> None:
        self.cardService = cardService
        self.userService = userService
        self.helper = HandHelper()

    def startTurn(self, state: State) -> State: 
        playersHands: list[Hand] = []
        dealersHand = self.create(DEALER_ID, 0)
        dealersHand = self.addCard(dealersHand, UNKNOWN_CARD)
        currentGame = state.currentGame

        for player in currentGame.players:
            hand = self.create(player.id, player.currentBet)
            hand = self.addCard(hand, self.cardService.nextCard())
            hand = self.addCard(hand, self.cardService.nextCard())
            playersHands.append(hand)

        dealersHand = self.addCard(dealersHand, self.cardService.nextCard())

        newState = state.clone()
        newState.currentGame = currentGame
        newState.playersHands = playersHands
        newState.dealersHand = dealersHand
        newState.turnIsGoing = True
        newState.activeUsers = state.activeUsers
        return self.setActiveHand(newState, 0)

    def create(self, playerId: str, currentBet: int) -> Hand :
        newHand = Hand()
        newHand.player = playerId
        newHand.bet = currentBet
        return newHand

    def getActiveHand(self, state: State) -> Hand: 
        return state.playersHands[state.activeHand]

    def hitActiveHand(self, state: State) -> State: 
        hand = self.addCard(self.getActiveHand(state), self.cardService.nextCard())
        newState = state.clone()
        newState.playersHands = self.replace(state.playersHands, state.activeHand, hand)
        if self.helper.isDone(hand):
            newState = self.nextActiveHand(newState)
        return newState

    def stayActiveHand(self, state: State) -> State: 
        hand = self.stay(self.getActiveHand(state))
        newState = state.clone()
        newState.playersHands = self.replace(state.playersHands, state.activeHand, hand)
        return self.nextActiveHand(newState)

    def doubleDownActiveHand(self, state: State) -> State: 
        hand = self.getActiveHand(state)
        newState = state
        if len(hand.cards) == 2:
            # double down is to give the active hand a card, double the bet, and stay
            newHand = self.addCard(hand, self.cardService.nextCard())
            newHand.bet = newHand.bet * 2
            newState = newState.clone()
            newState.playersHands =  self.replace(newState.playersHands, newState.activeHand, newHand) 
            newState = self.stayActiveHand(newState)

        return newState

    def nextActiveHand(self, state: State) -> State: 
        return self.setActiveHand(state, state.activeHand + 1)

    def setActiveHand(self, state: State, activeHand: int) -> State:
        newState = state.clone()
        newState.activeHand = activeHand
        if not self.anotherHandExists(newState):
            newState = self.giveDealerControl(newState)
        else:
            hand = self.getActiveHand(newState)
            if self.helper.isDone(hand):
                newState = self.nextActiveHand(newState)

        return newState

    def anotherHandExists(self, state: State) -> bool : 
        return state.activeHand < len(state.playersHands)

    def giveDealerControl(self, state: State) -> State : 
        print('Dealer took control')
        
        # remove the unknown card and add a real one
        cards = list(filter(lambda card: card != UNKNOWN_CARD, state.dealersHand.cards))
        cards.append(self.cardService.nextCard())

        dealersHand = state.dealersHand.clone()
        dealersHand.cards = cards
        
        newState = state.clone()
        newState.dealersHand = dealersHand
        if self.helper.isBlackjack(dealersHand):
            newState = self.endTurn(newState)

        return newState

    def dealerTakesCard(self, state: State) -> State :
        dealersHand = state.dealersHand
        if self.helper.highestTotal(dealersHand) < 17:
            dealersHand = self.addCard(dealersHand, self.cardService.nextCard())

        newState = state.clone()
        newState.dealersHand = dealersHand
        return newState

    def splitActiveHand(self, state: State) -> State : 
        newState = state
        hand = self.getActiveHand(state)
        if self.helper.canSplit(hand):
            hand1 = hand.clone()
            hand1.cards = [hand.cards[0], self.cardService.nextCard()]

            hand2 = hand.clone()
            hand2.cards = [hand.cards[1], self.cardService.nextCard()]

            newState = state.clone()
            newState.playersHands = newState.playersHands[0:newState.activeHand] + [hand1,hand2] + newState.playersHands[newState.activeHand:]
        return newState

    def endTurn(self, state: State) -> State:
        print('End turn')
        playersHands: list[Hand] = []
        for hand in state.playersHands: 
            hand = self.setResult(hand, self.handResult(hand, state.dealersHand))
            playersHands.append(hand)
            player = self.lookupPlayer(state, hand.player)
            match hand.result:
                case Result.Loss:
                    state = self.userService.modifyPlayer(state, self.removeChips(player, hand.bet))
                case Result.Win:
                    state = self.userService.modifyPlayer(state, self.addChips(player, hand.bet))
                case Result.Blackjack:
                    state = self.userService.modifyPlayer(state, self.addChips(player, math.trunc(hand.bet * 1.5)))
                case Result.Push:
                    pass
                case Result.Playing:
                    pass

        newState = state.clone()
        newState.turnIsGoing = False
        return newState

    def handResult(self, hand: Hand, dealersHand: Hand) -> Result:  
        if self.helper.isBusted(hand):
            return Result.Loss
        elif self.helper.isBlackjack(dealersHand): 
            return Result.Push if self.helper.isBlackjack(hand) else Result.Loss
        elif self.helper.isBlackjack(hand):
            return Result.Blackjack
        elif self.helper.isBusted(dealersHand): 
            return Result.Win
        
        dealerTotal = self.helper.bestTotal(dealersHand)
        handTotal = self.helper.bestTotal(hand)
        if dealerTotal and dealerTotal > handTotal:
            return Result.Loss
        elif dealerTotal == handTotal: 
            return Result.Push
        return Result.Win

    def addCard(self, hand: Hand, card: Card) -> Hand :
        newHand = hand.clone()
        newHand.cards = hand.cards.copy()
        newHand.cards.append(card)
        return newHand

    def setResult(self, hand: Hand, result: Result) -> Hand :
        newHand = hand.clone()
        newHand.result = result
        return newHand

    def stay(self, hand: Hand) -> Hand :
        newHand = hand.clone()
        newHand.isStaying = True
        return newHand

    def replace(self, arr: list[Hand], index: int, replaceItem: Hand) -> list[Hand]:
        newArray: list[Hand] = []
        for i in range(0, len(arr)):
            newArray.append(replaceItem if i == index else arr[i])
        return newArray

    def addChips(self, player: Player, chips: int) -> Player :
        chipBalance = player.chipBalance + chips
        print(f'Adding {chips} to {player.name} new balance={chipBalance}')

        newPlayer = player.clone()
        newPlayer.chipBalance = chipBalance
        return newPlayer

    def removeChips(self, player: Player, chips: int) -> Player:
        if player.chipBalance >= chips:
            return self.addChips(player, -chips)
        return player

    def lookupPlayer(self, state: State, id: str) -> Player: 
        player = next(filter(lambda p: p.id == id, state.activeUsers), None)
        if player == None:
            raise Exception('Something bad happened, could not find player ' + id)
        return player