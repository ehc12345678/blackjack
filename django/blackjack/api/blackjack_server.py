import json
from threading import Timer

from blackjack.state.hand import HandHelper
from blackjack.state.state import State
from blackjack.store.hand_service import HandService

class BlackjackEmitter:
  # listeners: Array<WebSocket>

    def __init__(self) -> None:
        self.listeners = []

    def emit(self, message: str):
        #for listener in self.listeners:
            # ws.send(message)
        pass

class BlackjackServer:
    # state: State
    # emitter: BlackjackEmitter

    def __init__(self, handService: HandService) -> None:
        self.state = State()
        self.emitter = BlackjackEmitter()
        self.handHelper = HandHelper()
        self.theHandService = handService

    def setState(self, state: State) -> str :
        self.state = state
        strState = json.dumps(self.state.toDict())
        self.emitter.emit(strState)

        if (self.isDealerInControl(state)):
            self.doDealer(state)
        return strState
    
    def getState(self) -> State:
        return self.state

    def doDealer(self, state: State):
        def timeoutFn():
            newState = state
            if self.isDealerInControl(state) and self.handHelper.bestTotal(state.dealersHand) < 17:
                newState = self.theHandService.dealerTakesCard(newState)
                self.doDealer(newState)
            else:
                newState = self.theHandService.endTurn(state)
            self.setState(newState)

        t = Timer(1, timeoutFn)
        t.start()

    def isDealerInControl(self, state: State) -> bool : 
        return state.turnIsGoing and state.activeHand >= len(state.playersHands)and not self.handHelper.isDone(state.dealersHand)
