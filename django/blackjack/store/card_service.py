from blackjack.state.card import Card
from blackjack.store.deck_shoe import DeckShoe

NUM_DECKS_IN_SHOE = 7
class CardService:
    def __init__(self) -> None:
        self.deckShoe = DeckShoe(NUM_DECKS_IN_SHOE)

    def nextCard(self) -> Card:
        return self.deckShoe.getNextCard()
    
    def shuffle(self):
        self.deckShoe.shuffle()
        