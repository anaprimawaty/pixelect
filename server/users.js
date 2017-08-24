var express = require('express');
var router = express.Router();

router.get('/:userid', function(req, res) {
  var models = req.app.get('models');
  var userid = req.params.userid;
  var user = models.User
    .findById(userid)
    .then(user => {
    	if(user == null)
    		res.send('user does not exist')
      	else
      		res.send(user);
    });
});

router.post('/', function(req, res){
	var models = req.app.get('models');
	models.User.create({
		firstName: req.body.name,
		lastName: "",
		facebookId: req.body.id
	}).then(function(){
		res.send('success')
	}, function(error){
		console.log(error)
		res.send('error setting user')
	})
})

module.exports = router;