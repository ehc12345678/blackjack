# frozen_string_literal: true

class HandHelper
  def can_split(hand)
    hand.cards.length == 2 and hand.cards[0].value == hand.cards[1].value
  end

  def can_double_down(hand)
    hand.cards.length == 2
  end

  def highest_total(hand)
    total = hand.cards.inject(0) do |sum, card|
      val = [card.value, 10].min
      if val == 1 and sum + 11 <= 21
        val = 11
      end
      sum + val
    end

    if total > 21
      total = lowest_total(hand)
    end

    total
  end

  def lowest_total(hand)
    hand.cards.inject(0) {|sum, card| sum + card.value}
  end

  def best_total(hand)
    highest_total(hand) <= 21 ? highest_total(hand) : lowest_total(hand)
  end

  def busted?(hand)
    lowest_total(hand) > 21
  end

  def blackjack?(hand)
    highest_total(hand) == 21 and hand.cards.length == 2
  end

  def done?(hand)
    busted?(hand) or hand.is_staying or blackjack?(hand)
  end
end
