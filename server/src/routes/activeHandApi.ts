import { server } from './index';
import { Router } from 'express';
import { Request, Response } from 'express';
import { State } from "../../../client/src/store/State";
import { HandService, theHandService } from '../HandService';

var express = require('express');

var activeHandRouter = express.Router();

class ActiveHandApi {
    handService: HandService;

    constructor() {
        this.handService = theHandService;
    }

    addRoutes(router: Router) {
        router.get('/startTurn', this.startTurn.bind(this));
        router.get('/hit', this.hit.bind(this));
        router.get('/stay', this.stay.bind(this));
        router.get('/split', this.split.bind(this));
        router.get('/doubleDown', this.doubleDown.bind(this));
	}
	
	public startTurn(req: Request, res: Response<State>) : void {
		this.setState(res, (state) => this.handService.startTurn(state));
	}
	
	public hit(req: Request, res: Response<State>) : void {
		this.setState(res, (state) => this.handService.hitActiveHand(state));
	}

	public stay(req: Request, res: Response<State>) : void {
		this.setState(res, (state) => this.handService.stayActiveHand(state));
	}

	public split(req: Request, res: Response<State>) : void {
		this.setState(res, (state) => this.handService.splitActiveHand(state));
	}

	public doubleDown(req: Request, res: Response<State>) : void {
		this.setState(res, (state) => this.handService.doubleDownActiveHand(state));
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
const activeHandApi = new ActiveHandApi();
activeHandApi.addRoutes(activeHandRouter);
export default activeHandRouter;
