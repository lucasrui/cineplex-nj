var express = require('express');
var path  = require('path');
var bodyParser  = require('body-parser');
var mongoose = require('mongoose');
var _ = require('underscore');
var Movie = require('./models/movie');
var port  = process.env.PORT || 3000;
var app = express();

mongoose.connect('mongodb://localhost/cineplex');

app.set('views','./views/pages');
app.set('view engine','jade');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser());

app.use(express.static(path.join(__dirname, 'bower_components')))

app.listen(port);

console.log('cineplex started on prot ' + port);

//index page
app.get('/', function(req, res) {
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
app.post('/admin/movie/new', function(res, req) {
	console.log(res.body);
	var movieObj = req.body.movie;
	if(!movieObj)console.log(req);
	var id = req.body.movie._id;
	var _movie
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
		res.render('lsit', {
			title: 'cineplex 列表页',
			movies: movies
		})
	})
})