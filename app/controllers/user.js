var User = require('../models/user');
// signup
exports.showSignup = function(req, res) {
	res.render('signup', {
		title: 'cineplex 注册页面'
	})
}
exports.signup = function(req, res) {
	var _user = req.body.user;
	console.log(req.body.user);
	
	User.findOne({name: _user.name}, function(err, user) {
		if(err) {
			console.log(err);
		}

		if(user) {
			console.log('same user name');
			return res.redirect('/');
		}else {
			var user = new User(_user);
			user.save(function(err, user) {
				if (err) {
					console.log(err);
				}
				console.log('signup success');
				res.redirect('/');
			});
		}
	});
}

// signin
exports.showSignin = function(req, res) {
	res.render('signin', {
		title: 'cineplex 登录页面'
	})
}
exports.signin = function(req, res) {
	var _user = req.body.user;
	console.log(req.body.user);
	var password=_user.password;

	User.findOne({name: _user.name}, function(err, user) {
		if(err) {
			console.log(err);
		}
		console.log('user info');
		console.log(user);
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
		});
	});
}

// logout
exports.logout = function(req, res) {
	delete req.session.user;
	res.redirect('/');
}

// userlist page
exports.list = function(req, res) {
	User.fetch(function(err,users) {
		if(err) {
			console.log(err);
		}
		res.render('userlist', {
			title: 'cineplex 列表页',
			users: users
		});
	});
}

// userlist delete
exports.del = function(req, res) {
	var id = req.query.id;
	console.log('delete!!!' + id);
	if (id) {
		User.remove({_id: id}, function(err, user) {
			if(err) {
				console.log(err);
				res.json({success: 0});
			}else {
				res.json({success: 1});
			}
		})
	}
}