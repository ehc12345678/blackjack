import { server } from './index';
import { Router } from 'express';
import { Request, Response } from 'express';
import { State } from "../../../client/src/store/State";
import { HandService } from '../HandService';
import { GameService } from '../GameService';

var express = require('express');

var gameRouter = express.Router();

class GameApi {
    gameService: GameService;

    constructor() {
        this.gameService = new GameService();
    }

    addRoutes(router: Router) {
        router.put('/', this.createGame.bind(this));
        router.get('/start', this.startGame.bind(this));
    }
	
	public createGame(req: Request, res: Response<State>) : void {
		this.setState(res, (state) => this.gameService.createGame(state));
	}

	public startGame(req: Request, res: Response<State>) : void {
		this.setState(res, (state) => this.gameService.startGame(state));
	}
    
	private setState(res: Response, func: (state: State) => State) {
        var state = this.getState();
		var newState = func.call(this, state);
		res.end(server.setState(newState));
	}

	private getState() : State {
		return server.state;
	}
}
const activeHandApi = new GameApi();
activeHandApi.addRoutes(gameRouter);
export default gameRouter;
