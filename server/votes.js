var express = require('express')
var router = express.Router()
var helper = require('./helper')

function canVote(models, photoId, user) {
  return new Promise(function(resolve, reject) {
    models.Photo.findById(photoId)
    .then(photo => {
      if (!photo) {
        reject('Error: No Photo with photoId:' + photoId)
      }
      models.UserGroup.findOne({
        where: { groupId: photo.groupId, userId: user.id }
      })
      .then(ug => {
        if (ug) {
          resolve()
        } else {
          reject('Error: facebookId:' + user.facebookId + ' cannot vote for photoId:' + photoId)
        }
      })
    })
  })
}

/* POST vote on a photo with photoId
 * body -> {photoId: photoId}
 * response -> success/error
 */
router.post('/', helper.isAuthenticated, function(req,res) {
  var source = '[POST /votes/]'
  var models = req.app.get('models')
  var photoId = req.body.photoId

  helper.getUser(models, req.session.facebookId)
  .then(user => {
    models.Vote.findOne({
      where: { userId: user.id, photoId: photoId }
    })
    .then(vote => {
      if (vote) {
        vote.update({ isValid: !vote.get('isValid') })
        .then(vote => {
          helper.log(source, 'Success: Toggled vote for userId:' + vote.userId + ' and photoId:' + vote.photoId)
          res.send(helper.success())
        })
      } else {
        canVote(models, photoId, user) // check if user can vote for photo
        .then(() => {
          models.Vote.create({ userId: user.id, photoId: photoId })
          .then(vote => {
            helper.log(source, 'Success: Created vote for userId:' + vote.userId + ' and photoId:' + vote.photoId)
            res.send(helper.success())
          })
        })
        .catch(e => {
          helper.log(source, e)
          res.status(500).send(e)
        })
      }
    })
  })
  .catch(e => {
    helper.log(source, e)
    res.status(500).send(e)
  })
})

module.exports = router