var express = require('express')
var router = express.Router()
var multer = require('multer')
var upload = multer()
var helper = require('./helper')


router.post('/create', upload.single('file'), function(req, res, next) {
  var s3 = req.app.get('s3')
  var file = req.file.buffer
  var session = req.app.get('session')
  var filename = helper.getHash(session.facebookId)
  s3.putObject(
    'pixelectstaging',
    filename,
    file,
    'application/octet-stream',
    function(error, etag) {
      if (error) {
        return console.log(error)
      } else {
        storePhoto(req.app.get('models'), session.facebookId, filename)
        console.log('File uploaded successfully.')
        res.send('success!')
      }
    }
  )
})

function storePhoto(models, facebookId, filename) {
  models.User
    .findOne({
      where: {
        facebookId: facebookId,
      },
    })
    .then(user => {
      models.Photo.create({
        link:
          'https://s3-ap-southeast-1.amazonaws.com/pixelectstaging/' + filename,
        userId: user.get('id'),
        groupId: '1',
      })
    })
    .catch(e => {
      console.log(e)
      console.log('Cannot find User with facebookId')
    })
}

/* POST delete specific photo with photoId
 * params -> photoId
 * response -> success/error
 */
router.post('/:photoId/delete', function(req, res) {
  var models = req.app.get('models')
  var session = req.app.get('session')
  models.User
    .findOne({
      where: {
        facebookId: session.facebookId,
      },
    })
    .then(user => {
      models.Photo
        .findById(req.params.photoId)
        .then(function(photo) {
          if (photo.userId == user.id) {
            photo
              .destroy()
              .then(() => {
                res.send('photo deleted')
              })
              .catch(e => {
                console.log(e)
                res.send('Error deleting photo')
              })
          } else res.send('Error deleting photo')
        })
        .catch(e => {
          console.log(e)
          res.send('photo does not exist')
        })
    })
})

module.exports = router
