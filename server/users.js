var express = require('express');
var router = express.Router();


/* GET user groups with user ID
 * params -> groupId: id of the group
 * response -> {groups}
 */
router.get('/groups', function(req, res) {
	var models = req.app.get('models')
	var session = req.app.get('session')
	models.User.findOne({
	    where: {
	      facebookId: session.facebookId
	    }
	})
	.then(user => {
	 	user.getGroups()
	 	.then(groups => {
	 		res.send(groups);
	 	})
	 	.catch(e => {
	 		console.log(e);
	 		res.send("Error finding groups of user");
		});
	 })
	 .catch(e => {
	 	console.log(e);
	 	res.send("Error finding user");
	 });
});

/* POST add user to database, set userId to session
 * body -> {name, facebookId}
 * response -> success/error
 */
router.post('/', function(req, res){
	var models = req.app.get('models')
	var session = req.app.get('session')
	models.User.findOne({
	    where: {
	      facebookId: session.facebookId
	    }
	}).then(function(user){
		session.facebookId = req.body.facebookId
		res.send('logged in')
	})
	.catch(e => {
	 	console.log('new user')
	 	models.User.create({
			firstName: req.body.name,
			lastName: "null",
			facebookId: req.body.facebookId
		}).then(function(){
			res.send('signed up')
			session.facebookId = req.body.facebookId
		}, function(error){
			console.log(error)
			res.send('error setting user')
		})
	 })
})

module.exports = router;