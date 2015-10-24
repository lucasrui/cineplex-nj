var express = require('express');
var path  = require('path');
var bodyParser  = require('body-parser');
var cookieParser  = require('cookie-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var _ = require('underscore');

var Movie = require('./models/movie');
var User = require('./models/user');
var util = require('./public/libs/util');

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

app.set('views','./views/pages');
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
}))
app.use(express.static(path.join(__dirname, 'bower_components')))

app.listen(port);

console.log('cineplex started on prot ' + port);

//index page
app.get('/', function(req, res) {
	console.log('session info');
	console.log(req.session.user);
	var _user = req.session.user;
	if(_user) {
		app.locals.user = _user;
	}
	Movie.fetch(function(err,movies) {
		if(err) {
			console.log(err);
		}
		res.render('index', {
			title: 'cineplex 首页',
			movies: movies
		})
	})

	/*res.render('index', {
		title: 'cineplex 首页',
		movies: [{
		title: '机械战警',
		_id: 1,
		poster: 'http://img.mukewang.com/533e4ce900010ae802000200-100-100.jpg'
	},{
		title: '机械战警',
		_id: 2,
		poster: 'http://img.mukewang.com/533e4ce900010ae802000200-100-100.jpg'
	},{
		title: '机械战警',
		_id: 3,
		poster: 'http://img.mukewang.com/533e4ce900010ae802000200-100-100.jpg'
	}]
})*/
})

// signup
app.post('/user/signup', function(req, res) {
	var _user = req.body.user;
	console.log(req.body.user);
	
	User.find({name: _user.name}, function(err, user) {
		if(err) {
			console.log(err);
		}

		if(user) {
			return res.redirect('/');
		}else {
			var user = new User(_user);
			user.save(function(err, user) {
				if (err) {
					console.log(err);
				}
				res.redirect('/');
			})
		}
	})
})

// signin
app.post('/user/signin', function(req, res) {
	var _user = req.body.user;
	console.log(req.body.user);
	var password=_user.password;

	User.findOne({name: _user.name}, function(err, user) {
		if(err) {
			console.log(err);
		}

		if(!user) {
			console.log('there is no such user');
			return res.redirect('/');
		}
		user.comparePassword(password, function(err, isMatch) {
			if (isMatch) {
				req.session.user = user;
				return res.redirect('/');
			}else {
				console.log('password is not matched');
			}
		})
	})
});

// logout
app.get('/logout', function(req, res) {
	delete req.session.user;
	delete app.locals.user;
	res.redirect('/');
})

// userlist page
app.get('/admin/userlist', function(req, res) {
	User.fetch(function(err,users) {
		if(err) {
			console.log(err);
		}
		res.render('userlist', {
			title: 'cineplex 列表页',
			users: users
		})
	})
})

//detail page
app.get('/movie/:id', function(req, res) {
	var id = req.params.id;
	Movie.findById(id, function(err, movie) {
		res.render('detail', {
			title: 'cineplex 详情' + movie.title,
			movie: movie
		})
	})
})
//admin update
app.get('/admin/update/:id', function(req, res) {
	var id = req.params.id;
	if(id) {
		Movie.findById(id, function(err, movie) {
			res.render('admin', {
				title: 'cineplex 后台',
				movie: movie
			})
		})
	}
})
//admin post movie
app.post('/admin/movie/new', function(req, res) {
	var movieObj = {
		_id : req.body.movie_id,
		title : req.body.movie_title,
		doctor : req.body.movie_doctor
	}
	if(!movieObj)console.log(req.body.movie);
	var id = req.body.movie_id;
	var _movie;
	if(id !== 'undefined') {
		Movie.findById(id, function(err, movie) {
			if(err) {
				console.log(err);
			}
			_movie = _.extend(movie, movieObj);
			_movie.save(function(err, movie) {
				if(err) {
					console.log(err);
				}
				res.redirect('/movie/' + movie._id);
			})
		})
	}
	else {
		_movie = new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title
		})

		_movie.save(function(err, movie) {
			if(err) {
				console.log(err);				
			}
			res.redirect('/movie/' + movie._id);
		})
	}
})

//admin page
app.get('/admin/movie', function(req, res) {
	res.render('admin', {
		title: 'cineplex 后台',
		movie: {
			title: 'aa',
			doctor: ''/*,
			country: '',
			year: '',
			poster: '',
			flash: '',
			summary: '',
			language: ''*/
		}
	})
})

//list page
app.get('/admin/list', function(req, res) {
	Movie.fetch(function(err,movies) {
		if(err) {
			console.log(err);
		}
		res.render('list', {
			title: 'cineplex 列表页',
			movies: movies
		})
	})
})