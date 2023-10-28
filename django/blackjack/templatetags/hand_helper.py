from django import template

from blackjack.state.hand import Hand, HandHelper, Result

register = template.Library()

HAND_HELPER = HandHelper()

@register.filter(name="isBlackjack")
def isBlackjack(hand: Hand) -> bool:
    return HAND_HELPER.isBlackjack(hand)

@register.filter(name="isBusted")
def isBusted(hand: Hand) -> bool:
    return HAND_HELPER.isBusted(hand)

@register.filter(name="lowest")
def lowest(hand: Hand) -> int:
    return HAND_HELPER.lowestTotal(hand)

@register.filter(name="highest")
def highest(hand: Hand) -> int:
    return HAND_HELPER.highestTotal(hand)

@register.filter(name="bestTotal")
def bestTotal(hand: Hand) -> int:
    return HAND_HELPER.bestTotal(hand)

@register.filter(name="canHit")
def canHit(hand: Hand) -> bool:
    return not HAND_HELPER.isDone(hand)

@register.filter(name="canStay")
def canStay(hand: Hand) -> bool:
    return canHit(hand)

def buttonsVisible(hand: Hand):
    return hand.result == Result.Playing.__str__()

@register.filter(name="canSplit")
def canSplit(hand: Hand) -> bool:
    return buttonsVisible(hand) and HAND_HELPER.canSplit(hand)

@register.filter(name="canDoubleDown")
def canDoubleDown(hand: Hand) -> bool:
    return buttonsVisible(hand) and HAND_HELPER.canDoubleDown(hand)