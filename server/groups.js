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

/* POST change name of group with groupHash
 * params -> groupHash
 * body -> {name: name of the group}
 * response -> success/error
 */
router.post('/:groupHash/changeName', function(req, res) {
  var source = '[POST /groups/:groupHash/changeName]'
  var models = req.app.get('models')
  var groupHash = req.params.groupHash
  helper.getGroup(models, groupHash)
  .then(group => {
    group.updateAttributes({
      name: req.body.name
    })
    .then(group => {
      helper.log(source, 'Success: groupId:' + group.id)
      res.send(helper.success())
    })
    .catch(e => {
      helper.log(source, e)
      res.status(500).send(helper.error(e))
    })
  })
  .catch(e => {
    helper.log(source, e)
    res.status(500).send(helper.error(e))
  })
})

/* POST create new group
 * body -> {name: name of the group} (optional)
 * response -> success/error
 */
router.post('/', function(req, res) {
  var source = '[POST /groups/]'
  var models = req.app.get('models')
  var session = req.app.get('session')
  helper.getUser(models, session.facebookId)
  .then(user => {
    models.Group.create({
      name: req.body.name,
      owner: user.id,
      hash: helper.getHash(session.facebookId).substring(0,20)
    })
    .then(group => {
      user.addGroup(group)
      helper.log(source, 'Success: Created groupId:' + group.id)
      res.send(helper.success())
    })
    .catch(e => {
      helper.log(source, e)
      res.status(500).send(helper.error(e))
    })
  })
  .catch(e => {
    helper.log(source, e)
    res.status(500).send(helper.error(e))
  })
})

/* POST add user to existing group
 * params -> groupHash
 * body -> {facebookId: facebookId of user}
 * response -> success/error
 */
router.post('/:groupHash/addUser', function(req, res) {
  var source = '[POST /:groupHash/addUser]'
  var models = req.app.get('models')
  var groupHash = req.params.groupHash
  var facebookId = req.body.facebookId

  helper.getUser(models, facebookId)
  .then(user => {
    helper.getGroup(models, groupHash)
    .then(group => {
      user.addGroup(group)
      helper.log(source, 'Success: Added userId:' + user.id + ' to groupId:' + group.id)
      res.send(helper.success())
    })
    .catch(e => {
      helper.log(source, e)
      res.status(500).send(helper.error(e))
    })
  })
  .catch(e => {
    helper.log(source, e)
    res.status(500).send(helper.error(e))
  })
})

/* POST delete group with groupHash
 * params -> groupHash
 * response -> success/error
 */
router.post('/:groupHash/delete', function(req, res){
  var source = '[POST /:groupHash/delete]'
  var models = req.app.get('models')
  var session = req.app.get('session')
  var groupHash = req.params.groupHash

  helper.getUser(models, 4564)
  .then(user => {
    return new Promise(function(resolve, reject) {
      helper.getGroup(models, groupHash)
      .then(group => {
        if (user.id === group.owner) {
          resolve(group)
        } else {
          reject('Error: facebookId:' + 4564 + ' cannot delete groupHash:' + groupHash)
        }
      })
      .catch(e => {
        reject(e)
      })
    })
  })
  .then(group => {
    return group.destroy()
  })
  .then(group => {
    helper.log(source, 'Success: Deleted groupId:' + group.id)
    res.send(helper.success())
  })
  .catch(e => {
    helper.log(source, e)
    res.status(500).send(helper.error(e))
  })
})

module.exports = router