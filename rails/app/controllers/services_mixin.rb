# frozen_string_literal: true

module ServicesMixin
  def user_service
    Services.instance.user_service
  end

  def game_service
    Services.instance.game_service
  end

end
