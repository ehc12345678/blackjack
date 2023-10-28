# frozen_string_literal: true

class Services
  include Singleton

  attr_reader :card_service, :user_service, :hand_service, :game_service
  attr_accessor :state

  def initialize
    @card_service = CardService.new
    @user_service = UserService.new
    @hand_service = HandService.new(card_service, user_service)
    @game_service = GameService.new(hand_service, user_service)
    @state = State.new
  end

end


