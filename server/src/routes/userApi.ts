import { Router, Request, Response } from 'express';
var checkScope = require('express-jwt-authz');

import { server, checkJwt } from '../index';
import { UserService, theUserService } from '../UserService';
import { State } from '../../../client/src/store/State';

var express = require('express');

var userRouter = express.Router();

type LoginForm = {
  loginId: string;
};

type RegisterForm = {
  loginId: string;
  name: string;
};

type RegisterResponse = {
  name: string;
  loginId: string;
};

class UserApi {
  userService: UserService;

  constructor() {
    this.userService = theUserService;
  }

  addRoutes(router: Router) {
    router.post('/login', this.login);
    router.post('/logout', this.logout);
    router.post('/register', this.register);
    router.get(
      '/',
      checkJwt,
      checkScope(['read:users']),
      this.getAllRegistered
    );
    router.get('/:loginId', this.getRegistered);
  }

  login = (req: Request<LoginForm>, res: Response<State>) => {
    var person = this.userService.lookup(req.body.loginId);
    if (!person) {
      res.status(404).end('player not found ' + req.body.id);
    } else {
      this.setState(res, (state) =>
        this.userService.login(state, req.body.loginId)
      );
    }
  };

  logout = (req: Request<LoginForm>, res: Response<State>) => {
    this.setState(res, (state) =>
      this.userService.logout(state, req.body.loginId)
    );
  };

  register = (req: Request<RegisterForm>, res: Response<RegisterResponse>) => {
    var loginId = this.userService.signUp(
      this.getState(),
      req.body.name,
      req.body.loginId
    );
    var person = this.userService.lookup(loginId);
    res.end(JSON.stringify(person));
  };

  getAllRegistered = (_req: Request, res: Response) => {
    res.end(JSON.stringify(this.userService.getRegistered()));
  };

  getRegistered = (req: Request<LoginForm>, res: Response) => {
    res.end(JSON.stringify(this.userService.lookup(req.params.loginId)));
  };

  private setState(res: Response, func: (state: State) => State) {
    var state = this.getState();
    var newState = func.call(this, state);
    res.end(server.setState(newState));
  }

  private getState(): State {
    return server.state;
  }
}
const blackjackApi = new UserApi();
blackjackApi.addRoutes(userRouter);
export default userRouter;
