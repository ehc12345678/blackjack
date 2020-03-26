import { Card } from './Card';
import { CardApi } from './server/CardApi';

export class CardService {
    cardApi: CardApi;
 
    constructor() {
        this.cardApi = new CardApi();
    }

    nextCard(): Card {
        return this.cardApi.getNextCard();
    }
}