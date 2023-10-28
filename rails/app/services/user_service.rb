# frozen_string_literal: true

class UserService

  attr_accessor :registered_users
  @registered_users

  def initialize
    super
    @registered_users = Hash.new
  end

  def sign_up(name, login_id)
    new_player = PlayerState.new
    new_player.id = login_id
    new_player.name = name
    new_player.current_bet = 80
    new_player.chip_balance = 5000
    new_player.cash_balance = 100
    registered_users[login_id] = new_player
    new_player
  end

  def login(state, id)
    user = lookup(id)
    if user
      state = state.clone
      state.active_users = state.active_users.clone.push(user)
    end
    state
  end

  def logout(state, id)
    user = lookup(id)
    if user
      state = state.clone
      state.active_users = state.active_users.clone.filter {|u| u.id != user.id}
    end
    state
  end

  def lookup(id)
    registered_users[id]
  end

  def logged_in?(state, login_id)
    state.active_users.any? {|u| u.id == login_id}
  end

  def modify_player(state, player)
    state = state.clone
    state.active_users = state.active_users.map {|p| p.id == player.id ? player : p}
    state
  end
end
