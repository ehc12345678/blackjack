import { State, defaultState } from '../../../client/src/store/State';
import { Router } from 'express';
import { Request, Response } from 'express';
import activeHandRouter from './activeHandApi';
import dealerRouter from './dealerApi';
import gameRouter from './gameApi';
import userRouter from './userApi';
import { HandHelper } from '../../../client/src/store/Hand';
import { theHandService } from '../HandService';

export class BlackjackEmitter {
    listeners: Array<WebSocket>;

    constructor(listeners: Array<WebSocket>) {
        this.listeners = listeners;
    }

    emit(message: string) {
        this.listeners.forEach(ws => ws.send(message));
    }
}

const handHelper = new HandHelper();
export class BlackjackServer {
    state: State;
    emitter: BlackjackEmitter;

	constructor(ws: BlackjackEmitter) {
        this.state = defaultState;
        this.emitter = ws;
	}

	addRoutes(router: Router) {
		router.get('/state', this.getState.bind(this));
		router.use('/user', userRouter);
		router.use('/game', gameRouter);
		router.use('/dealer', dealerRouter);
		router.use('/activehand', activeHandRouter);
	}

	public getState(_req: Request, res: Response): void {
		res.end(JSON.stringify(this.state));
	}

	public setState(state: State): string {
        this.state = state;
        var strState = JSON.stringify(this.state);
        console.log('Emitting event ' + strState);
        this.emitter.emit(strState);

		if (this.isDealerInControl(state)) {
			this.doDealer(state);
		}
		return strState;
    }


	doDealer(state: State) {
        setTimeout(() => {
            var newState = state;        
            if (this.isDealerInControl(state) && handHelper.bestTotal(state.dealersHand) < 17) {
                newState = theHandService.dealerTakesCard(newState);
                this.doDealer(newState);
            } else {
                newState = theHandService.endTurn(state);
            }
            this.setState(newState);
        }, 500);
    }

    isDealerInControl(state: State): boolean {
		return state.turnIsGoing && state.activeHand >= state.playersHands.length && !handHelper.isDone(state.dealersHand);
    }
}

