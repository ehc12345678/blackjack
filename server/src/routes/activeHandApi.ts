import { server } from '../index';
import { Router } from 'express';
import { Request, Response } from 'express';
import { State } from "../../../client/src/store/State";
import { HandService, theHandService } from '../HandService';
import { HandHelper } from '../../../client/src/store/Hand';

var express = require('express');

var activeHandRouter = express.Router();

const handHelper = new HandHelper();
class ActiveHandApi {
    handService: HandService;

    constructor() {
        this.handService = theHandService;
    }

    addRoutes(router: Router) {
		router.get('/startTurn', this.startTurn.bind(this));
        router.get('/endTurn', this.endTurn.bind(this));
        router.get('/hit', this.hit.bind(this));
        router.get('/stay', this.stay.bind(this));
        router.get('/split', this.split.bind(this));
		router.get('/doubleDown', this.doubleDown.bind(this));
	}
	
	public startTurn(_req: Request, res: Response<State>) : void {
		this.setState(res, (state) => this.handService.startTurn(state));
	}

	public endTurn(_req: Request, res: Response<State>) : void {
		this.setState(res, (state) => this.handService.endTurn(state));
	}

	public hit(_req: Request, res: Response<State>) : void {
		this.setState(res, (state) => this.handService.hitActiveHand(state));
	}

	public stay(_req: Request, res: Response<State>) : void {
		this.setState(res, (state) => this.handService.stayActiveHand(state));
	}

	public split(_req: Request, res: Response<State>) : void {
		this.setState(res, (state) => this.handService.splitActiveHand(state));
	}

	public doubleDown(_req: Request, res: Response<State>) : void {
		this.setState(res, (state) => this.handService.doubleDownActiveHand(state));
    }
    
	private setState(res: Response, func: (state: State) => State) {
        var state = this.getState();
		var newState = func.call(this, state);
		res.end(server.setState(newState));

		if (this.isDealerInControl(newState)) {
			this.doDealer(newState);
		}
	}

	private getState() : State {
		return server.state;
	}

	doDealer(state: State) {
		var newState = state;
		if (this.isDealerInControl(state) && handHelper.bestTotal(state.dealersHand) < 17) {
			newState = this.handService.dealerTakesCard(newState);
			setTimeout(() => this.doDealer(newState), 500);
		} else {
			newState = this.handService.endTurn(state);
		}
		server.setState(newState);
    }

    isDealerInControl(state: State): boolean {
		return state.activeHand >= state.playersHands.length && !handHelper.isDone(state.dealersHand);
    }
}
const activeHandApi = new ActiveHandApi();
activeHandApi.addRoutes(activeHandRouter);
export default activeHandRouter;
