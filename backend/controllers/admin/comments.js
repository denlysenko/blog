var Comment = require('../../models/comments'),
		Post = require('../../models/posts'),
		async = require('async');

exports.showComments = function(req, res, next) {
	var id = req.params.id;
	Post.findById(id, function(err, post) {
		if(err) return next(err);
		res.render('admin/posts/edit_comments', {
			title: 'Edit Comments',
			post: post,
			page: 'edit'
		});
	});
};

exports.deleteComment = function(req, res, next) {
	var id = req.params.id;
	async.series([
		function(callback) {
			Comment.findByIdAndRemove(id, function(err, comment) {
				if(err) return callback(err);
				callback(null, comment);
			});
		},
		function(callback) {
			Post.findOneAndUpdate({_comments: id}, {$pull: {_comments: id}}, function(err, comments) {
				if(err) return callback(err);
				callback(null, comments);
			});
		}
	], function(err, results) {
		if(err) return next(err);
		res.render('admin/success', {
			title: 'Successfully removed',
			data: 'Comment by ' + results[0].author,
			page: 'comments'
		})
	});
};