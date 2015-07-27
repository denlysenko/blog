var mongoose = require('../lib/mongoose'),
		Schema = mongoose.Schema;

var commentSchema = Schema({
	author: String,
	body: String,
	email: String,
	_post: {
		type: Schema.Types.ObjectId,
		ref: 'Post'
	},
	created: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Comment', commentSchema);
