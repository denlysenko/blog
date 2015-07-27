var Admin = require('../../models/admin');

module.exports = function(req, res, next) {
	Admin.find({}, function(err, admins) {
		if(err) return next(err);
		user = res.locals.user = admins[0];
		next();
	});
};