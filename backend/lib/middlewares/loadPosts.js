var Post = require('../../models/posts'),
		config = require('../../config'),
		async = require('async');

module.exports = function(req, res, next) {
	var num = config.get('posts:num');
	async.series([
		function(callback) {
			Post.find({}, null, {skip: 0, limit: num, sort:{created: -1}}, function(err, docs) {
				if(err) return callback(err);
				callback(null, docs);
			});
		},
		function(callback) {
			Post.count({}, function(err, count) {
				if(err) return callback(err);
				callback(null, count);
			});
		}
	], function(err, results) {
		if(err) return next(err);
		posts = res.locals.posts = results[0];
		count = res.locals.count = results[1];
		next();
	});
};