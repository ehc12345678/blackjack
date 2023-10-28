class Hand
  attr_accessor :cards, :player, :bet, :is_staying, :result

  # @type [Array]
  @cards

  # @type [String]
  @player

  # @type [int]
  @bet

  # @type [Boolean]
  @is_staying

  # @type [String]
  @result

  def initialize(player = "")
    super()
    @cards = []
    @player = player
    @bet = 0
    @is_staying = false
    @result = :Playing
  end

  def add_card(card)
    result = clone
    result.cards.push(card)
    result
  end
end
