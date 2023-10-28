# frozen_string_literal: true

class DeckShoe < Deck
  attr_accessor :card_on_top

  @card_on_top

  # @param [Integer] num_decks number of decks in the shoe
  def initialize(num_decks)
    super()
    (num_decks - 1).times do
      add_default_cards
    end
    shuffle
  end

  def shuffle
    @card_on_top = 0
    super
  end

  def next_card
    shuffle if @card_on_top == @cards.length
    card = @cards[@card_on_top]
    @card_on_top = @card_on_top + 1
    card
  end
end
