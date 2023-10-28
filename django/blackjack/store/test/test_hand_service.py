from django.test import TestCase
from blackjack.state.card import Card, UNKNOWN_CARD
from blackjack.state.hand import Hand, Result

from blackjack.state.state import State
from blackjack.store.card_service import CardService
from blackjack.store.game_service import GameService
from blackjack.store.hand_service import HandService
from blackjack.store.user_service import UserService

class HandServiceTest(TestCase):
    def setUp(self):
        state = State()
        userService = UserService()
        
        userService.signUp(state, "p1", "Player1")
        userService.signUp(state, "p2", "Player2")
        userService.signUp(state, "p3", "Player3")
        state = userService.login(state, "Player1")
        state = userService.login(state, "Player2")
        state = userService.login(state, "Player3")

        cardService = CardService()
        handService = HandService(cardService, userService)
        gameService = GameService(handService, userService)
        state = gameService.addPlayer(state, "Player1")
        state = gameService.addPlayer(state, "Player2")
        state = gameService.addPlayer(state, "Player3")

        self.state = state
        self.handService = handService

    def test_start_turn(self):
        newState = self.handService.startTurn(self.state)

        # Lots of stuff happens on a start turn
        self.assertEqual(3, len(newState.currentGame.players))
        for hand in newState.playersHands:
            self.assertEquals(2, len(hand.cards))
        self.assertEquals(2, len(newState.dealersHand.cards))
        self.assertTrue(newState.turnIsGoing)

    def test_hit_active_hand(self):
        newState = self.handService.startTurn(self.state)

        activeHandIndex = newState.activeHand
        hand = self.handService.getActiveHand(newState)
        newState = self.handService.hitActiveHand(newState)

        # we could have busted, so we need to check the old active hand
        newActiveHand = newState.playersHands[activeHandIndex]
        self.assertEquals(len(hand.cards) + 1, len(newActiveHand.cards))

        # hit until we bust, which should set the active hand to the next one
        newState = self.handService.startTurn(self.state)
        while not self.handService.helper.isDone(newState.playersHands[activeHandIndex]):
            newState= self.handService.hitActiveHand(newState)
        self.assertNotEquals(activeHandIndex, newState.activeHand)

    def test_stay_active_hand(self):
        newState = self.handService.startTurn(self.state)

        activeHandIndex = newState.activeHand
        newState = self.handService.stayActiveHand(newState)
        self.assertNotEquals(activeHandIndex, newState.activeHand)

    def test_double_down_hand(self):
        newState = self.handService.startTurn(self.state)

        activeHandIndex = newState.activeHand
        activeHand = self.handService.getActiveHand(newState)
        newState = self.handService.doubleDownActiveHand(newState)
        cmpHand = newState.playersHands[activeHandIndex]
        self.assertEquals(cmpHand.bet, activeHand.bet * 2)
        self.assertEquals(3, len(cmpHand.cards))
        self.assertNotEquals(activeHandIndex, newState.activeHand)

    def test_next_active_until_dealer(self):
        newState = self.handService.startTurn(self.state)
        self.assertEquals(newState.activeHand, 0)
        newState = self.handService.nextActiveHand(newState)
        self.assertEquals(newState.activeHand, 1)
        newState = self.handService.nextActiveHand(newState)
        self.assertEquals(newState.activeHand, 2)

        # this gives the dealer control
        dealersHand = newState.dealersHand
        self.assertEquals(len(list(filter(lambda card: card == UNKNOWN_CARD, dealersHand.cards))), 1)
        newState = self.handService.nextActiveHand(newState)
        dealersHand = newState.dealersHand
        self.assertEquals(newState.activeHand, 3)
        self.assertEquals(len(list(filter(lambda card: card == UNKNOWN_CARD, dealersHand.cards))), 0)

    def test_end_turn(self):
        newState = self.handService.startTurn(self.state)
        newState = self.handService.giveDealerControl(newState)
        newState = self.handService.endTurn(newState)
        self.assertFalse(newState.turnIsGoing)

    def test_hand_results(self):
        def makeHand(*args):
            hand = Hand()
            for arg in args:
                hand = self.handService.addCard(hand, Card("S", "X", arg))
            return hand
            

        # bust
        dealersHand = makeHand(10, 8)

        hand = makeHand(10, 10, 5)
        self.assertEquals(Result.Loss, self.handService.handResult(hand, dealersHand))

        hand = makeHand(10, 1)
        dealersHand = makeHand(10, 1)
        self.assertEquals(Result.Push, self.handService.handResult(hand, dealersHand))

        dealersHand = makeHand(10, 7, 4)
        self.assertEquals(Result.Blackjack, self.handService.handResult(hand, dealersHand))

        hand = makeHand(10, 2)
        dealersHand = makeHand(10, 5, 10)
        self.assertEquals(Result.Win, self.handService.handResult(hand, dealersHand))

        hand = makeHand(10, 8)
        dealersHand = makeHand(10, 7)
        self.assertEquals(Result.Win, self.handService.handResult(hand, dealersHand))

        hand = makeHand(10, 7)
        dealersHand = makeHand(10, 8)
        self.assertEquals(Result.Loss, self.handService.handResult(hand, dealersHand))

        hand = makeHand(10, 7)
        dealersHand = makeHand(10, 7)
        self.assertEquals(Result.Push, self.handService.handResult(hand, dealersHand))
