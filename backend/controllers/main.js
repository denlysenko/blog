var Post = require('../models/posts'),
		config = require('../config'),
		transporter = require('nodemailer').createTransport({
			service: config.get('mailer:service'),
			auth: config.get('mailer:auth')
		});

exports.index = function(req, res, next) {
	res.render('index', {
		title: 'Blog',
		page: '/',
		num: config.get('posts:num')
	});
};		

exports.loadMorePosts = function(req, res, next) {
	var num = config.get('posts:num'),
			skip = req.params.skip;
	Post.find({}, null, {skip: skip, limit: num, sort:{created: -1}}, function(err, docs) {
		if(err) return next(err);
		res.render('blocks/preview', {
			posts: docs
		});
	});		
};

exports.about = function(req, res, next) {
	res.render('about', {
		title: 'About Me',
		page: 'about'
	});
};

exports.showContact = function(req, res, next) {
	res.render('contact', {
		title: 'Contact Me',
		page: 'contact'
	});
};

exports.sendMessage = function(req, res, next) {
	var name = req.body.name;
	var email = req.body.email;
	var message = req.body.message;

	res.send('ok');
	
	transporter.sendMail({
		from: email,
		to: config.get('mailer:address'),
		subject: 'New Message from ' + name + ' ' + email,
		text: message
	}, function(err, info) {
		if(err) return next(err);
	});
};

exports.showCategory = function(req, res, next) {
	var category = req.params.cat;
	category = category.charAt(0).toUpperCase() + category.slice(1);
	Post.find({category: category}, function(err, posts) {
		if(err) return next(err);
		res.render('index', {
			title: category,
			posts: posts,
			page: 'category'
		});
	});
};



