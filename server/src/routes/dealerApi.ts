import { server } from './index';
import { Router } from 'express';
import { Request, Response } from 'express';
import { State } from "../../../client/src/store/State";
import { HandService, theHandService } from '../HandService';

var express = require('express');

var dealerRouter = express.Router();

class DealerApi {
    handService: HandService;

    constructor() {
        this.handService = theHandService;
    }

    addRoutes(router: Router) {
        router.get('/hit', this.hit.bind(this));
	}
	
	public hit(_req: Request, res: Response<State>) : void {
		this.setState(res, (state) => this.handService.dealerTakesCard(state));
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
const dealerApi = new DealerApi();
dealerApi.addRoutes(dealerRouter);
export default dealerRouter;
