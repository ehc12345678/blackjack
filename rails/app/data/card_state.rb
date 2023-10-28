# frozen_string_literal: true

class CardState

  attr_accessor :suit, :card, :value
  
  # @type [String]
  @suit

  # @type [String]
  @card

  # @type [Integer]
  @value

  # @param suit [String]
  # @param card [String]
  # @param value [Integer]
  def initialize(suit, card, value)
    super()
    @suit = suit
    @card = card
    @value = value
  end

  def to_s
    "#{@suit}#{@card} #{@value}"
  end
end

UNKNOWN_CARD = CardState.new("U", "0", 0)
