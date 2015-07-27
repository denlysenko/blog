var Admin = require('../../models/admin');

module.exports = function(req, res, next) {
	var password = req.body.password.trim();
	var username = req.body.username.trim();
	
	Admin.findOne({username: username}, function(err, admin) {
		if(err) return next(err);
		if(!admin) {
			return next(new Error('User not found'));
		} else {
			if(!admin.checkPassword(password)) {
				return next(new Error('Wrong password'))
			} else {
				req.session.uid = admin._id;
				user = res.locals.user = admin;
				next();
			}
		}
	});
};