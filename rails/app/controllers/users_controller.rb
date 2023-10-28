# frozen_string_literal: true

class UsersController < ApplicationController
  skip_before_action :verify_authenticity_token
  include StateMixin
  include ServicesMixin

  def login
    login_id = params[:loginId]
    person = user_service.lookup(login_id)
    if person
      set_state {|state| user_service.login(state, person.id)}
    else
      raise ActionController::RoutingError.new("Player not found #{login_id}")
    end
  end

  def logout
    set_state {|state| user_service.logout(state, params[:loginId]) }
  end

  def register
    person = user_service.sign_up(params[:name], params[:loginId])
    render json: person
  end

  def all_registered
    render json: user_service.registered_users
  end

  def get_registered
    render json: user_service.lookup(params[:loginId])
  end
end
