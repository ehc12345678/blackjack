import React from 'react';
import { CardComponent } from './CardComponent';
import { Hand, Result, HandHelper } from '../../store';

type HandProperties = {
  hand: Hand;
  isActive: boolean;
  isDealer: boolean;
  isLoggedInUser: boolean;
  onHit: () => void;
  onStay: () => void;
  onSplit: () => void;
  onDoubleDown: () => void;
};

export const HandComponent = (props: HandProperties) => {
  const { hand } = props;
  const helper = new HandHelper();

  const getHandTotal = (hand: Hand) => {
    if (helper.isBlackjack(hand)) {
      return <span className="blackjack">Blackjack</span>;
    }
    if (helper.isBusted(hand)) {
      return <span className="busted">Busted</span>;
    }
    const lowest = helper.lowestTotal(hand);
    const highest = helper.highestTotal(hand);
    if (lowest > 0 && (hand.isStaying || lowest === highest)) {
      return <b>{helper.bestTotal(hand)}</b>;
    }
    if (lowest > 0) {
      return (
        <span>
          <b>{lowest}</b> or <b>{highest}</b>
        </span>
      );
    }
  }

  const canHit = (hand: Hand) : boolean => {
    return !helper.isDone(hand);
  }

  const canStay = (hand: Hand) : boolean => {
    return canHit(hand);
  }

  const getBet = ({ bet }: Hand) => {
    if (bet > 0) {
      return <div className="handBet">Bet: ${bet}</div>;
    }
  }

  const getHandResult = ({ result }: Hand) => {
    if (result !== Result.PLAYING) {
      return <div className="handResult">{result}</div>;
    }
  }

  const buttonsShouldBeVisible = ({isDealer, isLoggedInUser, isActive, hand}: HandProperties) : boolean => {
    return (
      !isDealer &&
      isLoggedInUser &&
      isActive &&
      hand.result === Result.PLAYING
    );
  }

  const getSplitButton = (props: HandProperties)  => {
    const { hand, onSplit } = props;
    if (helper.canSplit(hand) && buttonsShouldBeVisible(props)) {
      return <button onClick={() => onSplit()}>Split</button>;
    }
  }

  const getDoubleDownButton = (props: HandProperties) => {
    if (
      helper.canDoubleDown(props.hand) &&
      buttonsShouldBeVisible(props)
    ) {
      return (
        <button onClick={props.onDoubleDown}>Double Down</button>
      );
    }
  }

  var active = props.isActive ? 'Active' : '';
  var btnActive = buttonsShouldBeVisible(props) ? 'Active' : '';
  return (
      <div className={'hand' + active}>
        <div className={'handTotal' + active}>{getHandTotal(hand)}</div>
        {getBet(hand)}
        {hand.cards.map((card, index) => {
          return <CardComponent card={card} key={"card" + index}/>;
        })}
        <div className="handButtons">
          <button
            className={'handButton' + btnActive}
            disabled={!canHit(hand)}
            onClick={() => props.onHit()}
          >
            Hit
          </button>
          <button
            className={'handButton' + btnActive}
            disabled={!canStay(hand)}
            onClick={() => props.onStay()}
          >
            Stay
          </button>
          {getSplitButton(props)}
          {getDoubleDownButton(props)}
        </div>
        {getHandResult(hand)}
      </div>
    );
};

