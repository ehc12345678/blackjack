import { State } from '../../../client/src/store/State';
import { Router } from 'express';
import { Game } from '../../../client/src/store/Game';
import { Hand } from '../../../client/src/store/Hand';
import { Request, Response } from 'express';

var express = require('express');

import userRouter from './userApi';
import activeHandRouter from './activeHandApi';
import gameRouter from './gameApi';
var baseRouter = express.Router();

const defaultState = {
	currentGame: {} as Game,
	playersHands: [],
	dealersHand: {} as Hand,
	activeHand: 0,
	activeUsers: [],
	turnIsGoing: false
} as State;

export class Server {
	state: State;

	constructor() {
		this.state = defaultState;
	}

	addRoutes(router: Router) {
    router.get('/state', this.getState.bind(this));
    router.use('/user', userRouter);
    router.use('/game', gameRouter);
    router.use('/activehand', activeHandRouter);
	}

  public getState(_req: Request, res: Response) : void {
		res.end(JSON.stringify(this.state));
	}

	public setState(state: State) : string {
    this.state = state;
		return JSON.stringify(this.state);
	}
}

export const server = new Server();
server.addRoutes(baseRouter);
export default baseRouter;
module.exports = baseRouter;
