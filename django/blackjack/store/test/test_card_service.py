from django.test import TestCase

from blackjack.state.state import State
from blackjack.store.card_service import NUM_DECKS_IN_SHOE, CardService

class CardServiceTest(TestCase):
    def test_init(self):
        card_service = CardService()
        self.assertEquals(52 * NUM_DECKS_IN_SHOE, len(card_service.deckShoe.cards))

    def test_next_card(self):
        card_service = CardService()
        card1 = card_service.nextCard()
        card2 = card_service.nextCard()
        # these could actually be exactly the same card randomly
        self.assertNotEqual(None, card1)
        self.assertNotEqual(None, card2)

    def test_shuffle(self):
        card_service = CardService()
        card_service.shuffle()
