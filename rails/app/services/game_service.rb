# frozen_string_literal: true

class GameService
  CHIPS_PER_DOLLAR = 100

  attr_accessor :hand_service, :user_service
  @hand_service
  @user_service

  def initialize(hand_service, user_service)
    @hand_service = hand_service
    @user_service = user_service
  end

  def create_game(state)
    new_state = state.clone
    state.current_game = Game.new
    start_game(new_state)
  end

  def add_player(state, player_id)
    current_game = state.current_game.clone

    player = user_service.lookup(player_id)
    current_game.players.append(player) if player

    new_state = state.clone
    new_state.current_game = current_game
    new_state
  end

  def remove_player(state, player_id)
    current_game = state.current_game.clone
    current_game.players = current_game.filter {|p| p.id != player_id}

    new_state = state.clone
    new_state.current_game = current_game
    new_state
  end

  def set_current_bet(player, current_bet)
    new_player = player.clone
    new_player.current_bet = current_bet
    new_player
  end

  def buy_chips(player, cash)
    if cash < player.cash_balance
      player = player.clone
      player.chip_balance = player.chip_balance + cash * CHIPS_PER_DOLLAR
      player.cash_balance = player.cash_balance - cash
    end

    player
  end

  def cash_out(player, chips)
    if chips < player.chip_balance
      player = player.clone
      player.chip_balance = player.chip_balance - chips
      player.cash_balance = player.cash_balance + (chips / CHIPS_PER_DOLLAR).truncate
    end

    player
  end

  def start_game(state)
    state
  end

  def change_bet(state, id, bet)
    player = user_service.lookup(id)
    player ? user_service.modify_player(state, set_current_bet(player, bet)) : state
  end
end
