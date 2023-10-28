class DecksController < ApplicationController
  def index
    deck = DeckShoe.new(7)
    render json: deck
  end
end
