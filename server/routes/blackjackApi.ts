import { State } from '../../client/src/store/State';
import { Request, Response, Router } from 'express';
import { UserService } from '../src/UserService';

var express = require('express');
var router = express.Router();

type LoginForm = {
	loginId: string
};

type RegisterForm = {
	name: string
};

class LoginController {
	server: Server;
	userService: UserService;

	constructor(server: Server) {
		this.server = server;
		this.userService = new UserService();
	}
	
	public login(req: Request<LoginForm>, res: Response) : void {
		this.setState(res, (state) =>  this.userService.login(state, req.body.loginId));
	}

	public logout(req: Request<LoginForm>, res: Response) : void {
		this.setState(res, (state) =>  this.userService.logout(state, req.body.loginId));
	}

	public register(req: Request<RegisterForm>, res: Response) : void {
		var loginId = this.userService.getNewLoginId(this.getState());
		this.setState(res, (state) =>  this.userService.signUp(state, req.body.name, loginId));
	}

	private setState(res: Response, func: (state: State) => State) {
		res.end(this.server.setState(func.apply(this.getState())));
	}

	private getState() : State {
		return this.server.state;
	}
}

const defaultState = {
	currentGame: {},
	playersHands: [],
	dealersHand: {},
	activeHand: {},
	activeUsers: new Map(),
	currentUser: null,
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
server.addRoutes(router);
module.exports = router;
