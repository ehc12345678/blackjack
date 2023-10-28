class Player:
    chipBalance: int
    cashBalance: int
    name: str
    id: str
    currentBet: int
    
    def __init__(self) -> None:    
        self.chipBalance = 0
        self.cashBalance = 0
        self.name = ""
        self.id = ""
        self.currentBet = 0

    def clone(self):
        newPlayer = Player()
        newPlayer.chipBalance = self.chipBalance
        newPlayer.cashBalance = self.cashBalance
        newPlayer.name = self.name
        newPlayer.id = self.id
        newPlayer.currentBet = self.currentBet
        return newPlayer
    
    def toDict(self):
        return {
            "chipBalance": self.chipBalance,
            "cashBalance": self.cashBalance,
            "name": self.name,
            "id": self.id,
            "currentBet": self.currentBet,
        } 

    def __str__(self):
        return f"Player {self.toDict()}"
