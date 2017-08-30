var express = require('express');
var router = express.Router();

/* POST set userId to session
 * body -> {facebookId}
 * response -> success/error
 */
router.post('/loggedIn', function(req, res){
	var session = req.app.get('session')
	session.facebookId = req.body.facebookId
	res.send('success')
})

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

/* POST add new user to database
 * body -> {name, facebookId}
 * response -> {groups}
 */
router.post('/', function(req, res){
	var models = req.app.get('models')
	var session = req.app.get('session')
	models.User.create({
		firstName: req.body.name,
		lastName: "null",
		facebookId: req.body.facebookId
	}).then(function(){
		res.send('success')
		session.facebookId = req.body.facebookId
	}, function(error){
		console.log(error)
		res.send('error setting user')
	})
})

module.exports = router;