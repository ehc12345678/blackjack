import React from 'react';
import { Card, Suit, UnknownCard } from '../../store';

type CardProperties = {
  card: Card;
};

export const CardComponent = ({ card }: CardProperties) => {
  const cardValueToStr = (value: number): string => {
    switch (value) {
      case 1:
        return 'A';
      case 10:
        return 'T';
      case 11:
        return 'J';
      case 12:
        return 'Q';
      case 13:
        return 'K';
    }
    return value.toString();
  };

  const cardSuitToStr = (suit: Suit): string => {
    return suit.toString();
  }

  const imagePath = (card: Card): string => {
    if (isUnknown(card)) {
      return '/cards/Unknown.jpg';
    }
    return (
      '/cards/' +
      cardValueToStr(card.value) +
      cardSuitToStr(card.suit) +
      '.jpg'
    );
  }

  const altText = (card: Card): string => {
    if (isUnknown(card)) {
      return 'Unknown';
    }
    return cardValueToStr(card.value) + cardSuitToStr(card.suit);
  }

  const isUnknown = (card: Card): boolean => {
    return card.value === UnknownCard.value && card.suit === UnknownCard.suit;
  }

  return (
    <div className="card">
      <img
        src={imagePath(card)}
        alt={altText(card)}
      ></img>
    </div>
  );
}
