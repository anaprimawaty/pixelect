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

<<<<<<< Updated upstream
module.exports = router;
=======
/* POST set session.facebookId. create user if user does not exist
 * body -> {facebookId: facebookId of user, name: firstName of user}
 * response -> success/error
 */
router.post('/delete', function(req, res) {
  var source = '[POST /users/delete]'
  var models = req.app.get('models')
  helper.log(req.body.signed_request)
  var data = parser.parse_signed_request(req.body.signed_request, process.env.PIXELECT_APP_SECRET)
  helper.log(data)

  /*  helper.getUser(models, req.session.facebookId)
  .then(user => {
    var userId = user.id
    user.destroy()
    .then(function(){
      helper.log(source, 'Success: userId:' + user.id + '\'s account deleted')
      res.send(helper.success())
    })
    .catch(e => {
      helper.log(source, e)
      res.send('Error deleting user account')
    })
    models.Group.destroy({
      where:{
        owner: userId
      }
    })
    .then(function(){
        helper.log(source, 'Success: userId:' + user.id + '\'s groups deleted')
      })
    .catch(e => {
      helper.log(source, e)
      res.send('Error deleting user\'s groups')
    })
    models.Photo.destroy({
      where:{
        userId: userId
      }
    })
    .then(function(){
        helper.log(source, 'Success: userId:' + user.id + '\'s photos deleted')
      })
    .catch(e => {
      helper.log(source, e)
      res.send('Error deleting user\'s photos')
    })
    models.Vote.destroy({
      where:{
        userId: userId
      }
    })
    .then(function(){
        helper.log(source, 'Success: userId:' + user.id + '\'s votes deleted')
      })
    .catch(e => {
      helper.log(source, e)
      res.send('Error deleting user\'s votes')
    })
  })
  .catch(e => {
    helper.log(source, e)
    res.status(500).send(helper.error(e))
  })*/
})


module.exports = router
>>>>>>> Stashed changes
