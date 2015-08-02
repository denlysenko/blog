var Post = require('../models/posts'),
		Comment = require('../models/comments'),
		config = require('../config'),
		transporter = require('nodemailer').createTransport({
			service: config.get('mailer:service'),
			auth: config.get('mailer:auth')
		}),
		async = require('async');

exports.showPost = function(req, res, next) {
	var slug = req.params.slug;
	Post.findOne({slug: slug}, function(err, post) {
		if(err) return next(err);
		if(post._comments.length) {
			var num = config.get('comments:num');
			Comment.find({_post: post._id}, null, {skip: 0, limit: num, sort:{created: -1}}, function(err, comments) {
				if(err) return next(err);
				res.render('post', {
					title: post.title,
					post: post,
					page: 'post',
					comments: comments
				});
			})
		} else {
			res.render('post', {
				title: post.title,
				post: post,
				page: 'post',
				comments: null
			});
		}
	});
};

exports.sendComment = function(req, res, next) {
	var name = req.body.name;
	var email = req.body.email;
	var message = req.body.comment;
	var id = req.params.id;
	var comment = new Comment({
		author: name,
		email: email,
		body: message,
		_post: id
	});
	async.waterfall([
		function(callback) {
			comment.save(function(err, comment) {
				if(err) return callback(err);
				callback(null, comment);
			})
		},
		function(comment, callback) {
			Post.findByIdAndUpdate(id, {$push: {_comments: comment._id}}, function(err, post) {
				if(err) return callback(err);
				callback(null, comment);
			});
		}
	], function(err, comment) {
		if(err) return next(err);
		res.redirect('back');
		transporter.sendMail({
			from: email,
			to: config.get('mailer:address'),
			subject: 'You have a comment from ' + name + ' ' + email,
			text: message
		}, function(err) {
			if(err) return next(err);
		});
	});
};

exports.loadMoreComments = function(req, res, next) {
	var num = config.get('comments:num'),
			skip = req.params.skip,
			id = req.params.id;

	async.series([
		function(callback) {
			Post.findById(id, function(err, post) {
				if(err) return callback(err);
				callback(null, post);
			})
		},
		function(callback) {
			Comment.find({_post: id}, null, {skip: skip, limit: num, sort:{created: -1}}, function(err, comments) {
				if(err) return callback(err);
				callback(null, comments);
			});
		}
	], function(err, results) {
			if(err) return next(err);
			res.render('blocks/comment_item', {
				comments: results[1],
				post: results[0]
			});
	});	
};

exports.addLike = function(req, res, next) {
	var id = req.params.id;
	Post.findByIdAndUpdate(id, {$inc:{likes: 1}}, function(err, post) {
		if(err) return next(err);
			res.json(post);
			transporter.sendMail({
			from: '',
			to: config.get('mailer:address'),
			subject: 'New like for ' + post.title,
			text: "You've got a new like for " + post.title
		}, function(err) {
			if(err) return next(err);
		});
	});
};
