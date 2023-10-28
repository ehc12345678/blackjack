class CardsController < ApplicationController
  def index
    render :json => Card.all
  end

  def show
    card_value = params[:card]
    suit = params[:suit]
    condition = {
      'card_value.short_form' => card_value,
      'suit.short_form' => suit
    }
    card = Card.joins(:card_value,:suit).where(condition).first
    render :json => card
  end
end
