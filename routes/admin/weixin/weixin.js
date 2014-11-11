var weixin = require('../../../module/weixin');
var weixinAPI = require('weixin-api');
var crypto = require('crypto');
exports.add = function(req, res, next){
	var email = req.body.email || '';
	var username = req.body.username || '';
	var pwd = req.body.pwd || '';
	if (!username) {
		req.flash('error','必须要输入微信号！');
		return res.redirect('weixin');
	}else if(!pwd){
		req.flash('error','必须要输入密码！');
		return res.redirect('weixin');
	}else{
		var md5 = crypto.createHash('md5')
		pwd = md5.update(req.body.pwd).digest('hex');
		weixin.findOne(username, function(err, doc){
			if(err){
				req.flash('error',err);
				return res.redirect('weixin/add');	
			}else{
				if(doc){
					req.flash('error','公众号已经存在');
					return res.redirect('weixin/add');
				}else{
					weixin.login(username,pwd);
					weixin.add({email:email, name:username, pass:pwd}, function(){
						res.redirect('weixin');
					});
				}
			}
		}); 
	}
}