from blackjack.store.card_service import CardService
from blackjack.store.game_service import GameService
from blackjack.store.hand_service import HandService
from blackjack.store.user_service import UserService
from blackjack.api.blackjack_server import BlackjackServer

class Services:
    def __init__(self) -> None:
        self.theCardService = CardService()
        self.theUserService = UserService()
        self.theHandService = HandService(self.theCardService, self.theUserService)
        self.theGameService = GameService(self.theHandService, self.theUserService)
        self.blackjackServer = BlackjackServer(self.theHandService)

ALL_SERVICES = None
ALL_SERVICES = Services() if ALL_SERVICES == None else ALL_SERVICES