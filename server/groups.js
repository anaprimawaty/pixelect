var express = require('express')
var router = express.Router()


router.post('/', function(req, res){
	var models = req.app.get('models')
	var  groups = []
	var userfbId = req.body.id
	models.User.findOne({
	    where: {
	      facebookId: userfbId
	    }
	}).then(user => {
		var userId = user.id
		models.UserGroup.findAll()
		.then(groups => {
			res.send(groups)
			//	groups.forEach(group){
			//		if(group.userId )
			//}
		})
	})
	var queried_group = models.Group
})


router.get('/:id', function(req, res){
	console.log('get group with id '+ req.params.id)
	var models = req.app.get('models')
	var groupid = req.params.id
	var group = models.Group
		.findById(groupid)
		.then(group => {
			if(group == null)
				res.send('group does not exist')
			else {
					res.send(group)
			}
		}, function(error){
			res.send(error)
		})
})

router.get('/:id/photos', function(req, res){
	var models = req.app.get('models')
	var groupPhotos = []
	var groupid = req.params.id 
	models.Photo.findAll()
		.then(function(photos){
			photos.forEach(function(photo1){
				if(photo1.groupId == groupid){
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

router.post('/:id/changeName', function(req, res){
	console.log('changing name of group with id '+ req.params.id)
	var models = req.app.get('models')
	var groupid = req.params.id
	var group = models.Group
	.findById(groupid)
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

router.post('/', function(req, res){
	console.log('new group')
	var models = req.app.get('models')
	var owner;
	models.User.findOne({
	    where: {
	      facebookId: req.body.owner
	    }
	}).then(user => {
    	owner = user.id
		models.Group.create({
			name: req.body.name,
			owner: owner
		}).then(group =>{
			console.log("success adding new group")
			res.send(group)
		},function(error){
			console.log(error)
			res.send('error adding new group')
		})
	})
})

router.post('/addUser', function(req, res){
	console.log('add user')
	var groupId = req.body.groupId
	var userId = req.body.userId
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
	    	 	user.setGroups([group]).
	    	 	then(function(){
	    	 		res.send('user added to group')	
	    	 	})
	    	 }
	   		})
	 	})
	})
})


router.post('/:id/publish', function(req, res){
	res.send('publish photos of group with id '+ req.params.id)
})

module.exports = router