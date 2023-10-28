# frozen_string_literal: true

class PlayerState

  attr_accessor :chip_balance, :cash_balance, :name, :id, :current_bet
  
  @chip_balance
  @cash_balance
  @name
  @id
  @current_bet

  def initialize
    @chip_balance = 0
    @cash_balance = 0
    @name = ""
    @id = ""
    @current_bet = 0
  end
end
