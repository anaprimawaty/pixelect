var express = require('express')
var router = express.Router()
var helper = require('./helper')
var parser = require('./parser')

/* GET get groups of user
 * response -> [groups]/error
 */
router.get('/groups', helper.isAuthenticated, function(req, res) {
  var source = '[GET /users/groups]'
  var models = req.app.get('models')

  models.User.findOne({
    where: {facebookId: req.session.facebookId},
    attributes: {exclude: ['lastName','createdAt','updatedAt']},
    include: [{
      model: models.Group,
      as: 'Groupings',
      attributes: {exclude: ['createdAt','updatedAt']},
      through: {attributes:[]},
      include: [{
        model: models.User,
        as: 'Members',
        attributes: {exclude: ['lastName','createdAt','updatedAt']},
        through: {attributes:[]}
      }]
    }],
    order: [[{model: models.Group, as: 'Groupings'}, 'createdAt', 'DESC']]
  })
  .then(info => {
    info = info.toJSON()['Groupings']
    Promise.all(
      info.map(grouping => {
        return models.Photo
        .findOne({
          attributes: ['link'],
          where: {
            groupId: grouping.id
          }
        })
        .then(photo => {
          if (photo) {
            grouping.link = photo.link
          } else {
            grouping.link = ""
          }
        })
      })
    ).then(() => {
      helper.log(source, 'Success: Got groups of user with facebookId:' + req.session.facebookId)
      res.send(info)
    })
  })
})

/* POST set session.facebookId. create user if user does not exist
 * body -> {facebookId: facebookId of user, name: firstName of user}
 * response -> success/error
 */
router.post('/', function(req, res) {
  var source = '[POST /users/]'
  var models = req.app.get('models')
  var facebookId = req.body.facebookId

  helper.getUser(models, facebookId)
  .then(user => {
    req.session.facebookId = facebookId
    helper.log(source, 'Success: userId:' + user.id + ' logged in')
    res.send(helper.success())
  })
  .catch(e => {
    models.User.create({
      firstName: req.body.name,
      lastName: 'null',
      facebookId: facebookId,
    })
    .then(user => {
      req.session.facebookId = facebookId
      helper.log(source, 'Success: userId:' + user.id + ' signed up')
      res.send(helper.success())
    })
    .catch(e => {
      helper.log(source, e)
      res.status(500).send(helper.error(e))
    })
  })
})

module.exports = router
