var createError = require('http-errors');
var express = require('express');
var path = require('path');
var ejs = require('ejs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var goods = require('./routes/goods');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// 修改模板引擎
app.engine('.html', ejs.__express); 
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 登录拦截
app.use(function(req, res, next) {
	if (req.cookies.userId) {
		next()
	} else {
		if (req.path == '/api/users/login' || req.path == '/api/users/logout' || req.path =='/api/goods/list') {
			next();
		} else {
			res.json({
				status: '10001',
				msg: '请先登录',
				result: ''
			});
		}
	}
});

app.use('/', indexRouter);
app.use('/api/goods', goods);
app.use('/api/users', users)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
