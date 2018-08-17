var express = require('express');
var router = express.Router();

var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('test');
});

router.post('/login', function(req, res, next) {
	var param = {
		userName: req.body.userName,
		userPwd: req.body.userPwd
	}

	User.findOne(param, function(err, userDoc) {
		if (err) {
			res.json({
				status: '1',
				msg: err.message
			});
		} else {
			if (userDoc) {
				res.cookie('userId', userDoc.userId, {
					path: '/',
					maxAge: 1000*60*60
				});
				res.cookie('userName', userDoc.userName, {
					path: '/',
					maxAge: 1000*60*60
				}); 
				// req.session.user = userDoc;
				res.json({
					status: '0',
					msg: '',
					result: {
						userName: userDoc.userName
					}
				});	
			}
		}
	})
});

router.post('/logout', function(req, res, next) {
	res.cookie('userId', '', {
		path: '/',
		maxAge: -1
	})

	res.json({
		status: '0',
		msg: '',
		result: ''
	})
});

router.get('/checkLogin', function(req, res, next) {
	if (req.cookies.userId) {
		res.json({
			status: '0',
			msg: '',
			result: req.cookies.userName
		});
	} else {
		res.json({
			status: '1',
			msg: '未登录',
			result: ''
		})
	}
})

module.exports = router;
