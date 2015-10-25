var mongoose = require('mongoose');
var util = require('../../public/libs/util');
var SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
	name: {
		unique: true,
		type: String
	},
	password: String,
	meta: {
		createAt:{
			type: Date,
			default: Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
})

UserSchema.pre('save',function(next) {
	var user = this;

	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else {
		this.meta.updateAt = Date.now();
	}

	var str = user.password;
	user.password = util.md5(str);

	next();
});

UserSchema.methods = {
	comparePassword: function(_password, cb){
		if(util.md5(_password)==this.password){
			cb(null, true);
		}else {
			cb(false);
		}
	}
}

UserSchema.statics = {
	fetch: function(cb) {
		return this.find({}).sort('meta.updateAt').exec(cb);
	},
	findById: function(id, cb) {
		return this.findOne({_id: id}).exec(cb);
	}
}

module.exports = UserSchema;