var express = require('express');
var path  = require('path');
var bodyParser  = require('body-parser');
var cookieParser  = require('cookie-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var morgan = require('morgan');

var port  = process.env.PORT || 3000;
var app = express();

var dbUrl = 'mongodb://localhost/cineplex';
mongoose.connect(dbUrl); //连接数据库

var db = mongoose.connection; //创建一个数据库连接
db.on('error',console.error.bind(console,'连接错误:'));
db.once('open',function(){
  console.log('connected');
});

app.locals.moment = require('moment');

app.set('views','./app/views/pages');
app.set('view engine','jade');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // true可解析body为中数据为user[xx]为对象user
app.use(cookieParser());
app.use(session({
	secret: 'cineplex',
	store: new mongoStore({
		url: dbUrl,
		collection: 'sessions'
    })
}));
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
	app.set('showStackError', true);
	// app.use(morgan(':method :url :status'));
	app.use(morgan('tiny'));
	app.locals.pretty = true;
	mongoose.set('debug', true);
}

require('./config/routes')(app);

app.listen(port);

console.log('cineplex started on prot ' + port);