class CreateInitial < ActiveRecord::Migration[7.1]
  def change
    create_table :suits do |t|
      t.string :short_form
      t.string :long_form
    end

    create_table :card_values do |t|
      t.string :short_form
      t.string :long_form
      t.integer :value
    end

    create_table :cards do |t|
      t.references :suit, index: true, foreign_key: true
      t.references :card_value, index: true, foreign_key: true
    end
  end
end
