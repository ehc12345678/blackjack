from blackjack.state.player import Player
from blackjack.state.state import State

class UserService:
    registeredUsers: dict[str, Player]

    def __init__(self) -> None:
        self.registeredUsers = {}

    def signUp(self, state: State, name: str, loginId: str) -> str :
        id = loginId
        newPlayer = Player()

        newPlayer.id = loginId
        newPlayer.name = name
        newPlayer.currentBet = 80
        newPlayer.chipBalance = 5000
        newPlayer.cashBalance = 100
        self.registeredUsers[id] = newPlayer
        return id
    
    def login(self, state: State, id: str) -> State :
        user = self.lookup(id)
        if user and not self.isLoggedIn(state, id):
            activeUsers = state.activeUsers.copy()
            activeUsers.append(user)
            newState = state.clone()
            newState.activeUsers = activeUsers
            return newState
        return state

    def logout(self, state: State, id: str) -> State :
        user = self.lookup(id)
        if user != None:
            activeUsers = list(filter(lambda u: u.id != user.id, state.activeUsers))
        
            newState = state.clone()
            newState.activeUsers = activeUsers
            return newState
        return state

    def lookup(self, id: str) -> Player | None :
        if id in self.registeredUsers:
            return self.registeredUsers[id]

        print(f'Could not find user with id={id}')
        return None

    def isLoggedIn(self, state: State, loginId: str) -> bool :
        return next(filter(lambda u: u.id == loginId, state.activeUsers), None) != None

    def modifyPlayer(self, state: State, player: Player) -> State :
        activeUsers = list(map(lambda p: player if p.id == player.id else p, state.activeUsers))
        self.registeredUsers[player.id] = player

        newState = state.clone()
        newState.activeUsers = activeUsers
        return newState