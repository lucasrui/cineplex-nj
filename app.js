var express = require('express');
var path  = require('path');
var bodyParser  = require('body-parser');
var port  = process.env.PORT || 3000;
var app = express();

app.set('views','./views/pages');
app.set('view engine','jade');
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser());
app.use(bodyParser.json()); // for parsing application/json

app.use(express.static(path.join(__dirname, 'bower_components')))

app.listen(port);

console.log('cineplex started on prot ' + port);

//index page
app.get('/', function(req, res) {
	res.render('index', {
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
})
})

//detail page
app.get('/movie/:id', function(req, res) {
	res.render('detail', {
		title: 'cineplex 详情',
		movie: {
			doctor: '啊啊啊',
			country: '美国',
			title: '机械战警'
		}
	})
})

//admin page
app.get('/admin/movie', function(req, res) {
	res.render('admin', {
		title: 'cineplex 后台',
		movie: {
			title: '',
			doctor: '',
			country: '',
			year: '',
			poster: '',
			flash: '',
			summary: '',
			language: ''
		}
	})
})

//list page
app.get('/admin/list', function(req, res) {
	res.render('list', {
		title: 'cineplex 列表',
		movies: [{
			doctor: '啊啊啊',
			country: '美国',
			title: '机械战警'
		}]
	})
})