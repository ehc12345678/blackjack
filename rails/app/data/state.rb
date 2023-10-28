# frozen_string_literal: true

class State

  attr_accessor :current_game, :players_hands, :dealers_hand, :active_hand, :active_users, :turn_is_going

  @current_game
  @players_hands
  @dealers_hand
  @active_hand
  @active_users
  @turn_is_going

  def initialize
    super
    @current_game = Game.new
    @players_hands = []
    @dealers_hand = Hand.new("dealer")
    @active_hand = 0
    @active_users = []
    @turn_is_going = false
  end
end
