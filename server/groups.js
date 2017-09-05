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
    helper.log(source, 'Success: Got group with groupId:' + group.id)
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
    group.getMembers()
    .then(users => {
      helper.log(source, 'Success: Got users of group with groupId:' + group.id)
      res.send(users)
    })
  })
  .catch(e => {
    helper.log(source, e)
    res.status(500).send(helper.error(e))
  })
})

/* GET get photos and votes of group with groupHash
 * params -> groupHash
 * response -> [photo and votes]/error
 */
router.get('/:groupHash/photos', function(req, res) {
  var source = '[GET /groups/:groupHash/photos]'
  var models = req.app.get('models')
  var groupHash = req.params.groupHash

  var userId = helper.getUser(models, req.session.facebookId)
    .then(user => user.id)
    .catch(e => {
      helper.log(source, e)
      res.status(500).send(e)
    })

  var photos = new Promise(function(resolve, reject) {
    helper.getGroup(models, groupHash)
    .then(group => {
      models.Photo.findAll({
        where: { photoGroupId: group.id },
        raw: true
      })
      .then(photos => {
        resolve(photos)
      })
    })
    .catch(e => {
      helper.log(source, e)
      res.status(500).send(e)
    })
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
 * body -> {groupHash, name: name of the group}
 * response -> success/error
 */
router.post('/changeName', helper.hasAccess, function(req, res) {
  var source = '[POST /groups/changeName]'
  var models = req.app.get('models')
  var groupHash = req.body.groupHash

  helper.getGroup(models, groupHash)
  .then(group => {
    group.updateAttributes({
      name: req.body.name
    })
    .then(group => {
      helper.log(source, 'Success: Changed name of group with groupId:' + group.id)
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
 * body -> {name: name of the group (optional)}
 * response -> success/error
 */
router.post('/', helper.isAuthenticated, function(req, res) {
  var source = '[POST /groups/]'
  var models = req.app.get('models')

  helper.getUser(models, req.session.facebookId)
  .then(user => {
    models.Group.create({
      name: req.body.name,
      owner: user.id,
      hash: helper.getHash(req.session.facebookId).substring(0,20)
    })
    .then(group => {
      user.addGroupings(group)
      helper.log(source, 'Success: Created groupId:' + group.id)
      res.send(JSON.stringify({'Success': group.hash}))
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
 * body -> {groupHash, facebookId: facebookId of user}
 * response -> success/error
 */
router.post('/addUser', function(req, res) {
  var source = '[POST /groups/addUser]'
  var models = req.app.get('models')
  var groupHash = req.body.groupHash
  var facebookId = req.body.facebookId

  helper.getUser(models, facebookId)
  .then(user => {
    helper.getGroup(models, groupHash)
    .then(group => {
      user.addGroupings(group)
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
 * body -> {groupHash}
 * response -> success/error
 */
router.post('/delete', helper.hasAccess, function(req, res){
  var source = '[POST /groups/delete]'
  var models = req.app.get('models')
  var groupHash = req.body.groupHash

  helper.getUser(models, req.session.facebookId)
  .then(user => {
    return new Promise(function(resolve, reject) {
      helper.getGroup(models, groupHash)
      .then(group => {
        if (user.id === group.owner) {
          resolve(group)
        } else {
          reject('Error: facebookId:' + req.session.facebookId + ' cannot delete groupHash:' + groupHash)
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