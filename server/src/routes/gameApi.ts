import { server } from './index';
import { Router } from 'express';
import { Request, Response } from 'express';
import { State } from "../../../client/src/store/State";
import { GameService, theGameService } from '../GameService';
import { UserService, theUserService } from '../UserService';
import { Player } from '../../../client/src/store/Player';

var express = require('express');

var gameRouter = express.Router();

type PlayerForm = {
	id: string
};

type ChangeBetForm = {
	id: string,
	bet: string
};

class GameApi {
	gameService: GameService;
	userService: UserService;

    constructor() {
		this.gameService = theGameService;
		this.userService = theUserService;
    }

    addRoutes(router: Router) {
        router.put('/', this.createGame.bind(this));
        router.get('/start', this.startGame.bind(this));
		router.post('/join', this.joinGame.bind(this));
		router.post('/changeBet', this.changeBet.bind(this));
    }
	
	public createGame(req: Request, res: Response<State>) : void {
		this.setState(res, (state) => this.gameService.createGame(state));
	}

	public startGame(req: Request, res: Response<State>) : void {
		this.setState(res, (state) => this.gameService.startGame(state));
	}

	public joinGame(req: Request<PlayerForm>, res: Response<State>) : void {
		var player = this.userService.lookup(this.getState(), req.body.id) as Player;
		if (player !== null) {
			this.setState(res, (state) => this.gameService.addPlayer(state, player));
		} else {
			res.status(404).end('player not found ' + req.body.id);
		}
	}

	public changeBet(req: Request<ChangeBetForm>, res: Response<State>) : void {
		res.end(JSON.stringify(this.gameService.changeBet(this.getState(), req.body.id, +req.body.bet)));
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
