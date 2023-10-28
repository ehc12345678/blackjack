class GamesController < ApplicationController
  @hand_helper

  skip_before_action :verify_authenticity_token
  include StateMixin
  include ServicesMixin

  def initialize
    super
    @hand_helper = HandHelper.new
  end

  def create
    set_state {|state| game_service.create_game(state)}
  end

  def start
    set_state {|state| game_service.start_game(state)}
  end

  def join
    player = user_service.lookup(params[:id])
    if player
      unless state.current_game.players.any? { |player_id| player_id == player.id }
        set_state { |state| game_service.add_player(state, player.id) }
      end
    else
      raise ActionController::RoutingError.new("Player not found #{params[:id]}")
    end
  end

  def change_bet
    game_service.change_bet(state, params[:id], params[:bet].to_i)
    set_state {|state| state}
  end

  
  def dealer_in_control?(state)
    state.turn_is_going and state.active_hand >= state.players_hands.length and
      not @hand_helper.done?(state.dealers_hand)
  end

  private def do_dealer(state)
    # setTimeout(() => {
    #   var newState = state;
    # if (
    #   this.isDealerInControl(state) &&
    #     handHelper.bestTotal(state.dealersHand) < 17
    # ) {
    #   newState = theHandService.dealerTakesCard(newState);
    # this.doDealer(newState);
    # } else {
    #   newState = theHandService.endTurn(state);
    # }
    # this.setState(newState);
    # }, 500);
  end

end
