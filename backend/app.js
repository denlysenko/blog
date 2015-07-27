var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var config = require('./config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  resave: config.get('session:resave'), 
  saveUninitialized: config.get('session:saveUninitialized'), 
  secret: config.get('session:secret'),
  key: config.get('session:key'),
  cookie: config.get('session:cookie')
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./lib/middlewares/loadUser')); //load user once to use in all views and save it in res.locals
app.use(require('./lib/middlewares/loadPosts'));
app.use('/admin', require('./lib/middlewares/loadComments'));


app.use('/', require('./routes/routes'));
app.use('/admin/posts', multer({
  dest: './public/images/posts',
  rename: function(fieldname, filename) {return filename;}
}),require('./routes/admin/posts'));
app.use('/admin', multer({
  dest: './public/images/admin', 
  rename:function(fieldname, filename) {
    return filename;
}}), require('./routes/admin'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      page: 'error'
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
