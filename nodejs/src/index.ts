import { Request, Response, RequestHandler } from 'express';

var express = require('express');
require('dotenv').config();
import jwksRsa from 'jwks-rsa';
import jwt from 'express-jwt';

export const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 60, // no more than 60 requests per minute
    jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuers: `https://${process.env.REACT_APP_AUTH0_DOMAIN}`,
  algorithms: ['RS256'],
});

// var ws = require('ws');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var app = express();

import { Server } from 'ws';
var realtimePort = 10116;
// var realtimeAPI = "ws://localhost:" + realtimePort;
var wss = new Server({ port: realtimePort });

//var httpProxy = require('http-proxy');
//var proxy = httpProxy.createProxyServer({ ws: true });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
// app.all("/ws", function (req: Request, res: Response) {
//   console.log("Received request to ws");
//   proxy.web(req, res, { target: realtimeAPI });
// });
import { BlackjackServer, BlackjackEmitter } from './routes/Server';

const listeners = new Array<WebSocket>();
const emitter = new BlackjackEmitter(listeners);
export const server = new BlackjackServer(emitter);
server.addRoutes(indexRouter);

wss.on('connection', function (ws: WebSocket) {
  console.log('client connected');
  listeners.push(ws);
});

wss.on('disconnect', function (ws: WebSocket) {
  listeners.splice(listeners.indexOf(ws), 1);
});

export function checkRole(role: string) {
  return function (req: any, res: Response, next: () => any) {
    // TODO: the code below changes depending on where the data is put in the jwt
    const assignedRoles = req.user['http://localhost:3000.roles'];
    if (Array.isArray(assignedRoles) && assignedRoles.includes(role)) {
      return next();
    } else {
      return res.status(401).send('Insufficient role');
    }
  };
}
// catch 404 and forward to error handler
// app.use(function(req: Request, res: Response) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err: Error, req: Request, res: Response) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

var port = process.env.PORT || 5050;

app.listen(port, function () {
  console.log('Black jack server listening on port ' + port + '!');
});

module.exports = app;
