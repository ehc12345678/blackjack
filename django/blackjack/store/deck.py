
from blackjack.models import Card as CardModel
import random

from blackjack.state.card import Card

class Deck:
    cards: list[Card]

    def __init__(self) -> None:
        self.cards = list()
        self.addDefaultCards()
        self.shuffle()

    def addDefaultCards(self):
        self.cards.extend(map(lambda c: Card(c.suit.short_form, c.card.short_form, c.card.value), CardModel.objects.all()))

    def shuffle(self):
        SHUFFLE_FACTOR = 1000    
        deck_size = len(self.cards)
        for i in range(0, deck_size):
            self.swap(self.cards, i, random.randint(0, deck_size - 1))
        for i in range(deck_size - 1, -1, -1):
            self.swap(self.cards, i, random.randint(0, deck_size - 1))
        for i in range(0, SHUFFLE_FACTOR):
            self.swap(self.cards, random.randint(0, deck_size - 1), random.randint(0, deck_size - 1))

    def swap(self, cards: list[Card], item1: int, item2: int):
        tmp = cards[item1]
        cards[item1] = cards[item2]
        cards[item2] = tmp