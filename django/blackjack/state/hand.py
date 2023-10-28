from enum import StrEnum
from typing import Any

from blackjack.state.card import Card

class Result(StrEnum): 
  Loss = "Loss",
  Push = "Push",
  Win = "Win",
  Blackjack = "Blackjack",
  Playing = "Playing",

class Hand:
  cards: list[Card]
  player: str
  bet: int
  isStaying: bool
  result: Result
  
  def __init__(self) -> None:
    self.cards = []
    self.player = ""
    self.bet = 0
    self.isStaying = False
    self.result = Result.Playing

  def clone(self):
    newHand = Hand()
    newHand.cards = self.cards.copy()
    newHand.player = self.player
    newHand.bet = self.bet
    newHand.isStaying = self.isStaying
    newHand.result = self.result
    return newHand
  
  def toDict(self) -> dict[str, Any]:
    return {
      "cards": list(map(lambda c: c.toDict(), self.cards)),
      "player": self.player,
      "bet": self.bet,
      "isStaying": self.isStaying,
      "result": self.result.__str__(),
    }

  def __str__(self) -> str:
    return f"{self.toDict()}"

class HandHelper:
  def canSplit(self, hand: Hand) -> bool :
    return len(hand.cards) == 2 and hand.cards[0].value == hand.cards[1].value

  def canDoubleDown(self, hand: Hand) -> bool : 
    return len(hand.cards) == 2

  def highestTotal(self, hand: Hand) -> int :
    total = 0
    for card in hand.cards:
      val = min(card.value, 10)
      if val == 1 and total + 11 <= 21:
        val = 11
      total += val

    if total > 21:
      total = self.lowestTotal(hand)
    return total

  def lowestTotal(self, hand: Hand) -> int : 
    total = 0
    for card in hand.cards:
      total += min(card.value, 10)
    return total

  def bestTotal(self, hand: Hand) -> int : 
    return self.highestTotal(hand) if self.highestTotal(hand) <= 21 else self.lowestTotal(hand)

  def isBusted(self, hand: Hand) -> bool : 
    return self.lowestTotal(hand) > 21

  def isBlackjack(self, hand: Hand) -> bool: 
    return self.highestTotal(hand) == 21 and len(hand.cards) == 2

  def isDone(self, hand: Hand) -> bool: 
    return self.isBusted(hand) or hand.isStaying or self.isBlackjack(hand)
