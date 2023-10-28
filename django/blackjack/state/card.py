class Card:
    suit: str
    card: str
    value: int
    
    def __init__(self, suit: str, card: str, value: int):
        self.suit = suit
        self.card = card
        self.value = value

    def __str__(self) -> str:
        return f"{self.toDict()}"
    
    def toDict(self):
        return {
            "suit": self.suit,
            "card": self.card,
            "value": self.value
        }

UNKNOWN_CARD = Card("U", "0", 0)