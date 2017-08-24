var express = require('express')
var router = express.Router()

/*
router.get('/', function(req, res){
	var models = req.app.get('models');
	var  groups = [];
	var queried_group = models.
})
*/

router.get('/:id', function(req, res){
	console.log('get group with id '+ req.params.id)
	var models = req.app.get('models')
	var groupid = req.params.id
	var group = models.Group
		.findById(groupid)
		.then(group => {
			if(group == null)
				res.send('group does not exist')
			else
				res.send(group)
		}, function(error){
			res.send(error)
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
				name: req.params.name
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
	models.Group.create({
		name: req.body.name,
		owner: req.body.owner
	}).then(group =>{
		res.send("success adding new group")
	},function(error){
		console.log(error)
		res.send('error adding new group')
	})
})

router.post('/addUser', function(req, res){
	console.log('add user')
	var groupId = req.body.groupId
	var userId = req.body.userId
	var models = req.app.get('models')
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


router.post('/:id/publish', function(req, res){
	res.send('publish photos of group with id '+ req.params.id)
})

module.exports = router