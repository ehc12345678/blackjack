from django.shortcuts import get_object_or_404, render
from django.http import Http404

from rest_framework.response import Response

from blackjack.services import ALL_SERVICES
from blackjack.state.hand import HandHelper
from blackjack.state.state import State

from blackjack.store.card_service import CardService
from blackjack.store.hand_service import HandService
from blackjack.store.user_service import UserService

from .models import Card, CardValue, Suit

def index(request):
    handService = HandService(CardService(), UserService())
    state = State()
    handService.startTurn(state)
    all_cards = handService.cardService.deckShoe.cards
    return render(request, "blackjack/index.html", { "all_cards": all_cards })

def detail(request, suit, card):
    suit_id = get_object_or_404(Suit, short_form=suit)
    card_value_id = get_object_or_404(CardValue, value=card)
    the_card = get_object_or_404(Card, suit_id=suit_id, card_id=card_value_id)
    return render(request, "blackjack/detail.html", { "the_card": the_card })

def home(request):
    blackjackService = ALL_SERVICES.blackjackServer
    state = blackjackService.getState()
    ALL_SERVICES.theUserService.signUp(state, "Fred", "fred")
    state = ALL_SERVICES.theUserService.login(state, "fred")
    state = ALL_SERVICES.theGameService.startGame(state)
    state = ALL_SERVICES.theGameService.addPlayer(state, "fred")
    state = ALL_SERVICES.theHandService.startTurn(state)
    return render(request, "blackjack/home.html", { "state": state, "players": state.activeUsers, "dealer": state.dealersHand })
