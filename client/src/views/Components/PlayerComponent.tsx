import { Hand } from '../../store';
import { Player } from '../../store';
import React, { ChangeEvent, useState } from 'react';
import { HandComponent } from './HandComponent';

export type PlayerProperties = {
  player: Player;
  hands: Array<Hand>;
  activeHand: Hand;
  canChangeBet: boolean;
  isLoggedInPlayer: boolean;
  onHit: () => void;
  onStay: () => void;
  onSplit: () => void;
  onDoubleDown: () => void;
  onChangeBet: (player: Player, bet: number) => void;
};

type PlayerState = {
  changeBetVisible: boolean;
  bet: number;
};

export const PlayerComponent = (props: PlayerProperties) => {
  const [changeBetVisible, setChangeBetVisible] = useState<boolean>(false);
  const [bet, setBet] = useState<number>(props.player.currentBet);
  const [tempBet, setTempBet] = useState<number>(bet);

  const handleToggleBetVisibility = () => {
    setChangeBetVisible(!changeBetVisible);
  }

  const handleBetValueChange = (newBet: number) => {
    setBet(newBet);
    props.onChangeBet(props.player, newBet);
    handleToggleBetVisibility()
  }

  const getBetControls = (props : PlayerProperties) => {
    var changeControlsForm;
    var changeBetButton;
    if (changeBetVisible && props.isLoggedInPlayer) {
      changeControlsForm = (
        <div className="playerBetForm">
          <input
            type="text"
            value={tempBet}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setTempBet(+event.target?.value)}
          />
          <button onClick={() => handleBetValueChange(tempBet)}>OK</button>
          <button onClick={handleToggleBetVisibility}>Cancel</button>
        </div>
      );
    }

    if (props.canChangeBet && props.isLoggedInPlayer) {
      changeBetButton = (
        <button onClick={handleToggleBetVisibility}>Change Bet</button>
      );
      return (
        <div className="playerBet">
          Current Bet: ${bet}
          {changeBetButton}
          {changeControlsForm}
        </div>
      );
    }
  }

  return (
    <div className="player">
      <div className="playerName">{props.player.name}</div>
      <div className="playerChips">
        Chips: {props.player.chipBalance}
      </div>
      <div className="playerCash">Cash: {props.player.cashBalance}</div>
      {getBetControls(props)}
      <div className="hands">
        {props.hands.map((value, index) => {
          return (
            <HandComponent
              hand={value}
              isActive={props.activeHand === value}
              isLoggedInUser={props.isLoggedInPlayer}
              onHit={props.onHit}
              onStay={props.onStay}
              onSplit={props.onSplit}
              onDoubleDown={props.onDoubleDown}
              isDealer={false}
              key={"hand"+index}
            />
          );
        })}
      </div>
    </div>
  );
}
