import { Router } from 'express';
var express = require('express');
var ws = require('ws');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var app = express();

import { Server } from 'ws';
var wss = new Server({port: 10116});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
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

var port = process.env.PORT || 5000;

app.listen(port, function () {
  console.log('Black jack server listening on port ' + port + '!');
});

module.exports = app;
