var router = require('express').Router(),
		posts = require('../../controllers/admin/posts'),
		comments = require('../../controllers/admin/comments');

router.route('/add')
	.get(posts.showForm)
	.post(posts.addPost);

router.get('/edit', posts.showPosts);	

router.route('/edit/:id')
	.get(posts.editPost)
	.post(posts.savePost);		

router.get('/delete/:id', posts.deletePost);	
router.get('/:id/comments', comments.showComments);
router.post('/:id/comments/:id', comments.deleteComment);

module.exports = router;		