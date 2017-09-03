var express = require('express')
var router = express.Router()
var helper = require('./helper')

/* GET get groups of user
 * response -> [groups]/error
 */
router.get('/groups', helper.isAuthenticated, function(req, res) {
  var source = '[GET /users/groups]'
  var models = req.app.get('models')
  var session = req.app.get('session')

  helper.getUser(models, session.facebookId)
  .then(user => {
    user.getGroups()
    .then(groups => {
      helper.log(source, 'Success: Got groups of user with userId:' + user.id)
      res.send(groups)
    })
  })
  .catch(e => {
    helper.log(source, e)
    res.status(500).send(helper.error(e))
  })
})

/* POST set session.facebookId. create user if user does not exist
 * body -> {facebookId: facebookId of user, name: firstName of user}
 * response -> success/error
 */
router.post('/', function(req, res) {
  var source = '[POST /users/]'
  var models = req.app.get('models')
  var session = req.app.get('session')
  var facebookId = req.body.facebookId

  helper.getUser(models, facebookId)
  .then(user => {
    session.facebookId = facebookId
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
      session.facebookId = facebookId
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