var mongoose = require('../lib/mongoose'),
		crypto = require('crypto');

var adminSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	hashedPassword: {
		type: String,
		required: true
	},
	salt: {
		type: String,
		required: true
	},
	avatar: String,
	info: String,
	logo: String
});

adminSchema.methods.encryptPassword = function(password) {
	return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

adminSchema.methods.checkPassword = function(password) {
	return this.encryptPassword(password) === this.hashedPassword;
};

adminSchema.virtual('password')
	.set(function(password) {
		this._plainPassword = password;
		this.salt = Math.random() + '',
		this.hashedPassword = this.encryptPassword(password)
	})
	.get(function() {
		return this._plainPassword;
	});

module.exports = mongoose.model('Admin', adminSchema);