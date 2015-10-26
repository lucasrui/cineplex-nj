var Movie = require('../models/movie');
var _ = require('underscore');

//admin page
exports.new = function(req, res) {
	res.render('admin', {
		title: 'cineplex 后台',
		movie: {
			title: '',
			doctor: ''/*,
			country: '',
			year: '',
			poster: '',
			flash: '',
			summary: '',
			language: ''*/
		}
	});
}
//detail page
exports.detail = function(req, res) {
	var id = req.params.id;
	Movie.findById(id, function(err, movie) {
		if(movie){
			res.render('detail', {
				title: 'cineplex 详情' + movie.title,
				movie: movie
			});
		}else {
			res.render('index', {
				title: 'cineplex 首页'
			});
		}
	});
}
//admin update
exports.update = function(req, res) {
	var id = req.params.id;
	if(id) {
		Movie.findById(id, function(err, movie) {
			res.render('admin', {
				title: 'cineplex 后台',
				movie: movie
			});
		});
	}
}
//admin post movie
exports.save = function(req, res) {
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
			});
		});
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
		});
	}
}

// delete
exports.del = function(req, res) {
	var id = req.query.id;
	console.log('delete!!!' + id);
	if (id) {
		Movie.remove({_id: id}, function(err, movie) {
			if(err) {
				console.log(err);
				res.json({success: 0});
			}else {
				res.json({success: 1});
			}
		})
	}
}
//list page
exports.list = function(req, res) {
	Movie.fetch(function(err,movies) {
		if(err) {
			console.log(err);
		}
		res.render('list', {
			title: 'cineplex 列表页',
			movies: movies
		});
	});
}