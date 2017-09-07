var express = require('express')
var router = express.Router()
var helper = require('./helper')
var parser = require('./parser')

/* POST deauthorization callback from facebook
 * body -> signed request from facebook
 * response -> success/error
 */
router.post('/', function(req, res) {
  var source = '[POST /deauth]'
  var models = req.app.get('models')
  var data = parser(req.body.signed_request, process.env.PIXELECT_APP_SECRET)

  helper.getUser(models, data.user_id)
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
  })
})


module.exports = router
