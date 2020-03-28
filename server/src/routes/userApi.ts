import { server } from './index';
import { Router } from 'express';
import { UserService, theUserService } from '../UserService';
import { Request, Response } from 'express';
import { State } from "../../../client/src/store/State";

var express = require('express');

var userRouter = express.Router();

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

class UserApi {
    userService: UserService;

    constructor() {
        this.userService = theUserService;
    }

    addRoutes(router: Router) {
        router.post('/login', this.login.bind(this));
        router.post('/logout', this.logout.bind(this));
        router.post('/register', this.register.bind(this));
        router.get('/', this.getAllRegistered.bind(this));
        router.get('/:loginId', this.getRegistered.bind(this));
    }
	
	public login(req: Request<LoginForm>, res: Response<State>) : void {
		this.setState(res, (state) => this.userService.login(state, req.body.loginId));
	}

	public logout(req: Request<LoginForm>, res: Response<State>) : void {
		this.setState(res, (state) => this.userService.logout(state, req.body.loginId));
	}

	public register(req: Request<RegisterForm>, res: Response<RegisterResponse>) : void {
		var loginId = this.userService.signUp(this.getState(), req.body.name);
		var person = this.userService.lookup(this.getState(), loginId);
		res.end(JSON.stringify(person));
    }
    
    public getAllRegistered(req: Request, res: Response) : void {
        res.end(JSON.stringify(this.userService.getRegistered()));
    }

    public getRegistered(req: Request<LoginForm>, res: Response) : void {
        res.end(JSON.stringify(this.userService.lookup(this.getState(), req.params.loginId)));
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
const blackjackApi = new UserApi();
blackjackApi.addRoutes(userRouter);
export default userRouter;
