var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var lessMiddleware = require('less-middleware');
var upload  = require('multer')({ dest: path.join(__dirname, 'static/upload/')});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.locals.UPLOAD_PATH = __dirname + '/static/upload/';

// uncomment after placing your favicon in /static
//app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, 'static')));
app.use(require('./middlewear')(app));


//routes
app.use('/', require('./routes/mall/index'));

app.use(['/admin/category', '/admin/menu', '/admin/event', '/admin/board_id'], require('./routes/admin/category'));
app.use('/admin/product', upload.any(), require('./routes/admin/product'));
app.use('/admin', require('./routes/admin/index'));


app.use('/api/product', upload.any(), require('./routes/admin/product'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('common/error');
});

module.exports = app;
