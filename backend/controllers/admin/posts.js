var Post = require('../../models/posts'),
		Comment = require('../../models/comments'),
		fs = require('fs'),
		async = require('async'),
		path = require('path');

exports.showForm = function(req, res) {
	res.render('admin/posts/add_post', {
		title: 'Add New Post', 
		page: 'add',
		post: null
	});
};

exports.addPost = function(req, res, next) {
	var title = req.body.title,
			cat = req.body.category,
			body = req.body.post,
			path;

	if(req.files.photo) {
		path = req.files.photo.path;
		path = path.replace('public', '');
	}

	var post = new Post({
		title: title,
		category: cat,
		body: body,
		images: path
	});
	post.save(function(err, post) {
		if(err) return next(err);
		res.render('admin/success', {
			title: 'Successfully Added', 
			data: post.title, 
			page:'add'
		});
	});		
};

exports.showPosts = function(req, res, next) {
	Post.find({}, null, {sort: {created: -1}}, function(err, posts) {
		if(err) return next(err);
		res.render('admin/posts/edit_post', {
			posts: posts,
			title: 'Edit Posts',
			page: 'edit'
		});
	});
};

exports.editPost = function(req, res, next) {
	var id = req.params.id;
	Post.findById(id, function(err, post) {
		if(err) return next(err);
		res.render('admin/posts/add_post', {
			title: 'Edit Post', 
			page: 'edit',
			post: post
		});
	});
};

exports.savePost = function(req, res, next) {
	var id = req.params.id,
			title = req.body.title,
			category = req.body.category,
			body = req.body.post,
			path;

	if(req.files.photo) {
		path = req.files.photo.path;
		path = path.replace('public', '');
		Post.findByIdAndUpdate(id, {$set:
			{title: title, 
			category: category, 
			body: body},
			$push: {images: path}
		}, function(err, post) {
			if(err) return next(err);
			res.render('admin/success', {
				title: 'Successfully Added', 
				data: post.title, 
				page:'add'
			});
		});
	} else {
		Post.findByIdAndUpdate(id, {
			title: title, 
			category: category, 
			body: body
		}, function(err, post) {
			if(err) return next(err);
			res.render('admin/success', {
				title: 'Successfully Added', 
				data: post.title, 
				page:'add'
			});
		});
	}		
};

exports.deletePost = function(req, res, next) {
	var id = req.params.id;
	
	async.waterfall([
		function(callback) {
			Post.findByIdAndRemove(id, function(err, post) {
				if(err) return callback(err);
				callback(null, post);
			});
		},
		function(post, callback) {
			if(post._comments.length) {
				Comment.remove({_post: id}, function(err) {
					if(err) return callback(err);
					callback(null, post);
				});
			} else {
				callback(null, post);
			}
		},
		function(post, callback) {
			if(post.images.length) {
				var images = post.images;

				async.each(images, function(img, callback) {
					img = path.normalize(__dirname + '../../../public' + img);
					fs.unlink(img, function(err) {
						if(err) return callback(err);
					});
				}, callback(null, post));
			} else {
				callback(null, post);
			}
		}
	], function(err, post) {
		if(err) return next(err);
		res.render('admin/success', {
			title: 'Successfully Removed', 
			data: post.title, 
			page:'edit'
		});
	})
};