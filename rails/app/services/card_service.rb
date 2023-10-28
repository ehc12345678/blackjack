# frozen_string_literal: true

class CardService
  NUM_DECKS_IN_SHOW = 7

  @deck_shoe

  def initialize
    super
    @deck_shoe = DeckShoe.new(NUM_DECKS_IN_SHOW)
  end

  def next_card
    @deck_shoe.next_card
  end

  def shuffle
    @deck_shoe.shuffle
  end
end
