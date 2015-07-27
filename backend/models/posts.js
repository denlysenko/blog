var mongoose = require('../lib/mongoose'),
		Schema = mongoose.Schema,
		slugify = require('../lib/slugify'),
		moment = require('moment');

var postSchema = Schema({
	title: String,
	body: String,
	slug: String,
	created: {
		type: Date,
		default: Date.now
	},
	images: [{type: String}],
	category: String,
	likes: {
		type: Number,
		default: 0
	},
	_comments: [{
		type: Schema.Types.ObjectId,
		ref: 'Comment'
	}]
});

postSchema.pre('save', function(next) {
	this.slug = slugify(this.title);
	next();
});

postSchema.virtual('url').get(function() {
	var date = moment(this.created),
			formatted = date.format('YYYY[/]MM[/]');
	return this.category + '/' + formatted + this.slug;
});

postSchema.virtual('date').get(function() {
	var date = moment(this.created);
	return date.format('DD MMM');
});

module.exports = mongoose.model('Post', postSchema);