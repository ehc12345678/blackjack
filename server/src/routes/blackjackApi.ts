import { State } from '../../../client/src/store/State';
import { Request, Response, Router } from 'express';
import { UserService } from '../UserService';
import { Game } from '../../../client/src/store/Game';
import { Hand } from '../../../client/src/store/Hand';

var express = require('express');
export var blackjackApiRouter = express.Router();

type LoginForm = {
	loginId: string
};

type RegisterForm = {
	name: string
};

type RegisterResponse = {
	name: string,
	loginId: string
}

class LoginController {
	server: Server;
	userService: UserService;

	constructor(server: Server) {
		this.server = server;
		this.userService = new UserService();
	}
	
	public login(req: Request<LoginForm>, res: Response<State>) : void {
		this.setState(res, (state) => this.userService.login(state, req.body.loginId));
	}

	public logout(req: Request<LoginForm>, res: Response<State>) : void {
		this.setState(res, (state) => this.userService.logout(state, req.body.loginId));
	}

	public register(req: Request<RegisterForm>, res: Response<RegisterResponse>) : void {
		var registerResponse = this.userService.signUp(this.getState(), req.body.name);
		res.end(JSON.stringify(registerResponse));
	}

	private setState(res: Response, func: (state: State) => State) {
		var newState = func.call(this, this.getState());
		res.end(this.server.setState(newState));
	}

	private getState() : State {
		return this.server.state;
	}
}

const defaultState = {
	currentGame: {} as Game,
	playersHands: [],
	dealersHand: {} as Hand,
	activeHand: 0,
	activeUsers: new Map(),
	turnIsGoing: false
} as State;

class Server {
	state: State;
	loginController: LoginController;

	constructor() {
		this.state = defaultState;
		this.loginController = new LoginController(this);
	}

	addRoutes(router: Router) {
		router.post('/login', this.loginController.login);
	}

	setState(state: State) : string {
		this.state = state;
		return JSON.stringify(this.state);
	}
}

const server = new Server();
server.addRoutes(blackjackApiRouter);
module.exports = blackjackApiRouter;
