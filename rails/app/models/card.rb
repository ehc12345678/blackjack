# == Schema Information
#
# Table name: card
#
#  suit_id                          :big_int          not null
#  card_value_id                    :big_int          not null

class Card < ApplicationRecord
  belongs_to :suit
  belongs_to :card_value
end
