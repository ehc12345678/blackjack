import { State, defaultState } from '../../../client/src/store/State';
import { Router } from 'express';
import { Request, Response } from 'express';
import activeHandRouter from './activeHandApi';
import dealerRouter from './dealerApi';
import gameRouter from './gameApi';
import userRouter from './userApi';

export class BlackjackEmitter {
    listeners: Array<WebSocket>;

    constructor(listeners: Array<WebSocket>) {
        this.listeners = listeners;
    }

    emit(message: string) {
        this.listeners.forEach(ws => ws.send(message));
    }
}

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
		return strState;
    }
}

