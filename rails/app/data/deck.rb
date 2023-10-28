# A class that contains 52 cards (CardState).  It shuffles them initially
class Deck
  attr_accessor :cards

  SHUFFLE_FACTOR = 1000

  # @type [Array]
  @cards

  def initialize
    super
    @cards = Array.new
    add_default_cards
    shuffle
  end

  def add_default_cards
    @cards.concat(Card.all.map { |c| CardState.new(c.suit.short_form, c.card_value.short_form, c.card_value.value) })
  end

  def shuffle
    last_index = @cards.length - 1
    (0..last_index).each { |i| swap(@cards, i, rand(last_index)) }
    last_index.downto(0) { |i| swap(@cards, i, rand(last_index)) }
    SHUFFLE_FACTOR.times { |i| swap(@cards, rand(last_index), rand(last_index)) }
  end

  def swap(cards, item1, item2)
    tmp = cards[item1]
    cards[item1] = cards[item2]
    cards[item2] = tmp
  end
end
