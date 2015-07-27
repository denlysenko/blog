var Admin = require('../../models/admin');

exports.authentication = function(req, res) {
	if(!req.session.uid) {
		res.render('admin/authenticate', {title: 'Authentication'});
	} else {
		res.render('admin/index', {
			title: 'Admin Panel', 
			page: '/'
		});
	}
};

exports.index = function(req, res, next) {
	res.render('admin/index', {
		title: 'Admin Panel',
		page: '/'
	});
};		

exports.changeName = function(req, res, next) {
	var username = req.body.newName.trim();
	var id = req.session.uid;

	Admin.findByIdAndUpdate(id, {username: username}, function(err, admin) {
		if(err) return next(err);
		res.render('admin/success', {
			title: 'Successfully Updated', 
			data: admin.username, 
			page: '/'
		});
	})
};

exports.changePassword = function(req, res, next) {
	var id = req.session.uid;
	var password = req.body.newPassword.trim();
	
	Admin.findById(id, function(err, admin) {
		if(err) return next(err);
		admin.password = password;
		admin.save(function(err) {
			res.render('admin/success', {
				title: 'Successfully changed', 
				data: ' password', 
				page:'/'
			});
		});
	});
};

exports.changeInfo = function(req, res, next) {
	var id = req.session.uid;
	var info = req.body.newInfo;
	
	Admin.findByIdAndUpdate(id, {info: info}, function(err) {
		if(err) return next(err);
		res.render('admin/success', {
			title: 'Successfully changed', 
			data: ' main info', 
			page:'/'
		});
	});
};

exports.changeAvatar = function(req, res, next) {
	var id = user._id;
	var path = req.files.avatar.path;
	path = path.replace('public', '');

	Admin.findByIdAndUpdate(id, {avatar: path}, function(err, admin) {
		if(err) return next(err);
		res.render('admin/success', {
			title: 'Successfully changed', 
			data: ' Avatar', 
			page:'/'
		});
	});
};

exports.changeLogo = function(req, res, next) {
	var id = user._id;
	var path = req.files.logo.path;
	path = path.replace('public', '');

	Admin.findByIdAndUpdate(id, {logo: path}, function(err, admin) {
		if(err) return next(err);
		res.render('admin/success', {
			title: 'Successfully changed', 
			data: ' Logo', 
			page:'/'
		});
	});
};

exports.logout = function(req, res) {
	req.session.destroy();
	res.redirect('/');
};