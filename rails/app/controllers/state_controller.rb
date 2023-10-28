# frozen_string_literal: true

class StateController < ApplicationController
  include StateMixin

  def index
    render json: state
  end
end
