var sequelize = require('sequelize')
var express = require('express')
var router = express.Router()
var helper = require('./helper')

/* GET get group with groupHash
 * params -> groupHash
 * response -> {group}/error
 */
router.get('/:groupHash', function(req, res) {
  var source = '[GET /groups/:groupHash]'
  var models = req.app.get('models')
  var groupHash = req.params.groupHash
  helper.getGroup(models, groupHash)
  .then(group => {
    helper.log(source, 'Success: groupId:' + group.id)
    res.send(group)
  })
  .catch(e => {
    helper.log(source, e)
    res.status(500).send(helper.error(e))
  })
})

/* GET get users of group with groupHash
 * params -> groupHash
 * response -> [users]/error
 */
router.get('/:groupHash/users', function(req, res) {
  var source = '[GET /groups/:groupHash/users]'
  var models = req.app.get('models')
  var groupHash = req.params.groupHash
  helper.getGroup(models, groupHash)
  .then(group => {
    group.getUsers()
    .then(users => {
      helper.log(source, 'Success: groupId:' + group.id)
      res.send(users)
    })
  })
  .catch(e => {
    helper.log(source, e)
    res.status(500).send(helper.error(e))
  })
})

/* GET specific group photos with group ID
 * params -> groupId: id of the group
 * response -> {[{photoId, owner, votes}]}
 */
router.get('/:groupId/photos', function(req, res) {
  var models = req.app.get('models')
  var session = req.app.get('session')
  var groupId = req.params.groupId

  var userId = models.User
    .findOne({ where: { facebookId: session.facebookId } })
    .then(user => user.id)

  var photos = models.Photo.findAll({
    where: { groupId },
    raw: true,
  })

  Promise.all([userId, photos]).then(([userId, photos]) =>
    Promise.all(
      photos.map(photo => {
        return models.Vote
          .findAll({
            attributes: ['userId'],
            where: {
              photoId: photo.id,
              isValid: true,
            },
            raw: true,
          })
          .then(votes => {
            photo.voted = votes.some(v => v.userId === userId)
            photo.votes = votes.length
          })
      })
    ).then(() => res.send(photos))
  )
})

/* POST change name of group with group ID
 * params -> groupId: id of the group
 * body -> {name: name of the group}
 * response -> success/error
 */
router.post('/:groupId/changeName', function(req, res){
	console.log('changing name of group with id '+ req.params.groupId)
	var models = req.app.get('models')
	var groupId = req.params.groupId
	var group = models.Group
	.findById(groupId)
	.then(group => {
		group.updateAttributes({
			name: req.body.name
		}).then(function(){
			res.send('success changing name')
		}, function(error){
			console.log(error)
			res.send('error changing name')
		})
	})
})

/* POST create new group
 * body -> {name: name of the group}
 * response -> success/error
 */
router.post('/', function(req, res){
	console.log('new group')
	var models = req.app.get('models')
	var session = req.app.get('session')
	models.User.findOne({
	    where: {
	      facebookId: session.facebookId
	    }
	}).then(user => {
    	var owner = user.id
		models.Group.create({
			name: req.body.name,
			owner: owner,
			hash: helper.getHash(session.facebookId)
		}).then(group =>{
			console.log("success adding new group")
			models.User.findById(owner).then(user => {
				user.addGroup(group)
			});
			res.send(group)
		},function(error){
			console.log(error)
			res.send('error adding new group')
		})
	})
})

/* POST add user to existing group
 * params -> groupId: id of the group
 * body -> {name: name of the group,
 			facebookId: facebookId of the user}
 * response -> success/error
 */
router.post('/:groupId/addUser', function(req, res){
	console.log('add user')
	var groupId = req.params.groupId
	var userId = req.body.facebookId
	var models = req.app.get('models')
	models.User.findOne({
	    where: {
	      facebookId: userId
	    }
	}).then(user => {
    	userId = user.id
		models.User.findById(userId)
		.then(user => {
		   models.Group.findById(groupId).then(group => {
	    	 if(user == null || group == null)
	    	 	res.send('error adding user to group')
	    	 else{
	    	 	user.addGroup(group).
	    	 	then(function(){
	    	 		res.send('user added to group')	
	    	 	})
	    	 }
	   		})
	 	})
	 	.catch(e => {
	 		console.log(e);
	 		res.send("Error finding user");
		});
	})
})

/* POST delete specific group with group ID
 * params -> groupId: id of the group
 * response -> success/error
 */
router.post('/:groupId/delete', function(req, res){
	var session = req.app.get('session')
	console.log('delete group with id '+ req.params.groupId)
	var models = req.app.get('models')
	var groupId = req.params.groupId
	models.User.findOne({
	    where: {
	      facebookId: session.facebookId
	    }
	})
	.then(function(user){
		var group = models.Group
		.findById(groupId)
		.then(group => {
			if(group.owner == user.id){
				if(group == null)
					res.send('group does not exist')
				else {
						group.destroy().then(()=>{
							res.send('group deleted')
						})
				}
			}
			else
				res.send('Error deleting group')
		}, function(error){
			console.log(error)
			res.send("Error deleting group")
		})
	})
})


/* POST publish photos to facebook
 * params -> groupId: id of the group
 * body -> {name: name of the group}
 * response -> success/error
 */
router.post('/:id/publish', function(req, res){
	res.send('publish photos of group with id '+ req.params.id)
})


module.exports = router