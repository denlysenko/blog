var router = require('express').Router(),
		main  = require('../controllers/main'),
		posts = require('../controllers/posts');

router.get('/', main.index);
router.get('/posts/load_more/:skip', main.loadMorePosts);
router.get('/about', main.about);
router.get('/category/:cat', main.showCategory);
router.route('/contact')
	.get(main.showContact)
	.post(main.sendMessage);
router.get('/post/:category/:year/:month/:slug', posts.showPost);
router.get('/:id/comments/load_more/:skip', posts.loadMoreComments);
router.post('/post/:id/send_comment', posts.sendComment);
router.post('/post/:id/add_like', posts.addLike);


module.exports = router;
