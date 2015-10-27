var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');


module.exports = function(app){
	// pre hanlder
	app.use(function(req, res, next) {
		console.log('session info');
		console.log(req.session.user);

		var _user = req.session.user;
		app.locals.user = _user;
		next();
	});
	//index page
	app.get('/', Index.index);

	// user
	app.post('/user/signup', User.signup);
	app.post('/user/signin', User.signin);
	app.get('/signin', User.showSignin);
	app.get('/signup', User.showSignup);
	app.get('/logout', User.logout);
	app.get('/admin/userlist', User.isSignin, User.isAdmin, User.list);
	app.delete('/admin/userlist', User.del);

	//movie
	app.get('/admin/movie', User.isSignin, User.isAdmin, Movie.new);
	app.get('/movie/:id', Movie.detail);
	app.get('/admin/movieupdate/:id', User.isSignin, User.isAdmin, Movie.update);
	app.post('/admin/movie/new', User.isSignin, User.isAdmin, Movie.save);
	app.get('/admin/movielist', User.isSignin, User.isAdmin, Movie.list);
	app.delete('/admin/list', User.isSignin, User.isAdmin, Movie.del);
}