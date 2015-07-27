var router = require('express').Router(),
		authenticate = require('../../lib/middlewares/authentication'),
		admin = require('../../controllers/admin/index');


router.get('/', admin.authentication);
router.post('/auth', authenticate, admin.index); 
router.post('/change_name', admin.changeName);
router.post('/change_password', admin.changePassword);
router.post('/change_info', admin.changeInfo);
router.post('/change_avatar', admin.changeAvatar);
router.post('/change_logo', admin.changeLogo);
router.get('/logout', admin.logout);


module.exports = router;