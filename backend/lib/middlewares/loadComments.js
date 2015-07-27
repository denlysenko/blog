var Comment = require('../../models/comments');

module.exports = function(req, res, next) {
	Comment.find({}, null, {sort:{created: -1}}, function(err, docs) {
		if(err) return next(err);
		comments = res.locals.comments = docs;
		next();
	});
};