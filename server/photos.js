var express = require('express')
var router = express.Router()
var multer = require('multer')
var uploader = multer()
var helper = require('./helper')

 /* POST upload photo and create photo object in db
  * body -> {groupHash, ext}
  * response -> success/error
  */
router.post('/create', uploader.single('file'), function(req, res, next) {
  var source = '[POST /photos/create]'
  var models = req.app.get('models')
  var session = req.app.get('session')
  var s3 = req.app.get('s3')
  var file = req.file.buffer
  var filename = helper.getHash(session.facebookId) + req.body.ext
  s3.putObject(
    'pixelectstaging',
    filename,
    file,
    'application/octet-stream',
    function(error, etag) {
      if (error) {
        helper.log(source, 'Error: Failed to upload file: ' + error)
        res.status(500).send(helper.error('Failed to upload file'))
      } else {
        helper.log(source, 'Success: File uploaded successfully')
        var status = storePhoto(models, session.facebookId, req.body.groupHash, filename, source)
        res.send(status)
      }
    }
  )
})

function storePhoto(models, facebookId, groupHash, filename, source) {
  helper.getUser(models, facebookId)
  .then(user => {
    return new Promise(function(resolve, reject) {
      helper.getGroup(models, groupHash)
      .then(group => {
        models.Photo.create({
          link: 'https://s3-ap-southeast-1.amazonaws.com/pixelectstaging/' + filename,
          userId: user.id,
          groupId: group.id,
        })
        .then(photo => {
          resolve(photo)
        })
        .catch(e => {
          reject(e)
        })
      }).catch(e => {
        reject(e)
      })
    })
  })
  .then(photo => {
    helper.log(source, 'Success: Photo object created successfully')
    return helper.success()
  })
  .catch(e => {
    helper.log(source, e)
    return helper.error(e)
  })
}

/* POST delete specific photo with photoId
 * body -> {photoId}
 * response -> success/error
 */
router.post('/delete', function(req, res) {
  var source = '[POST /photos/delete]'
  var models = req.app.get('models')
  var session = req.app.get('session')
  var photoId = req.body.photoId

  helper.getUser(models, session.facebookId)
  .then(user => {
    return new Promise(function(resolve, reject) {
      models.Photo.findById(photoId)
      .then(photo => {
        if (photo.userId === user.id) {
          resolve(photo)
        } else {
          reject('Error: facebookId:' + session.facebookId + ' cannot delete photoId:' + photoId)
        }
      })
      .catch(e => {
        reject('Error: No photo with photoId:' + photoId)
      })
    })
  })
  .then(photo => {
    return photo.destroy()
  })
  .then(photo => {
    helper.log(source, 'Success: Deleted photoId:' + photoId)
    res.send(helper.success())
  })
  .catch(e => {
    helper.log(source, e)
    res.status(500).send(helper.error(e))
  })
})

module.exports = router