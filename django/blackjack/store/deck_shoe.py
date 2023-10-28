from blackjack.state.card import Card
from blackjack.store.deck import Deck

class DeckShoe(Deck):
    def __init__(self, numDecks: int) -> None:
        super().__init__()
        for _ in range(0, numDecks - 1):
            self.addDefaultCards()
        self.shuffle()

    def shuffle(self):
        ret = super().shuffle()
        self.cardOnTop = 0
        return ret

    def getNextCard(self) -> Card:
        if self.cardOnTop >= len(self.cards):
            self.shuffle()
        card = self.cards[self.cardOnTop]
        self.cardOnTop = self.cardOnTop + 1
        return card
