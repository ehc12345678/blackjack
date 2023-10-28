# frozen_string_literal: true

class ActiveHandController < ApplicationController
  skip_before_action :verify_authenticity_token
  include StateMixin

  def hand_service
    Services.instance.hand_service
  end
  
  def start_turn
    set_state {|state| hand_service.start_turn(state)}
  end

  def end_turn
    set_state {|state| hand_service.end_turn(state)}
  end

  def hit
    set_state {|state| hand_service.hit_active_hand(state)}
  end

  def stay
    set_state {|state| hand_service.stay_active_hand(state)}
  end

  def split
    set_state {|state| hand_service.split_active_hand(state)}
  end

  def double_down
    set_state {|state| hand_service.double_down_active_hand(state)}
  end
end
