var express = require('express')
var router = express.Router()
var crypto = require('crypto');

function get_unique_groupName(id) {
  var data = new Date() + id;
  var groupName = crypto.createHash('md5').update(data).digest('hex');
  return groupName
}

/* GET specific group details with group ID
 * params -> groupId: id of the group
 * response -> {groupId, owner of the group}
 */
router.get('/:groupId', function(req, res){
	console.log('get group with id '+ req.params.groupId)
	var models = req.app.get('models')
	var groupId = req.params.groupId
	var group = models.Group
		.findById(groupId)
		.then(group => {
			if(group == null)
				res.send('group does not exist')
			else {
					res.send(group)
			}
		}, function(error){
			console.log(error)
			res.send("Error getting group");
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

/* GET group members with group ID
 * params -> groupId: id of the group
 * response -> {[users]}
 */
router.get('/:groupId/users', function(req, res) {
	var models = req.app.get('models');
	var groupId = req.params.groupId;
	 models.Group.find({
	 	where: {
	 		id: groupId,
	 	}
	 })
	.then(group => {
	 	group.getUsers()
	 	.then(users => {
	 		res.send(users);
	 	})
	 	.catch(e => {
	 		console.log(e);
	 		res.send("Error finding users of group");
		});
	 })
	 .catch(e => {
	 	console.log(e);
	 	res.send("Error finding group");
	 });
});


/* GET specific group photos with group ID
 * params -> groupId: id of the group
 * response -> {[{photoId, owner, votes}]}
 */
router.get('/:groupId/photos', function(req, res){
	var models = req.app.get('models')
	var groupPhotos = []
	var groupId = req.params.groupId 
	models.Photo.findAll()
		.then(function(photos){
			photos.forEach(function(photo1){
				if(photo1.groupId == groupId){
					var photo =JSON.parse(JSON.stringify(photo1))
					photo.votes = 0
					models.Vote.findAll()
					.then(function(votes){
						votes.forEach(function(vote){
							if(vote.photoId == photo.id && vote.isValid)
								photo.votes++ 
						})
					})
					groupPhotos.push(photo)
				}
			})
			res.send(groupPhotos)
		})
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
			hash: get_unique_groupName(session.facebookId)
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
		models.User.findById(userId).then(user => {
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