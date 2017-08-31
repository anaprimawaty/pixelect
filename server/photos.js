var express = require('express')
var router = express.Router()
var crypto = require('crypto')
var multer = require('multer')
var upload = multer()

function get_unique_filename(id) {
  var data = new Date() + id
  var filename = crypto.createHash('md5').update(data).digest('hex')
  return filename
}

// TODO: Fix route and fix to post request
// TODO: Fix req.body
router.post('/create', upload.single('file'), function(req, res, next) {
  var s3 = req.app.get('s3')
  var file = req.file.buffer
  var filename = get_unique_filename(req.body['facebookId'])
  s3.putObject(
    'pixelectstaging',
    filename,
    file,
    'application/octet-stream',
    function(error, etag) {
      if (error) {
        return console.log(error)
      } else {
        storePhoto(req.app.get('models'), req.body['facebookId'], filename)
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

module.exports = router
