# frozen_string_literal: true

DEALER_ID = "Dealer"
class HandService

  attr_accessor :card_service, :user_service, :helper
  @card_service
  @user_service
  @helper

  def initialize(card_service, user_service)
    super()
    @card_service = card_service
    @user_service = user_service
    @helper = HandHelper.new
  end

  def start_turn(state)
    players_hands = []
    dealers_hand = create(DEALER_ID, 0)
    dealers_hand = add_card(dealers_hand, UNKNOWN_CARD)
    current_game = state.current_game

    current_game.players.each do |player|
      hand = create(player.id, player.current_bet)
      hand = add_card(hand, card_service.next_card)
      hand = add_card(hand, card_service.next_card)
      players_hands.append(hand)
    end

    dealers_hand = add_card(dealers_hand, card_service.next_card)

    new_state = state.clone
    new_state.current_game = current_game
    new_state.players_hands = players_hands
    new_state.dealers_hand = dealers_hand
    new_state.turn_is_going = true
    new_state.active_users = state.active_users
    set_active_hand(new_state, 0)
  end

  def create(player_id, current_bet)
    new_hand = Hand.new
    new_hand.player = player_id
    new_hand.bet = current_bet
    new_hand
  end

  def get_active_hand(state)
    state.players_hands[state.active_hand]
  end

  def hit_active_hand(state)
    hand = add_card(get_active_hand(state), card_service.next_card)
    new_state = state.clone
    new_state.players_hands = replace(state.players_hands, state.active_hand, hand)
    if helper.done?(hand)
      new_state = next_active_hand(new_state)
    end
    new_state
  end

  def stay_active_hand(state)
    hand = stay(get_active_hand(state))
    new_state = state.clone
    new_state.players_hands = replace(state.players_hands, state.active_hand, hand)
    next_active_hand(new_state)
  end

  def double_down_active_hand(state)
    hand = get_active_hand(state)
    new_state = state
    if hand.cards.length == 2
      # double down is to give the active hand a card, double the bet, and stay
      new_hand = add_card(hand, card_service.next_card)
      new_hand.bet = new_hand.bet * 2
      new_state = new_state.clone
      new_state.players_hands = replace(new_state.players_hands, new_state.active_hand, new_hand)
      new_state = stay_active_hand(new_state)
    end

    new_state
  end

  def next_active_hand(state)
    set_active_hand(state, state.active_hand + 1)
  end

  def set_active_hand(state, active_hand)
    new_state = state.clone
    new_state.active_hand = active_hand
    if not another_hand_exists?(new_state)
      new_state = give_dealer_control(new_state)
    else
      if helper.done?(get_active_hand(new_state))
        new_state = next_active_hand(new_state)
      end
    end
    new_state
  end

  def another_hand_exists?(state)
    state.active_hand < state.players_hands.length
  end

  def give_dealer_control(state)
    puts 'Dealer took control'

    # remove the unknown card and add a real one

    dealers_hand = state.dealers_hand.clone
    dealers_hand.cards = state.dealers_hand.cards.filter {|c| c != UNKNOWN_CARD}.push(card_service.next_card)

    new_state = state.clone
    new_state.dealers_hand = dealers_hand
    if helper.blackjack?(dealers_hand)
      new_state = end_turn(new_state)
    end

    new_state
  end

  def dealers_take_card(state)
    dealers_hand = state.dealers_hand
    if helper.highest_total(dealers_hand) < 17
      dealers_hand = add_card(dealers_hand, card_service.next_card)
    end

    new_state = state.clone
    new_state.dealers_hand = dealers_hand
    new_state
  end

  def split_active_hand(state)
    new_state = state
    hand = get_active_hand(state)
    if helper.can_split(hand)
      hand1 = hand.clone
      hand1.cards = [hand.cards[0], card_service.next_card]

      hand2 = hand.clone
      hand2.cards = [hand.cards[1], card_service.next_card]

      new_state = state.clone
      new_state.players_hands = new_state.players_hands[0..new_state.active_hand] + [hand1,hand2] + new_state.players_hands[new_state.active_hand..]
    end

    new_state
  end

  def end_turn(state)
    puts 'End turn'
    player_hands = []
    state.players_hands.each { |hand|
      hand = set_result(hand, hand_result(hand, state.dealers_hand))
      player_hands.append(hand)
      player = lookup_player(state, hand.player)
      case hand.result
      when :Loss
        state = user_service.modify_player(state, remove_chips(player, hand.bet))
      when :Win
        state = user_service.modify_player(state, add_chips(player, hand.bet))
      when :Blackjack
        state = user_service.modify_player(state, add_chips(player, (hand.bet * 1.5).truncate))
      else
        # No change
      end
    }

    new_state = state.clone
    new_state.turn_is_going = false
    new_state
  end

  def hand_result(hand, dealers_hand)
    if helper.busted?(hand)
      return :Loss
    elsif helper.blackjack?(dealers_hand)
      return :Loss unless helper.blackjack?(hand)
    elsif helper.blackjack?(hand)
      return :Blackjack
    elsif helper.busted?(dealers_hand)
      return :Win
    end

    dealer_total = helper.best_total(dealers_hand)
    hand_total = helper.best_total(hand)
    if dealer_total and dealer_total > hand_total
      return :Loss
    elsif dealer_total == hand_total
      return :Push
    end
    :Win
  end

  def add_card(hand, card)
    new_hand = hand.clone
    new_hand.cards = hand.cards.clone.append(card)
    new_hand
  end

  def set_result(hand, result)
    new_hand = hand.clone
    new_hand.result = result
    new_hand
  end

  def stay(hand)
    new_hand = hand.clone
    new_hand.is_staying = true
    new_hand
  end

  def replace(arr, index, replace_item)
    arr.each_with_index.map { |value, i| i == index ? replace_item : value}
  end

  def add_chips(player, chips)
    new_player = player.clone
    new_player.chip_balance = player.chip_balance + chips
    puts("Adding #{chips} to #{player.name} new balance=#{new_player.chip_balance}")
    new_player
  end

  def remove_chips(player, chips)
    player.chip_balance >= chips ? add_chips(players, -chips) : player
  end

  def lookup_player(state, id)
    player = state.active_users.find {|p| p.id == id}
    raise Exception.new "Something bad happened, could not find player #{id}" if player == nil
    player
  end
end
