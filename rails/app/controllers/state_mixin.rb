# frozen_string_literal: true

module StateMixin
  def state
    Services.instance.state
  end

  def set_state
    new_state = yield state
    Services.instance.state = new_state
    # var strState = JSON.stringify(this.state);
    # this.emitter.emit(strState);
    #
    # if (this.isDealerInControl(state)) {
    #   this.doDealer(state);
    # }

    render json: new_state
  end
end
