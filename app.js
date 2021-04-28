var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const fileStore = require('session-file-store')(session);
var passport = require('passport');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishesRoute');
var promotionRouter = require('./routes/promotionRoute');
var leaderRouter = require('./routes/leaderRoute');
var authenticate = require('./authenticate');
var config = require('./config');

const Dishes = require('./model/dishes');
const Promotion = require('./model/promotion');
const Leader = require('./model/leader');

const url =config.mongoUrl;
const connect = mongoose.connect(url, {useNewUrlParser: true,useUnifiedTopology: true});

connect.then((db) => {
  console.log('connected sucssesfully...');
}, (err) => { console.log(err) });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('1234-06543-90876-129086-43559'));
app.use(session({
  name: 'session-id',
  resave: false,
  secret: '1234-06543-90876-129086-43559',
  store: new fileStore()
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

function auth(req, res, next) {
  if (!req.user) {
    
      var err = new Error('You are not Authenticated!!');
      err.status = 403;
      return next(err);
  }
  else {
      next();
    }

}

app.use(auth);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes', dishRouter);
app.use('/promotion', promotionRouter);
app.use('/leader', leaderRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
