# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

{:S => "Spades", :D => "Diamonds", :C => "Clubs", :H => "Hearts"}.each do |key, value |
  Suit.create_with(long_form: value).find_or_create_by(short_form: key)
end

(1..13).each do | value |
  short_form = case(value)
               when 1 then "A"
               when 10 then "T"
               when 11 then "J"
               when 12 then "Q"
               when 13 then "K"
               else value.to_s
               end
  card_value = [value, 10].min
  long_form = case(card_value)
              when 1 then "Ace"
              when 2 then "Deuce"
              when 10 then "Ten"
              when 11 then "Jack"
              when 12 then "Queen"
              when 13 then "King"
              else card_value.to_s
              end
  CardValue.create_with(long_form: long_form).create_with(value: card_value).find_or_create_by(short_form: short_form)
end

Suit.all.each do | suit |
  CardValue.all.each do | card_value |
    conditions = { :card_value_id => card_value.id,
                   :suit_id => suit.id }
    Card.find_by(conditions) || Card.create(conditions)
  end
end